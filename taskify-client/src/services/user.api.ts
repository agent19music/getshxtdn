import { api } from '@/services/api';
import type { User } from '@/types';

interface ProfileResponse {
  profile: User;
}

export async function getProfile(): Promise<User> {
  const data = await api.get<ProfileResponse>('/api/user/profile');
  return data.profile;
}

export async function updateProfile(data: {
  name?: string;
  avatarUrl?: string;
  currentPassword?: string;
  newPassword?: string;
}): Promise<User> {
  const res = await api.put<{ message: string; profile: User }>('/api/user/profile', data);
  return res.profile;
}

export async function deleteAccount(password?: string): Promise<void> {
  await api.delete('/api/user/account', password ? { password } : undefined);
}

export async function emailDigest(): Promise<{ message: string }> {
  return api.post('/api/user/email-digest');
}

interface UploadAvatarResponse {
  avatarUrl: string;
  user: User;
}

export async function uploadAvatar(uri: string, mimeType: string): Promise<User> {
  const formData = new FormData();
  const filename = uri.split('/').pop() ?? 'avatar.jpg';
  // React Native FormData accepts the blob-like object shape
  formData.append('avatar', { uri, type: mimeType, name: filename } as unknown as Blob);
  const res = await api.upload<UploadAvatarResponse>('/api/user/avatar', formData);
  return res.user;
}
