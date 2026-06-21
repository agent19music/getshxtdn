import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ButtonTokens, Fonts, Spacing } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = getVariantStyles(variant, colors);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles.container,
        pressed && !isDisabled && variantStyles.pressed,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
        />
      ) : (
        <Text
          style={[
            styles.label,
            { color: variantStyles.textColor },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

function getVariantStyles(
  variant: ButtonVariant,
  colors: ReturnType<typeof useTheme>['colors'],
) {
  switch (variant) {
    case 'primary':
      return {
        container: {
          backgroundColor: colors.primaryBg,
        } as ViewStyle,
        pressed: {
          backgroundColor: colors.primaryHoverBg,
        } as ViewStyle,
        textColor: colors.primaryText,
      };
    case 'secondary':
      return {
        container: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.secondaryBorder,
        } as ViewStyle,
        pressed: {
          borderColor: 'transparent',
          backgroundColor: colors.secondaryHoverBg,
        } as ViewStyle,
        textColor: colors.foreground,
      };
    case 'danger':
      return {
        container: {
          backgroundColor: colors.danger,
        } as ViewStyle,
        pressed: {
          opacity: 0.85,
        } as ViewStyle,
        textColor: '#FAFAFA',
      };
    case 'ghost':
      return {
        container: {
          backgroundColor: 'transparent',
        } as ViewStyle,
        pressed: {
          backgroundColor: colors.secondaryHoverBg,
        } as ViewStyle,
        textColor: colors.foreground,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    height: ButtonTokens.height,
    borderRadius: ButtonTokens.borderRadius,
    paddingHorizontal: ButtonTokens.paddingHorizontal,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontSize: ButtonTokens.fontSize,
    fontWeight: ButtonTokens.fontWeight,
    fontFamily: Fonts.medium,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
