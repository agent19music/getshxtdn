import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { useTasks } from '@/hooks/use-tasks';
import { TaskHeader } from '@/components/tasks/TaskHeader';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import type { Task } from '@/types';

const SEGMENTS = ['Pending', 'Completed'];

// Pin zone springs — emilkowalski style
const SPRING_ZONE = { damping: 24, stiffness: 260, mass: 1 };

export default function TaskDashboard() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = useWindowDimensions();
  const {
    pendingTasks,
    completedTasks,
    pinnedPendingTasks,
    unpinnedPendingTasks,
    pinnedIds,
    isLoading,
    error,
    isOnline,
    syncPending,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    toggleComplete,
    pinTask,
    unpinTask,
  } = useTasks();

  const [segmentIndex, setSegmentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const currentSegment = segmentIndex === 0 ? 'pending' : 'completed';

  // Pin zone animation
  const pinZoneProgress = useSharedValue(0);
  const pinZoneHighlight = useSharedValue(0);
  const pinThreshold = screenHeight * 0.45;

  const handleDragStart = useCallback(() => {
    pinZoneProgress.value = withSpring(1, SPRING_ZONE);
  }, []);

  const handleDragUpdate = useCallback(
    (absoluteY: number) => {
      const inZone = absoluteY < pinThreshold;
      pinZoneHighlight.value = withSpring(inZone ? 1 : 0, {
        damping: 18,
        stiffness: 500,
        mass: 0.5,
      });
    },
    [pinThreshold],
  );

  const handleDragEnd = useCallback(
    (taskId: string, absoluteY: number) => {
      const inZone = absoluteY < pinThreshold;
      const wasPinned = pinnedIds.has(taskId);

      if (inZone && !wasPinned) {
        pinTask(taskId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.success('Task pinned');
      } else if (!inZone && wasPinned) {
        unpinTask(taskId);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        toast('Task unpinned');
      }

      pinZoneProgress.value = withSpring(0, SPRING_ZONE);
      pinZoneHighlight.value = withSpring(0, SPRING_ZONE);
    },
    [pinThreshold, pinnedIds, pinTask, unpinTask],
  );

  // (pin zone rendered inside TaskList)

  // Handlers
  const handleAddPress = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleModalSubmit = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
      toast.success('Task updated');
    } else {
      await addTask(data);
      toast.success('Task created', {
        description: data.dueDate ? 'Reminder scheduled' : undefined,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      await removeTask(deleteTaskId);
      setDeleteTaskId(null);
      toast.success('Task deleted');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top }]}>
      <TaskHeader
        userName={user?.name ?? 'there'}
        taskCount={pendingTasks.length}
        onAddPress={handleAddPress}
      />
      <OfflineBanner isOnline={isOnline} syncPending={syncPending} />

      <View style={styles.segmentWrapper}>
        <SegmentedControl
          segments={SEGMENTS}
          selectedIndex={segmentIndex}
          onSelect={setSegmentIndex}
        />
      </View>

      <TaskList
        tasks={segmentIndex === 0 ? unpinnedPendingTasks : completedTasks}
        pinnedTasks={segmentIndex === 0 ? pinnedPendingTasks : []}
        isLoading={isLoading}
        error={error}
        segment={currentSegment}
        onToggleComplete={(id, completed) => {
          toggleComplete(id, completed);
          toast.success(completed ? 'Task done' : 'Task reopened');
        }}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteTaskId(id)}
        onRetry={fetchTasks}
        onAddTask={handleAddPress}
        onDragStart={handleDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
        pinZoneProgress={pinZoneProgress}
        pinZoneHighlight={pinZoneHighlight}
      />

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
      />

      <ConfirmDialog
        visible={deleteTaskId !== null}
        title="Delete task"
        message="This action cannot be undone. Are you sure?"
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTaskId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.base,
  },
});
