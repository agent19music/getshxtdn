import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + Spacing['3xl'], paddingBottom: insets.bottom + Spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue managing your tasks."
        />
        <LoginForm />
        <AuthDivider />
        <SocialLoginButton />
        <AuthFooter mode="login" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
});
