import React, { useState } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, TextInputProps as RNTextInputProps, TextStyle, ViewStyle } from 'react-native';
import { theme } from '../../theme';

interface TextInputProps extends RNTextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  containerStyle?: ViewStyle;
}

export const TextInput: React.FC<TextInputProps> = ({
  leftIcon,
  rightIcon,
  error,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[
      styles.container,
      isFocused && styles.focused,
      error && styles.error,
      containerStyle
    ]}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <RNTextInput
        style={[styles.input, theme.typography.body1 as TextStyle, style]}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  focused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  error: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  rightIcon: {
    marginLeft: theme.spacing.sm,
  }
});
