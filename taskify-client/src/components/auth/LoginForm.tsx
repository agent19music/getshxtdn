import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

export function LoginForm() {
  const { login } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(trimmedEmail, password);
    } catch (err: any) {
      setError(err.message ?? 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {error !== '' && (
        <View style={[styles.errorBanner, { backgroundColor: colors.insetSurface }]}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      )}

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (error) setError('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        returnKeyType="next"
        containerStyle={styles.field}
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError('');
        }}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        containerStyle={styles.field}
      />

      <Button
        label="Sign in"
        onPress={handleSubmit}
        loading={loading}
        fullWidth
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: Spacing.base,
  },
  button: {
    marginTop: Spacing.sm,
  },
  errorBanner: {
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.base,
  },
  errorText: {
    ...Typography.caption,
    fontFamily: Fonts.medium,
    fontWeight: '500',
  },
});
