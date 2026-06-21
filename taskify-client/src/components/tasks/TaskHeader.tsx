import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography, ButtonTokens, Radius } from '@/constants/theme';

interface TaskHeaderProps {
  userName: string;
  taskCount: number;
  onAddPress: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function TaskHeader({ userName, taskCount, onAddPress }: TaskHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={[styles.greeting, { color: colors.foregroundMuted }]}>
          {getGreeting()}, {userName.split(' ')[0]}
        </Text>
        <Text style={[styles.count, { color: colors.foregroundSubtle }]}>
          {taskCount === 0
            ? 'No pending tasks'
            : `${taskCount} pending task${taskCount === 1 ? '' : 's'}`}
        </Text>
      </View>
      <Pressable
        onPress={onAddPress}
        style={[styles.addButton, { backgroundColor: colors.primaryBg }]}
      >
        <Text style={[styles.addIcon, { color: colors.primaryText }]}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
  },
  textBlock: {
    flex: 1,
  },
  greeting: {
    ...Typography.h2,
    fontFamily: Fonts.semibold,
  },
  count: {
    ...Typography.label,
    fontFamily: Fonts.regular,
    marginTop: Spacing.xs,
  },
  addButton: {
    width: ButtonTokens.height,
    height: ButtonTokens.height,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 28,
  },
});
