import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/Button';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  message = 'Something went wrong',
  onRetry,
}: ErrorFallbackProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: colors.foregroundMuted }]}>
        {message}
      </Text>
      {onRetry && (
        <Button
          label="Try again"
          onPress={onRetry}
          variant="secondary"
          style={styles.button}
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
  message: {
    ...Typography.body,
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.base,
  },
});
