import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) {
  const { colors } = useTheme();

  const footer = (
    <View style={styles.buttons}>
      <Button label={cancelLabel} onPress={onCancel} variant="secondary" style={styles.button} />
      <Button label={confirmLabel} onPress={onConfirm} variant={destructive ? 'danger' : 'primary'} style={styles.button} />
    </View>
  );

  return (
    <Modal visible={visible} onClose={onCancel} footer={footer}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.foregroundMuted }]}>
        {message}
      </Text>
      {children}
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    fontFamily: Fonts.regular,
    marginBottom: Spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: 0,
  },
  button: {
    flex: 1,
  },
});
