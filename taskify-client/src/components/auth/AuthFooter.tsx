import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

interface AuthFooterProps {
  mode: 'login' | 'register';
}

export function AuthFooter({ mode }: AuthFooterProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const isLogin = mode === 'login';
  const promptText = isLogin ? "Don't have an account? " : 'Already have an account? ';
  const actionText = isLogin ? 'Sign up' : 'Sign in';

  const handlePress = () => {
    if (isLogin) {
      router.push('/(auth)/register');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.prompt, { color: colors.foregroundMuted }]}>
        {promptText}
      </Text>
      <Pressable onPress={handlePress}>
        <Text style={[styles.action, { color: colors.foreground }]}>
          {actionText}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  prompt: {
    ...Typography.body,
    fontFamily: Fonts.regular,
  },
  action: {
    ...Typography.body,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
});
