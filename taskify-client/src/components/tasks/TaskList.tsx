import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { PushPin } from 'phosphor-react-native';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskEmptyState } from '@/components/tasks/TaskEmptyState';
import { TaskListSkeleton } from '@/components/tasks/TaskItemSkeleton';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import type { Task } from '@/types';

const PIN_ZONE_HEIGHT = 48;

interface TaskListProps {
  tasks: Task[];
  pinnedTasks?: Task[];
  isLoading: boolean;
  error: string | null;
  segment: 'pending' | 'completed';
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
  onAddTask: () => void;
  onDragStart?: () => void;
  onDragUpdate?: (absoluteY: number) => void;
  onDragEnd?: (taskId: string, absoluteY: number) => void;
  pinZoneProgress?: SharedValue<number>;
  pinZoneHighlight?: SharedValue<number>;
}

function PinZone({
  progress,
  highlight,
}: {
  progress: SharedValue<number>;
  highlight: SharedValue<number>;
}) {
  const { colors } = useTheme();

  const outerStyle = useAnimatedStyle(() => ({
    height: progress.value * PIN_ZONE_HEIGHT,
    opacity: progress.value,
    marginBottom: progress.value * Spacing.sm,
    overflow: 'hidden' as const,
  }));

  const innerStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + highlight.value * 0.6,
    borderColor:
      highlight.value > 0.5
        ? 'rgba(0,200,83,0.5)'
        : 'rgba(128,128,128,0.3)',
  }));

  return (
    <Animated.View style={[styles.pinZoneOuter, outerStyle]}>
      <Animated.View style={[styles.pinZoneInner, innerStyle]}>
        <PushPin size={14} color={colors.foregroundSubtle} weight="fill" />
        <Text style={[styles.pinZoneText, { color: colors.foregroundSubtle }]}>
          Drop to pin
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

export function TaskList({
  tasks,
  pinnedTasks = [],
  isLoading,
  error,
  segment,
  onToggleComplete,
  onEdit,
  onDelete,
  onRetry,
  onAddTask,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  pinZoneProgress,
  pinZoneHighlight,
}: TaskListProps) {
  const { colors } = useTheme();

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (error) {
    return <ErrorFallback message={error} onRetry={onRetry} />;
  }

  const totalCount = tasks.length + pinnedTasks.length;

  const listHeader = (
    <View>
      {/* Pin zone — inside the list, collapses to 0 height when not dragging */}
      {pinZoneProgress && pinZoneHighlight && (
        <PinZone progress={pinZoneProgress} highlight={pinZoneHighlight} />
      )}

      {/* Pinned section */}
      {pinnedTasks.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <PushPin size={13} color={colors.foregroundSubtle} weight="fill" />
            <Text style={[styles.sectionLabel, { color: colors.foregroundSubtle }]}>
              Pinned
            </Text>
          </View>
          {pinnedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isPinned
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={onDragStart}
              onDragUpdate={onDragUpdate}
              onDragEnd={onDragEnd}
            />
          ))}
          {tasks.length > 0 && (
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          )}
        </>
      )}
    </View>
  );

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskItem
          task={item}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
          onDragEnd={onDragEnd}
        />
      )}
      ListHeaderComponent={listHeader}
      ListEmptyComponent={
        totalCount === 0 ? (
          <TaskEmptyState segment={segment} onAddTask={onAddTask} />
        ) : null
      }
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing['2xl'],
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  sectionLabel: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  pinZoneOuter: {
    paddingHorizontal: Spacing.lg,
    height: 0,
  },
  pinZoneInner: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    height: PIN_ZONE_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  pinZoneText: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
