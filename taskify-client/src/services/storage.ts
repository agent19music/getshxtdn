import * as SecureStore from 'expo-secure-store';
import type { AuthTokens, User } from '@/types';

const KEYS = {
  ACCESS_TOKEN: 'taskify_access_token',
  REFRESH_TOKEN: 'taskify_refresh_token',
  USER: 'taskify_user',
} as const;

export async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, tokens.accessToken);
  await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, tokens.refreshToken);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
}

export async function saveUser(user: User): Promise<void> {
  await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function clearAll(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  await SecureStore.deleteItemAsync(KEYS.USER);
}
