import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton, SkeletonLine } from '@/components/ui/Skeleton';
import { Spacing } from '@/constants/theme';

export function ProfileSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={80} height={80} borderRadius={40} />
        <SkeletonLine width={160} style={styles.nameLine} />
        <SkeletonLine width={200} style={styles.emailLine} />
      </View>
      <View style={styles.card}>
        <SkeletonLine width="50%" />
        <SkeletonLine width="100%" style={styles.line} />
        <SkeletonLine width="100%" style={styles.line} />
        <Skeleton width="100%" height={48} borderRadius={9999} style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  nameLine: {
    marginTop: Spacing.base,
  },
  emailLine: {
    marginTop: Spacing.sm,
  },
  card: {
    padding: Spacing.lg,
  },
  line: {
    marginTop: Spacing.md,
  },
});
