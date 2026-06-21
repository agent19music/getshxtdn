import React, { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { PushPin } from 'phosphor-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { Task } from '@/types';

// Emilkowalski-style springs — snappy, slightly bouncy
const SPRING_SNAP = { damping: 22, stiffness: 400, mass: 0.8 };
const SPRING_LIFT = { damping: 20, stiffness: 500, mass: 0.6 };

interface TaskItemProps {
  task: Task;
  isPinned?: boolean;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDragStart?: () => void;
  onDragUpdate?: (absoluteY: number) => void;
  onDragEnd?: (taskId: string, absoluteY: number) => void;
}

export function TaskItem({
  task,
  isPinned,
  onToggleComplete,
  onEdit,
  onDelete,
  onDragStart,
  onDragUpdate,
  onDragEnd,
}: TaskItemProps) {
  'use no memo';
  const { colors, shadows } = useTheme();
  const swipeableRef = useRef<Swipeable>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate).getTime() < Date.now();

  // Drag shared values
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);

  const handleToggle = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onToggleComplete(task.id, !task.completed);
  };

  const handleLongPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMenuVisible(true);
  };

  const fireDragStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDragStart?.();
  };
  const fireDragUpdate = (y: number) => onDragUpdate?.(y);
  const fireDragEnd = (y: number) => onDragEnd?.(task.id, y);

  const panGesture = Gesture.Pan()
    .activeOffsetY([-8, 8])
    .failOffsetX([-15, 15])
    .onStart(() => {
      'worklet';
      isDragging.value = true;
      scale.value = withSpring(1.03, SPRING_LIFT);
      runOnJS(fireDragStart)();
    })
    .onUpdate((e) => {
      'worklet';
      translateY.value = e.translationY;
      runOnJS(fireDragUpdate)(e.absoluteY);
    })
    .onEnd((e) => {
      'worklet';
      translateY.value = withSpring(0, SPRING_SNAP);
      scale.value = withSpring(1, SPRING_SNAP);
      isDragging.value = false;
      runOnJS(fireDragEnd)(e.absoluteY);
    })
    .onFinalize(() => {
      'worklet';
      translateY.value = withSpring(0, SPRING_SNAP);
      scale.value = withSpring(1, SPRING_SNAP);
      isDragging.value = false;
    });

  const dragStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 100 : 0,
  }));

  const handleMenuEdit = () => {
    setMenuVisible(false);
    onEdit(task);
  };

  const handleMenuDelete = () => {
    setMenuVisible(false);
    onDelete(task.id);
  };

  // Auto-execute on full swipe — close first so cancel doesn't leave it stuck open
  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    swipeableRef.current?.close();
    if (direction === 'left') {
      // Swiped right → revealed left actions → complete/undo
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onToggleComplete(task.id, !task.completed);
    } else {
      // Swiped left → revealed right actions → delete
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDelete(task.id);
    }
  };

  const renderRightActions = () => (
    <Pressable
      onPress={() => {
        swipeableRef.current?.close();
        onDelete(task.id);
      }}
      style={[styles.swipeAction, { backgroundColor: colors.danger }]}
    >
      <Text style={styles.swipeActionText}>Delete</Text>
    </Pressable>
  );

  const renderLeftActions = () => (
    <Pressable
      onPress={() => {
        swipeableRef.current?.close();
        handleToggle();
      }}
      style={[styles.swipeAction, { backgroundColor: colors.success }]}
    >
      <Text style={styles.swipeActionText}>
        {task.completed ? 'Undo' : 'Done'}
      </Text>
    </Pressable>
  );

  return (
    <>
      {/* Context menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <Pressable
            style={[styles.menuSheet, { backgroundColor: colors.popover }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.menuHandle} />
            <Text
              numberOfLines={1}
              style={[styles.menuTitle, { color: colors.foregroundMuted }]}
            >
              {task.title}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                { borderBottomColor: colors.border },
                pressed && { backgroundColor: colors.secondaryHoverBg },
              ]}
              onPress={handleMenuEdit}
            >
              <Text style={[styles.menuItemText, { color: colors.foreground }]}>Edit</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && { backgroundColor: colors.secondaryHoverBg },
              ]}
              onPress={handleMenuDelete}
            >
              <Text style={[styles.menuItemText, { color: colors.danger }]}>Delete</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Task card */}
      <Animated.View style={dragStyle}>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions}
          renderLeftActions={renderLeftActions}
          overshootRight={false}
          overshootLeft={false}
          onSwipeableOpen={handleSwipeableOpen}
        >
          <Card style={styles.card}>
            <View style={styles.inner}>
              {/* Tap area: checkbox + content */}
              <Pressable
                onPress={() => onEdit(task)}
                onLongPress={handleLongPress}
                style={styles.contentArea}
              >
                {/* Checkbox */}
                <Pressable onPress={handleToggle} hitSlop={8} style={styles.checkbox}>
                  <View
                    style={[
                      styles.checkboxOuter,
                      {
                        borderColor: task.completed ? colors.success : colors.borderStrong,
                        backgroundColor: task.completed ? colors.success : 'transparent',
                      },
                    ]}
                  >
                    {task.completed && <Text style={styles.checkmark}>{'\u2713'}</Text>}
                  </View>
                </Pressable>

                {/* Text content */}
                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    {isPinned && (
                      <PushPin
                        size={12}
                        color={colors.foregroundSubtle}
                        weight="fill"
                        style={styles.pinIcon}
                      />
                    )}
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.title,
                        { color: colors.foreground },
                        task.completed && {
                          textDecorationLine: 'line-through',
                          color: colors.foregroundSubtle,
                        },
                      ]}
                    >
                      {task.title}
                    </Text>
                  </View>
                  {task.description !== '' && (
                    <Text
                      numberOfLines={2}
                      style={[styles.description, { color: colors.foregroundMuted }]}
                    >
                      {task.description}
                    </Text>
                  )}
                  {task.dueDate && (
                    <Text
                      style={[
                        styles.dueDate,
                        { color: isOverdue ? colors.danger : colors.foregroundSubtle },
                      ]}
                    >
                      {formatDueDate(task.dueDate)}
                    </Text>
                  )}
                </View>
              </Pressable>

              {/* Drag handle */}
              <GestureDetector gesture={panGesture}>
                <Animated.View
                  style={[styles.dragHandle, { borderLeftColor: colors.border }]}
                >
                  <View style={styles.gripGrid}>
                    {[0, 1, 2, 3].map((row) => (
                      <View key={row} style={styles.gripRow}>
                        <View style={[styles.gripDot, { backgroundColor: colors.foregroundSubtle }]} />
                        <View style={[styles.gripDot, { backgroundColor: colors.foregroundSubtle }]} />
                      </View>
                    ))}
                  </View>
                </Animated.View>
              </GestureDetector>
            </View>
          </Card>
        </Swipeable>
      </Animated.View>
    </>
  );
}

function formatDueDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.floor(Math.abs(diffMins) / 60);
  const diffDays = Math.floor(Math.abs(diffMins) / 1440);

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (diffMins < 0) {
    if (diffDays >= 1) return `${diffDays}d overdue`;
    if (diffHours >= 1) return `${diffHours}h overdue`;
    return `${Math.abs(diffMins)}m overdue`;
  }

  if (diffMins < 60) return `Due in ${diffMins}m`;
  if (isToday) return `Today · ${timeStr}`;
  if (isTomorrow) return `Tomorrow · ${timeStr}`;
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${timeStr}`;
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.base,
  },
  checkbox: {
    paddingTop: 2,
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 15,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 4,
  },
  title: {
    ...Typography.body,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    flex: 1,
  },
  description: {
    ...Typography.caption,
    fontFamily: Fonts.regular,
    marginTop: Spacing.xs,
  },
  dueDate: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    marginTop: Spacing.xs,
  },
  // Drag handle
  dragHandle: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
  },
  gripGrid: {
    gap: 4,
  },
  gripRow: {
    flexDirection: 'row',
    gap: 4,
  },
  gripDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    opacity: 0.5,
  },
  // Swipe actions
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  swipeActionText: {
    color: '#FAFAFA',
    fontFamily: Fonts.medium,
    fontWeight: '500',
    fontSize: 14,
  },
  // Menu
  menuBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  menuSheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing['2xl'],
    overflow: 'hidden',
  },
  menuHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(128,128,128,0.3)',
    alignSelf: 'center',
    marginBottom: Spacing.base,
  },
  menuTitle: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  menuItem: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemText: {
    ...Typography.body,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
});
