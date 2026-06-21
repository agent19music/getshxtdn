import { api } from '@/services/api';
import type { Task } from '@/types';

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
}

export async function getTasks(): Promise<Task[]> {
  const data = await api.get<TasksResponse>('/api/tasks');
  return data.tasks;
}

export async function createTask(data: {
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<Task> {
  const res = await api.post<TaskResponse>('/api/tasks', data);
  return res.task;
}

export async function updateTask(
  id: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'dueDate'>>,
): Promise<Task> {
  const res = await api.put<TaskResponse>(`/api/tasks/${id}`, data);
  return res.task;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/api/tasks/${id}`);
}
