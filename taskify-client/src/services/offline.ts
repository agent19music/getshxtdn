import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task } from '@/types';

const CACHE_PREFIX = 'tasks_cache_';
const QUEUE_KEY = 'offline_queue';

export type CreateData = { title: string; description?: string; dueDate?: string };
export type UpdateData = Partial<Pick<Task, 'title' | 'description' | 'completed' | 'dueDate'>>;

export type QueuedOp =
  | { type: 'create'; tempId: string; data: CreateData; ts: number }
  | { type: 'update'; id: string; data: UpdateData; ts: number }
  | { type: 'delete'; id: string; ts: number };

export async function loadCachedTasks(userId: string): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + userId);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export async function saveCachedTasks(userId: string, tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + userId, JSON.stringify(tasks));
  } catch {}
}

export async function loadQueue(): Promise<QueuedOp[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as QueuedOp[];
  } catch {
    return [];
  }
}

export async function saveQueue(ops: QueuedOp[]): Promise<void> {
  try {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(ops));
  } catch {}
}

export async function enqueue(op: QueuedOp): Promise<void> {
  const queue = await loadQueue();
  queue.push(op);
  await saveQueue(queue);
}

export async function clearQueue(): Promise<void> {
  try {
    await AsyncStorage.removeItem(QUEUE_KEY);
  } catch {}
}

export function makeTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
