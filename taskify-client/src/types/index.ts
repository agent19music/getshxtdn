export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  authProvider: 'local' | 'google' | 'github';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  status: number;
  error: string;
}
