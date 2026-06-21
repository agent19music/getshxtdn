import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
];

export function RegisterForm() {
  const { register } = useAuth();
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) { setError('Name is required'); return; }
    if (!trimmedEmail) { setError('Email is required'); return; }
    if (!PASSWORD_RULES.every((r) => r.test(password))) {
      setError('Password does not meet requirements');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(trimmedEmail, password, trimmedName);
    } catch (err: any) {
      setError(err.message ?? 'Registration failed');
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
        label="Name"
        placeholder="Your name"
        value={name}
        onChangeText={(text) => { setName(text); if (error) setError(''); }}
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        containerStyle={styles.field}
      />

      <Input
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={(text) => { setEmail(text); if (error) setError(''); }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        returnKeyType="next"
        containerStyle={styles.field}
      />

      <Input
        label="Password"
        placeholder="Create a password"
        value={password}
        onChangeText={(text) => { setPassword(text); if (error) setError(''); }}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="next"
        containerStyle={styles.field}
      />

      {/* Password strength indicators — hidden once all rules pass */}
      {password.length > 0 && !PASSWORD_RULES.every((r) => r.test(password)) && (
        <View style={styles.rules}>
          {PASSWORD_RULES.map((rule) => {
            const passes = rule.test(password);
            return (
              <Text
                key={rule.label}
                style={[
                  styles.rule,
                  { color: passes ? colors.success : colors.foregroundSubtle },
                ]}
              >
                {passes ? '\u2713' : '\u2022'} {rule.label}
              </Text>
            );
          })}
        </View>
      )}

      <Input
        label="Confirm password"
        placeholder="Repeat your password"
        value={confirmPassword}
        onChangeText={(text) => { setConfirmPassword(text); if (error) setError(''); }}
        secureTextEntry
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
        containerStyle={styles.field}
      />

      <Button
        label="Create account"
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
  rules: {
    marginBottom: Spacing.base,
    gap: Spacing.xs,
  },
  rule: {
    ...Typography.caption,
    fontFamily: Fonts.regular,
  },
});
