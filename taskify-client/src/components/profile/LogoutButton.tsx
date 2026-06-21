import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/theme';

export function LogoutButton() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        label="Sign out"
        onPress={handleLogout}
        variant="secondary"
        loading={loading}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.base,
    // Matching horizontal margin with Card sections, but adding
    // inner padding equal to Card's padding so the button aligns
    // with card content visually.
  },
});
