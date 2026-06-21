import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { toast } from 'sonner-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as userApi from '@/services/user.api';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';
import type { User } from '@/types';

function truncateUrl(url: string, start = 22, end = 10): string {
  if (url.length <= start + end + 3) return url;
  return `${url.slice(0, start)}...${url.slice(-end)}`;
}

interface EditProfileFormProps {
  user: User;
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { updateUser } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl ?? '');
  const [editingUrl, setEditingUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasChanges = name.trim() !== user.name || avatarUrl.trim() !== (user.avatarUrl ?? '');

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) { setError('Name cannot be empty'); return; }

    setLoading(true);
    setError('');
    try {
      const updated = await userApi.updateProfile({
        name: trimmedName,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      updateUser(updated);
      toast.success('Profile updated');
    } catch (err: any) {
      setError(err.message ?? 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Text style={[styles.heading, { color: colors.foreground }]}>Edit profile</Text>

      <Input
        label="Name"
        value={name}
        onChangeText={(text) => { setName(text); setError(''); }}
        containerStyle={styles.field}
      />

      {editingUrl ? (
        <View style={styles.field}>
          <Input
            label="Avatar URL"
            placeholder="https://..."
            value={avatarUrl}
            onChangeText={(text) => { setAvatarUrl(text); setError(''); }}
            autoCapitalize="none"
            keyboardType="url"
            autoFocus
          />
          <Pressable onPress={() => setEditingUrl(false)} style={styles.urlDoneBtn}>
            <Text style={[styles.urlDoneText, { color: colors.primaryText }]}>Done</Text>
          </Pressable>
        </View>
      ) : (
        <View style={[styles.field, styles.urlRow]}>
          <View style={styles.urlLabelCol}>
            <Text style={[styles.urlLabel, { color: colors.foregroundMuted }]}>Avatar URL</Text>
            <Text
              style={[styles.urlValue, { color: avatarUrl ? colors.foreground : colors.foregroundSubtle }]}
              numberOfLines={1}
            >
              {avatarUrl ? truncateUrl(avatarUrl) : 'Not set'}
            </Text>
          </View>
          <Pressable
            onPress={() => setEditingUrl(true)}
            style={[styles.urlEditBtn, { backgroundColor: colors.insetSurface, borderColor: colors.borderStrong }]}
          >
            <Text style={[styles.urlEditText, { color: colors.foregroundMuted }]}>Edit</Text>
          </Pressable>
        </View>
      )}

      {error !== '' && <Text style={[styles.feedback, { color: colors.danger }]}>{error}</Text>}

      <Button
        label="Save changes"
        onPress={handleSave}
        loading={loading}
        disabled={!hasChanges}
        fullWidth
        style={styles.button}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.base,
  },
  heading: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing.base,
  },
  field: {
    marginBottom: Spacing.base,
  },
  urlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  urlLabelCol: {
    flex: 1,
  },
  urlLabel: {
    ...Typography.label,
    fontFamily: Fonts.medium,
    marginBottom: Spacing.xs,
  },
  urlValue: {
    ...Typography.body,
    fontFamily: Fonts.regular,
  },
  urlEditBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  urlEditText: {
    ...Typography.label,
    fontFamily: Fonts.medium,
  },
  urlDoneBtn: {
    alignSelf: 'flex-end',
    marginTop: Spacing.xs,
  },
  urlDoneText: {
    ...Typography.label,
    fontFamily: Fonts.medium,
  },
  feedback: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  button: {
    marginTop: Spacing.xs,
  },
});
