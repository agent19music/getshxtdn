import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Spacing, Typography } from '@/constants/theme';


export function SocialLoginButton() {
  const { signInWithGoogle } = useAuth();
  const { colors } = useTheme();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      // User cancelled is not an error
      if (err?.code !== 'SIGN_IN_CANCELLED') {
        setError(err.message ?? 'Google sign-in failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button
        label="Continue with Google"
        onPress={handlePress}
        variant="secondary"
        loading={loading}
        fullWidth
      />
      {error !== '' && (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    ...Typography.caption,
    fontFamily: Fonts.regular,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
