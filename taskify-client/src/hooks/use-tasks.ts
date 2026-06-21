import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '@/contexts/AuthContext';
import * as tasksApi from '@/services/tasks.api';
import * as offline from '@/services/offline';
import { scheduleTaskReminder, cancelTaskReminder } from '@/services/notifications';
import type { Task } from '@/types';

const PINNED_KEY = 'pinned_task_ids';

export function useTasks() {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [syncPending, setSyncPending] = useState(false);

  // Stable ref so syncOfflineQueue can always read latest tasks
  const tasksRef = useRef<Task[]>([]);
  tasksRef.current = tasks;

  // Load pinned IDs from storage
  useEffect(() => {
    SecureStore.getItemAsync(PINNED_KEY).then((val) => {
      if (val) {
        try {
          setPinnedIds(new Set(JSON.parse(val)));
        } catch {}
      }
    });
  }, []);

  const persistPinned = useCallback((ids: Set<string>) => {
    SecureStore.setItemAsync(PINNED_KEY, JSON.stringify([...ids])).catch(() => {});
  }, []);

  // Forward-declare syncOfflineQueue so fetchTasks can call it
  const syncOfflineQueue = useCallback(async () => {
    const queue = await offline.loadQueue();
    if (queue.length === 0) return;

    setSyncPending(true);
    try {
      // Map tempId → real server id for create ops so subsequent updates/deletes can find them
      const idMap = new Map<string, string>();

      for (const op of queue) {
        try {
          if (op.type === 'create') {
            const created = await tasksApi.createTask(op.data);
            idMap.set(op.tempId, created.id);
            // Replace tempId task in local state with the real one
            setTasks((prev) =>
              prev.map((t) => (t.id === op.tempId ? created : t)),
            );
            scheduleTaskReminder(created).catch(() => {});
          } else if (op.type === 'update') {
            const realId = idMap.get(op.id) ?? op.id;
            const updated = await tasksApi.updateTask(realId, op.data);
            setTasks((prev) => prev.map((t) => (t.id === realId ? updated : t)));
            scheduleTaskReminder(updated).catch(() => {});
          } else if (op.type === 'delete') {
            const realId = idMap.get(op.id) ?? op.id;
            // Skip deleting temp tasks that were never created on server
            if (!realId.startsWith('temp_')) {
              await tasksApi.deleteTask(realId);
            }
            cancelTaskReminder(realId).catch(() => {});
          }
        } catch {
          // Best-effort: skip failed ops, they'll be lost — acceptable tradeoff
        }
      }

      await offline.clearQueue();
    } finally {
      setSyncPending(false);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const netState = await NetInfo.fetch();
    const online = netState.isConnected ?? false;

    if (!online) {
      const cached = await offline.loadCachedTasks(userId);
      setTasks(cached);
      setIsLoading(false);
      return;
    }

    try {
      const data = await tasksApi.getTasks();
      setTasks(data);
      if (userId) {
        offline.saveCachedTasks(userId, data).catch(() => {});
      }
    } catch (err: any) {
      // Fall back to cache on network error
      const cached = await offline.loadCachedTasks(userId);
      if (cached.length > 0) {
        setTasks(cached);
      } else {
        setError(err.message ?? 'Failed to load tasks');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Listen for connectivity changes
  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? false;
      setIsOnline(online);
      if (online) {
        // Drain queue then refresh
        syncOfflineQueue().then(() => fetchTasks()).catch(() => {});
      }
    });
    return unsub;
  }, [syncOfflineQueue, fetchTasks]);

  const addTask = useCallback(
    async (data: { title: string; description?: string; dueDate?: string }) => {
      const netState = await NetInfo.fetch();
      const online = netState.isConnected ?? false;

      if (!online) {
        const tempId = offline.makeTempId();
        const tempTask: Task = {
          id: tempId,
          title: data.title,
          description: data.description ?? '',
          completed: false,
          dueDate: data.dueDate ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTasks((prev) => {
          const next = [tempTask, ...prev];
          offline.saveCachedTasks(userId, next).catch(() => {});
          return next;
        });
        await offline.enqueue({ type: 'create', tempId, data, ts: Date.now() });
        return tempTask;
      }

      const task = await tasksApi.createTask(data);
      setTasks((prev) => {
        const next = [task, ...prev];
        offline.saveCachedTasks(userId, next).catch(() => {});
        return next;
      });
      scheduleTaskReminder(task).catch(() => {});
      return task;
    },
    [userId],
  );

  const editTask = useCallback(
    async (
      id: string,
      data: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'dueDate'>>,
    ) => {
      const netState = await NetInfo.fetch();
      const online = netState.isConnected ?? false;

      if (!online) {
        const now = new Date().toISOString();
        setTasks((prev) => {
          const next = prev.map((t) =>
            t.id === id ? { ...t, ...data, updatedAt: now } : t,
          );
          offline.saveCachedTasks(userId, next).catch(() => {});
          return next;
        });
        await offline.enqueue({ type: 'update', id, data, ts: Date.now() });
        return tasksRef.current.find((t) => t.id === id)!;
      }

      const updated = await tasksApi.updateTask(id, data);
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? updated : t));
        offline.saveCachedTasks(userId, next).catch(() => {});
        return next;
      });
      scheduleTaskReminder(updated).catch(() => {});
      return updated;
    },
    [userId],
  );

  const removeTask = useCallback(
    async (id: string) => {
      const netState = await NetInfo.fetch();
      const online = netState.isConnected ?? false;

      if (!online) {
        setTasks((prev) => {
          const next = prev.filter((t) => t.id !== id);
          offline.saveCachedTasks(userId, next).catch(() => {});
          return next;
        });
        await offline.enqueue({ type: 'delete', id, ts: Date.now() });
        cancelTaskReminder(id).catch(() => {});
        setPinnedIds((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Set(prev);
          next.delete(id);
          persistPinned(next);
          return next;
        });
        return;
      }

      await tasksApi.deleteTask(id);
      setTasks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        offline.saveCachedTasks(userId, next).catch(() => {});
        return next;
      });
      cancelTaskReminder(id).catch(() => {});
      setPinnedIds((prev) => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        persistPinned(next);
        return next;
      });
    },
    [userId, persistPinned],
  );

  const toggleComplete = useCallback(
    async (id: string, completed: boolean) => {
      const netState = await NetInfo.fetch();
      const online = netState.isConnected ?? false;

      if (!online) {
        const now = new Date().toISOString();
        setTasks((prev) => {
          const next = prev.map((t) =>
            t.id === id ? { ...t, completed, updatedAt: now } : t,
          );
          offline.saveCachedTasks(userId, next).catch(() => {});
          return next;
        });
        await offline.enqueue({ type: 'update', id, data: { completed }, ts: Date.now() });
        if (completed) {
          cancelTaskReminder(id).catch(() => {});
        }
        return;
      }

      const updated = await tasksApi.updateTask(id, { completed });
      setTasks((prev) => {
        const next = prev.map((t) => (t.id === id ? updated : t));
        offline.saveCachedTasks(userId, next).catch(() => {});
        return next;
      });
      if (completed) {
        cancelTaskReminder(id).catch(() => {});
      } else {
        scheduleTaskReminder(updated).catch(() => {});
      }
    },
    [userId],
  );

  const pinTask = useCallback(
    (id: string) => {
      setPinnedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        persistPinned(next);
        return next;
      });
    },
    [persistPinned],
  );

  const unpinTask = useCallback(
    (id: string) => {
      setPinnedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        persistPinned(next);
        return next;
      });
    },
    [persistPinned],
  );

  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);

  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const pinnedPendingTasks = useMemo(
    () => pendingTasks.filter((t) => pinnedIds.has(t.id)),
    [pendingTasks, pinnedIds],
  );

  const unpinnedPendingTasks = useMemo(
    () => pendingTasks.filter((t) => !pinnedIds.has(t.id)),
    [pendingTasks, pinnedIds],
  );

  return {
    tasks,
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
  };
}
