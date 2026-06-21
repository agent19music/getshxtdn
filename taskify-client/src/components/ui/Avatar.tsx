import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Typography } from '@/constants/theme';

interface AvatarProps {
  uri?: string | null;
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export function Avatar({ uri, name, size = 48 }: AvatarProps) {
  const { colors } = useTheme();
  const fontSize = size * 0.38;

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.insetSurface,
        },
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize,
            color: colors.foregroundMuted,
          },
        ]}
      >
        {getInitials(name) || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: Fonts.semibold,
    fontWeight: '600',
  },
});
