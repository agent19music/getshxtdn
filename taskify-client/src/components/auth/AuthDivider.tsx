import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

export function AuthDivider() {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: colors.borderStrong }]} />
      <Text style={[styles.text, { color: colors.foregroundSubtle }]}>
        or continue with
      </Text>
      <View style={[styles.line, { backgroundColor: colors.borderStrong }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    gap: Spacing.md,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  text: {
    ...Typography.caption,
    fontFamily: Fonts.regular,
  },
});
