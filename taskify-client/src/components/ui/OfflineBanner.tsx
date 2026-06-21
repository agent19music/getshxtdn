import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WifiSlash } from 'phosphor-react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface OfflineBannerProps {
  isOnline: boolean;
  syncPending: boolean;
}

export function OfflineBanner({ isOnline, syncPending }: OfflineBannerProps) {
  const { colors } = useTheme();
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const prevOnline = useRef(isOnline);

  useEffect(() => {
    const visible = !isOnline || syncPending;
    height.value = withTiming(visible ? 36 : 0, { duration: 250 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
    prevOnline.current = isOnline;
  }, [isOnline, syncPending]);

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    overflow: 'hidden',
  }));

  const label = syncPending && isOnline
    ? 'Syncing queued changes…'
    : "You're offline — changes will sync when reconnected";

  return (
    <Animated.View
      style={[
        styles.banner,
        animStyle,
        { backgroundColor: syncPending && isOnline ? colors.accent : colors.warning },
      ]}
    >
      <WifiSlash size={14} color="#fff" weight="bold" />
      <Text style={styles.text}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.base,
  },
  text: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    color: '#fff',
  },
});
