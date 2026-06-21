import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Radius, Spacing, Typography } from '@/constants/theme';

interface SegmentedControlProps {
  segments: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function SegmentedControl({
  segments,
  selectedIndex,
  onSelect,
}: SegmentedControlProps) {
  const { colors, shadows } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.insetSurface }]}>
      {segments.map((segment, index) => {
        const isActive = index === selectedIndex;
        return (
          <Pressable
            key={segment}
            onPress={() => onSelect(index)}
            style={[
              styles.segment,
              isActive && [
                styles.activeSegment,
                {
                  backgroundColor: colors.card,
                  ...shadows.xs,
                },
              ],
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? colors.foreground : colors.foregroundMuted,
                  fontFamily: isActive ? Fonts.medium : Fonts.regular,
                },
              ]}
            >
              {segment}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Radius.pill,
    padding: Spacing.xs,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  activeSegment: {},
  label: {
    ...Typography.label,
  },
});
