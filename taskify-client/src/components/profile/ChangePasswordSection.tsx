import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { toast } from 'sonner-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/use-theme';
import * as userApi from '@/services/user.api';
import { Fonts, Spacing, Typography } from '@/constants/theme';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function ChangePasswordSection() {
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!currentPassword) { setError('Current password is required'); return; }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setError('New password: min 8 chars, 1 uppercase, 1 lowercase, 1 number');
      return;
    }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }

    setLoading(true);
    setError('');
    try {
      await userApi.updateProfile({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    } catch (err: any) {
      setError(err.message ?? 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <Text style={[styles.heading, { color: colors.foreground }]}>Change password</Text>

      <Input
        label="Current password"
        value={currentPassword}
        onChangeText={(text) => { setCurrentPassword(text); setError(''); }}
        secureTextEntry
        autoCapitalize="none"
        containerStyle={styles.field}
      />
      <Input
        label="New password"
        value={newPassword}
        onChangeText={(text) => { setNewPassword(text); setError(''); }}
        secureTextEntry
        autoCapitalize="none"
        containerStyle={styles.field}
      />
      <Input
        label="Confirm new password"
        value={confirmPassword}
        onChangeText={(text) => { setConfirmPassword(text); setError(''); }}
        secureTextEntry
        autoCapitalize="none"
        containerStyle={styles.field}
      />

      {error !== '' && <Text style={[styles.feedback, { color: colors.danger }]}>{error}</Text>}

      <Button
        label="Update password"
        onPress={handleSubmit}
        loading={loading}
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
