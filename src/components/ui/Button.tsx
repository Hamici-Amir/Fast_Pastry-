import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, TextStyle } from 'react-native';
import { theme } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  ...props
}) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  
  const getBackgroundColor = () => {
    if (disabled && !isGhost) return theme.colors.border;
    if (variant === 'primary') return theme.colors.primary;
    if (variant === 'secondary') return theme.colors.secondary;
    if (isOutline || isGhost) return 'transparent';
    return theme.colors.primary;
  };

  const getTextColor = () => {
    if (disabled && !isGhost) return theme.colors.textMuted;
    if (variant === 'primary' || variant === 'secondary') return theme.colors.surface;
    if (isOutline) return theme.colors.primary;
    if (isGhost) return theme.colors.text;
    return theme.colors.surface;
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outline,
        size === 'sm' && styles.sizeSm,
        size === 'md' && styles.sizeMd,
        size === 'lg' && styles.sizeLg,
        (variant === 'primary' || variant === 'secondary') && !disabled && theme.shadows.sm,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {leftIcon}
          <Text style={[
            styles.text, 
            theme.typography.button as TextStyle,
            { color: getTextColor() },
            size === 'sm' && { fontSize: 14 },
            size === 'lg' && { fontSize: 18 },
            (leftIcon || rightIcon) ? { marginHorizontal: theme.spacing.sm } : undefined
          ]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.pill,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  sizeSm: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  sizeMd: {
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.lg,
  },
  sizeLg: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 56,
  },
  text: {
    textAlign: 'center',
  }
});
