import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as userApi from '@/services/user.api';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { EditProfileForm } from '@/components/profile/EditProfileForm';
import { ChangePasswordSection } from '@/components/profile/ChangePasswordSection';
import { DangerZone } from '@/components/profile/DangerZone';
import { LogoutButton } from '@/components/profile/LogoutButton';
import { ThemeToggle } from '@/components/profile/ThemeToggle';
import { EmailDigestButton } from '@/components/profile/EmailDigestButton';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import { ErrorFallback } from '@/components/ui/ErrorFallback';
import { Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async () => {
    setError(null);
    try {
      const profile = await userApi.getProfile();
      updateUser(profile);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load profile');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [updateUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top }]}
      >
        <ProfileSkeleton />
      </ScrollView>
    );
  }

  if (error || !user) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top }]}
      >
        <ErrorFallback message={error ?? 'User not found'} onRetry={fetchProfile} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.surface, paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + Spacing.xl }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader user={user} onAvatarUpload={updateUser} />
      <ThemeToggle />
      <EmailDigestButton />
      <EditProfileForm user={user} />
      {user.authProvider === 'local' && <ChangePasswordSection />}
      <LogoutButton />
      <DangerZone />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
