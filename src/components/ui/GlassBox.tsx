import React from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../theme';

interface GlassBoxProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
}

export const GlassBox: React.FC<GlassBoxProps> = ({ 
  children, 
  style, 
  intensity = 50,
  tint = 'light'
}) => {
  return (
    <BlurView 
      intensity={intensity} 
      tint={tint} 
      style={[styles.container, style]}
    >
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.glassOverlay,
    borderColor: theme.colors.glassBorder,
    borderWidth: 1,
    padding: theme.spacing.md,
  }
});
