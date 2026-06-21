import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import * as userApi from '@/services/user.api';
import { Fonts, Spacing, Typography } from '@/constants/theme';

export function DangerZone() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isLocal = user?.authProvider === 'local';

  const handleDelete = async () => {
    if (isLocal && !password) {
      setError('Password is required to delete your account');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await userApi.deleteAccount(isLocal ? password : undefined);
      await logout();
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <Card style={[styles.card, { borderColor: colors.danger }]}>
      <Text style={[styles.heading, { color: colors.danger }]}>Danger zone</Text>
      <Text style={[styles.description, { color: colors.foregroundMuted }]}>
        Permanently delete your account and all associated data. This cannot be undone.
      </Text>
      <Button
        label="Delete account"
        onPress={() => setShowDialog(true)}
        variant="danger"
        fullWidth
        style={styles.button}
      />

      <ConfirmDialog
        visible={showDialog}
        title="Delete account"
        message={
          isLocal
            ? 'Enter your password to confirm account deletion.'
            : 'Are you sure you want to delete your account? This cannot be undone.'
        }
        confirmLabel="Delete forever"
        destructive
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDialog(false);
          setPassword('');
          setError('');
        }}
      >
        {isLocal && (
          <Input
            placeholder="Your password"
            value={password}
            onChangeText={(text) => { setPassword(text); setError(''); }}
            secureTextEntry
            autoCapitalize="none"
            error={error}
            containerStyle={styles.dialogInput}
          />
        )}
        {!isLocal && error !== '' && (
          <Text style={[styles.dialogError, { color: colors.danger }]}>{error}</Text>
        )}
      </ConfirmDialog>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.base,
    borderWidth: 1,
  },
  heading: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Typography.body,
    fontFamily: Fonts.regular,
    marginBottom: Spacing.base,
  },
  button: {
    marginTop: Spacing.xs,
  },
  dialogInput: {
    marginBottom: Spacing.base,
  },
  dialogError: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
    marginBottom: Spacing.base,
  },
});
