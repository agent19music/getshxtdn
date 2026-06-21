import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {icon && (
        <Text style={[styles.icon, { color: colors.foregroundSubtle }]}>
          {icon}
        </Text>
      )}
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>
          {subtitle}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
          style={styles.action}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.base,
  },
  title: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  action: {
    marginTop: Spacing.lg,
  },
});
