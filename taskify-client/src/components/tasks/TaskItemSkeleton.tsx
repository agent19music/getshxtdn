import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonLine } from '@/components/ui/Skeleton';
import { useTheme } from '@/hooks/use-theme';
import { Radius, Spacing } from '@/constants/theme';

export function TaskItemSkeleton() {
  const { colors, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...shadows.xs,
        },
      ]}
    >
      <Skeleton width={22} height={22} borderRadius={6} />
      <View style={styles.content}>
        <SkeletonLine width="70%" />
        <SkeletonLine width="90%" style={styles.line} />
        <SkeletonLine width="40%" style={styles.line} />
      </View>
    </View>
  );
}

export function TaskListSkeleton() {
  return (
    <View>
      {[0, 1, 2, 3].map((i) => (
        <TaskItemSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.base,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  line: {
    marginTop: Spacing.sm,
  },
});
