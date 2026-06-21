import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, ButtonTokens } from '@/constants/theme';

const heroImage = require('@/assets/images/hero-img.png');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HeroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mode, colors } = useTheme();
  const isDark = mode === 'dark';

  return (
    <ImageBackground source={heroImage} style={styles.bg} resizeMode="cover">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* ── Smooth fading scrim ──────────────────────────────────────────
          8 thin bands create a seamless transparent → opaque ramp.
          Each band is 5% of the screen height with tiny opacity steps
          so there are no visible seams. The solid footer anchors below. */}
      <View style={styles.scrimContainer} pointerEvents="none">
        <View style={[styles.band, styles.band1, { backgroundColor: isDark ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)' }]} />
        <View style={[styles.band, styles.band2, { backgroundColor: isDark ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }]} />
        <View style={[styles.band, styles.band3, { backgroundColor: isDark ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.14)' }]} />
        <View style={[styles.band, styles.band4, { backgroundColor: isDark ? 'rgba(0,0,0,0.16)' : 'rgba(255,255,255,0.22)' }]} />
        <View style={[styles.band, styles.band5, { backgroundColor: isDark ? 'rgba(0,0,0,0.24)' : 'rgba(255,255,255,0.32)' }]} />
        <View style={[styles.band, styles.band6, { backgroundColor: isDark ? 'rgba(0,0,0,0.34)' : 'rgba(255,255,255,0.46)' }]} />
        <View style={[styles.band, styles.band7, { backgroundColor: isDark ? 'rgba(0,0,0,0.48)' : 'rgba(255,255,255,0.62)' }]} />
        <View style={[styles.band, styles.band8, { backgroundColor: isDark ? 'rgba(0,0,0,0.62)' : 'rgba(255,255,255,0.78)' }]} />
        {/* Solid footer — fully opaque behind text + buttons */}
        <View style={[styles.solidFooter, { backgroundColor: isDark ? 'rgba(0,0,0,0.82)' : 'rgba(255,255,255,0.92)' }]} />
      </View>

      {/* ── Content pinned to bottom ──────────────────────────────────── */}
      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl },
        ]}
      >
        <Animated.Text
          entering={FadeInDown.duration(500).delay(150)}
          style={[styles.headline, { color: isDark ? '#FFFFFF' : colors.foreground }]}
        >
          Get Sh*t{'\n'}Done.
        </Animated.Text>

        <Animated.Text
          entering={FadeIn.duration(400).delay(400)}
          style={[styles.sub, { color: isDark ? 'rgba(255,255,255,0.60)' : colors.foregroundMuted }]}
        >
          Your tasks. Your rules. Zero excuses.
        </Animated.Text>

        {/* ── Buttons: side-by-side pills (§5 + §5.6) ────────────── */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(550)}
          style={styles.btnRow}
        >
          {/* Primary — solid pill */}
          <Pressable
            style={({ pressed }) => [
              styles.btnPill,
              {
                backgroundColor: pressed
                  ? colors.primaryHoverBg
                  : colors.primaryBg,
              },
            ]}
            onPress={() => router.push('/(auth)/login')}
            accessibilityRole="button"
          >
            <Text style={[styles.btnLabel, { color: colors.primaryText }]}>
              I'm back
            </Text>
          </Pressable>

          {/* Secondary — outlined pill */}
          <Pressable
            style={({ pressed }) => [
              styles.btnPill,
              styles.btnSecondary,
              {
                borderColor: pressed
                  ? 'transparent'
                  : (isDark ? 'rgba(255,255,255,0.145)' : 'rgba(0,0,0,0.08)'),
                backgroundColor: pressed
                  ? (isDark ? '#1A1A1A' : 'rgba(0,0,0,0.04)')
                  : 'transparent',
              },
            ]}
            onPress={() => router.push('/(auth)/register')}
            accessibilityRole="button"
          >
            <Text style={[styles.btnLabel, { color: isDark ? '#FFFFFF' : colors.foreground }]}>
              I'm new here
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  // Scrim container — covers bottom 50% of the screen
  scrimContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },

  // Each band is a thin horizontal strip — 8 bands + solid footer = smooth ramp
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  band1: { top: 0,      height: '5%' },
  band2: { top: '5%',   height: '5%' },
  band3: { top: '10%',  height: '5%' },
  band4: { top: '15%',  height: '5%' },
  band5: { top: '20%',  height: '5%' },
  band6: { top: '25%',  height: '5%' },
  band7: { top: '30%',  height: '5%' },
  band8: { top: '35%',  height: '5%' },
  solidFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    bottom: 0,
  },

  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.xl,
  },

  headline: {
    fontFamily: Fonts.bold,
    fontSize: 52,
    lineHeight: 56,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginBottom: Spacing.sm,
  },

  sub: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },

  // Side-by-side button row — §5.6
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.base, // 16px — matches DESIGN.md inline gap
  },

  // Pill button base — §5.1
  btnPill: {
    flex: 1,
    height: ButtonTokens.height,
    borderRadius: ButtonTokens.borderRadius, // 9999 pill
    paddingHorizontal: ButtonTokens.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Secondary add-on: hairline border
  btnSecondary: {
    borderWidth: 1,
  },

  btnLabel: {
    fontFamily: Fonts.medium,
    fontSize: ButtonTokens.fontSize,
    fontWeight: '500',
  },
});
