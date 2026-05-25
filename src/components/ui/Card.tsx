import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, noPadding }) => {
  return (
    <View style={[styles.container, !noPadding && styles.padding, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  padding: {
    padding: theme.spacing.md,
  }
});
