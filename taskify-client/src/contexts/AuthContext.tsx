import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '@/constants/config';
import { setLogoutCallback } from '@/services/api';
import * as authApi from '@/services/auth.api';
import * as userApi from '@/services/user.api';
import * as storage from '@/services/storage';
import type { User } from '@/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isNewUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const isAuthenticated = user !== null;
  const appState = useRef(AppState.currentState);

  // Configure Google Sign-In once
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: false,
      scopes: ['openid', 'email', 'profile'],
    });
  }, []);

  // ------ Logout (defined early so it can be set as callback) ------
  const isLoggingOut = useRef(false);

  const logout = useCallback(async () => {
    if (isLoggingOut.current) return;
    isLoggingOut.current = true;

    try {
      await authApi.logoutUser();
    } catch {
      // Best-effort — don't block logout on API failure
    }

    // Revoke Google access if applicable
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    } catch {
      // Ignore — user may not have signed in with Google
    }

    await storage.clearAll();
    setUser(null);
    setIsNewUser(false);
    isLoggingOut.current = false;
  }, []);

  // Register logout callback for API interceptor
  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  // ------ Hydrate session on mount ------
  useEffect(() => {
    async function hydrate() {
      try {
        const storedUser = await storage.getUser();
        const accessToken = await storage.getAccessToken();

        if (!storedUser || !accessToken) {
          setIsLoading(false);
          return;
        }

        // Validate token by fetching profile
        try {
          const profile = await userApi.getProfile();
          setUser(profile);
          await storage.saveUser(profile);
        } catch {
          // Token invalid/expired — refresh interceptor in api.ts handles retry.
          // If we still end up here, tokens are fully expired.
          await storage.clearAll();
        }
      } catch {
        await storage.clearAll();
      } finally {
        setIsLoading(false);
      }
    }

    hydrate();
  }, []);

  // ------ App state listener for token freshness ------
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active' && user) {
        // Silently refresh profile when app comes to foreground
        userApi.getProfile().then((profile) => {
          setUser(profile);
          storage.saveUser(profile);
        }).catch(() => {
          // Interceptor handles 401 → logout
        });
      }
      appState.current = nextState;
    });

    return () => sub.remove();
  }, [user]);

  // ------ Auth methods ------
  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.loginUser(email, password);
    await storage.saveTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    await storage.saveUser(res.user);
    setUser(res.user);
    setIsNewUser(false);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const res = await authApi.registerUser(email, password, name);
    await storage.saveTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    await storage.saveUser(res.user);
    setUser(res.user);
    setIsNewUser(true);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!GOOGLE_WEB_CLIENT_ID) {
      throw new Error('Google Sign-In is not configured. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your .env file.');
    }
    await GoogleSignin.hasPlayServices();
    const signInResult = await GoogleSignin.signIn();

    const idToken = signInResult.data?.idToken;
    if (!idToken) {
      throw new Error('Google Sign-In failed: no ID token returned');
    }

    const res = await authApi.socialLogin('google', idToken);
    await storage.saveTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
    await storage.saveUser(res.user);
    setUser(res.user);
    setIsNewUser(false);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    storage.saveUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isNewUser,
    login,
    register,
    signInWithGoogle,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
