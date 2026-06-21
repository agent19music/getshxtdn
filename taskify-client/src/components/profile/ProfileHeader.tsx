import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';
import type { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
  onAvatarUpload: (updated: User) => void;
}

export function ProfileHeader({ user, onAvatarUpload }: ProfileHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AvatarUpload user={user} size={80} onUploadSuccess={onAvatarUpload} />
      <Text style={[styles.name, { color: colors.foreground }]}>{user.name}</Text>
      <Text style={[styles.email, { color: colors.foregroundMuted }]}>{user.email}</Text>
      {user.authProvider !== 'local' && (
        <View style={[styles.badge, { backgroundColor: colors.insetSurface }]}>
          <Text style={[styles.badgeText, { color: colors.foregroundMuted }]}>
            Signed in with {user.authProvider.charAt(0).toUpperCase() + user.authProvider.slice(1)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  name: {
    ...Typography.h2,
    fontFamily: Fonts.semibold,
    marginTop: Spacing.base,
  },
  email: {
    ...Typography.body,
    fontFamily: Fonts.regular,
    marginTop: Spacing.xs,
  },
  badge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 9999,
  },
  badgeText: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
});
