import { API_BASE_URL } from '@/constants/config';
import { getAccessToken, getRefreshToken, saveTokens } from '@/services/storage';

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

let logoutCallback: (() => void) | null = null;
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export function setLogoutCallback(cb: () => void) {
  logoutCallback = cb;
}

async function attemptRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    await saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return true;
  } catch {
    return false;
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  skipAuth = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = await getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token refresh on 401
  if (res.status === 401 && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = attemptRefresh().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }

    const refreshed = await (refreshPromise ?? Promise.resolve(false));

    if (refreshed) {
      // Retry with new token
      const newToken = await getAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
      }
      res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      logoutCallback?.();
      throw new ApiError(401, 'Session expired. Please sign in again.');
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(res.status, data.error ?? 'Something went wrong');
  }

  return data as T;
}

function xhrUpload(
  path: string,
  formData: FormData,
  token: string | null,
): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}${path}`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.onload = () => {
      try {
        const data = xhr.status === 204 ? undefined : JSON.parse(xhr.responseText);
        resolve({ status: xhr.status, data });
      } catch {
        reject(new Error('Invalid response from server'));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

async function uploadRequest<T>(path: string, formData: FormData): Promise<T> {
  const token = await getAccessToken();
  let { status, data } = await xhrUpload(path, formData, token);

  if (status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = attemptRefresh().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });
    }
    const refreshed = await (refreshPromise ?? Promise.resolve(false));
    if (refreshed) {
      const newToken = await getAccessToken();
      ({ status, data } = await xhrUpload(path, formData, newToken));
    } else {
      logoutCallback?.();
      throw new ApiError(401, 'Session expired. Please sign in again.');
    }
  }

  if (status === 204) return undefined as T;
  if (status < 200 || status >= 300) {
    throw new ApiError(status, (data as Record<string, string>).error ?? 'Something went wrong');
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown, skipAuth = false) =>
    request<T>('POST', path, body, skipAuth),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string, body?: unknown) => request<T>('DELETE', path, body),
  upload: <T>(path: string, formData: FormData) => uploadRequest<T>(path, formData),
};

export { ApiError };
