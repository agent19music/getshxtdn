import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
<Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.foregroundMuted }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  appName: {
    ...Typography.label,
    fontFamily: Fonts.semibold,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    fontFamily: Fonts.semibold,
  },
  subtitle: {
    ...Typography.bodyLarge,
    fontFamily: Fonts.regular,
    marginTop: Spacing.sm,
  },
});
