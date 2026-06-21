import { api } from '@/services/api';
import type { AuthResponse } from '@/types';

export async function registerUser(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/register', { email, password, name }, true);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/login', { email, password }, true);
}

export async function socialLogin(
  provider: 'google' | 'github',
  idToken: string,
): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/social', { provider, idToken }, true);
}

export async function logoutUser(): Promise<void> {
  await api.post('/api/auth/logout');
}
