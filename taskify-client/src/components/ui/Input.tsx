import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Fonts, Layout, Radius, Spacing, Typography } from '@/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, { color: colors.foregroundMuted }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.insetSurface,
            borderColor: error
              ? colors.danger
              : isFocused
                ? colors.foreground
                : colors.borderStrong,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        <TextInput
          {...props}
          secureTextEntry={hidePassword}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.foregroundSubtle}
          style={[
            styles.input,
            {
              color: colors.foreground,
              fontFamily: Fonts.regular,
            },
          ]}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setHidePassword(!hidePassword)}
            hitSlop={8}
            style={styles.toggle}
          >
            <Text style={[styles.toggleText, { color: colors.foregroundMuted }]}>
              {hidePassword ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...Typography.label,
    fontFamily: Fonts.medium,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    height: Layout.inputHeight,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
  },
  input: {
    flex: 1,
    fontSize: 16, // Prevents iOS zoom
    height: '100%',
    padding: 0,
  },
  toggle: {
    marginLeft: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  toggleText: {
    ...Typography.label,
    fontFamily: Fonts.medium,
  },
  error: {
    ...Typography.caption,
    fontFamily: Fonts.regular,
    marginTop: Spacing.xs,
  },
});
