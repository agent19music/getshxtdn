import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Moon, Sun, DeviceMobile } from 'phosphor-react-native';
import { useThemePreference } from '@/contexts/ThemeContext';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/ui/Card';
import { Fonts, Spacing, Typography, Radius } from '@/constants/theme';

type Pref = 'system' | 'light' | 'dark';

const options: { value: Pref; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'System', Icon: DeviceMobile },
  { value: 'light',  label: 'Light',  Icon: Sun },
  { value: 'dark',   label: 'Dark',   Icon: Moon },
];

export function ThemeToggle() {
  const { colors } = useTheme();
  const { preference, setPreference } = useThemePreference();

  return (
    <Card style={styles.card}>
      <Text style={[styles.heading, { color: colors.foreground }]}>Appearance</Text>

      <View style={[styles.row, { backgroundColor: colors.insetSurface, borderColor: colors.border }]}>
        {options.map(({ value, label, Icon }) => {
          const active = preference === value;
          return (
            <Pressable
              key={value}
              onPress={() => setPreference(value)}
              style={[
                styles.option,
                active && [styles.optionActive, {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }],
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Icon
                size={16}
                color={active ? colors.foreground : colors.foregroundMuted}
                weight={active ? 'fill' : 'regular'}
              />
              <Text
                style={[
                  styles.optionLabel,
                  { color: active ? colors.foreground : colors.foregroundMuted },
                  active && styles.optionLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
  row: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionActive: {
    // bg + border set inline from theme
  },
  optionLabel: {
    ...Typography.label,
    fontFamily: Fonts.medium,
  },
  optionLabelActive: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
  },
});
