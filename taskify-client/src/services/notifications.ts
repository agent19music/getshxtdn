import * as Notifications from 'expo-notifications';
import type { Task } from '@/types';

// Show notifications when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleTaskReminder(task: Task): Promise<void> {
  if (!task.dueDate) return;

  const dueDate = new Date(task.dueDate);
  const now = new Date();

  if (dueDate <= now) return;

  // Always cancel existing before rescheduling
  await cancelTaskReminder(task.id);

  const minutesBefore = new Date(dueDate.getTime() - 30 * 60 * 1000);

  // 30-minute-before reminder (only if that time is still in the future)
  if (minutesBefore > now) {
    await Notifications.scheduleNotificationAsync({
      identifier: `task-${task.id}-reminder`,
      content: {
        title: 'Task due soon',
        body: `"${task.title}" is due in 30 minutes`,
        data: { taskId: task.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: minutesBefore,
      },
    });
  }

  // At-due-time notification
  await Notifications.scheduleNotificationAsync({
    identifier: `task-${task.id}-due`,
    content: {
      title: 'Task due now',
      body: `"${task.title}" is due now`,
      data: { taskId: task.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dueDate,
    },
  });
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  await Promise.allSettled([
    Notifications.cancelScheduledNotificationAsync(`task-${taskId}-reminder`),
    Notifications.cancelScheduledNotificationAsync(`task-${taskId}-due`),
  ]);
}

export async function cancelAllReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
