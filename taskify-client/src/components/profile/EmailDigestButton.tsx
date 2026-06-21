import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Envelope } from 'phosphor-react-native';
import { toast } from 'sonner-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/hooks/use-theme';
import { emailDigest } from '@/services/user.api';
import { Fonts, Spacing, Typography } from '@/constants/theme';

export function EmailDigestButton() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const res = await emailDigest();
      toast.success('Digest sent', { description: res.message });
    } catch (err: any) {
      toast.error('Failed to send digest', { description: err.message ?? 'Please try again' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Envelope size={18} color={colors.foregroundMuted} />
        <Text style={[styles.heading, { color: colors.foreground }]}>Task Digest</Text>
      </View>
      <Text style={[styles.description, { color: colors.foregroundMuted }]}>
        Email yourself a summary of all pending tasks.
      </Text>
      <Button
        label="Email my task digest"
        onPress={handlePress}
        variant="secondary"
        loading={loading}
        fullWidth
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.base,
    gap: Spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heading: {
    ...Typography.h3,
    fontFamily: Fonts.semibold,
  },
  description: {
    ...Typography.body,
  },
});
