import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { theme } from '../../theme';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  style, 
  variant = 'rectangular' 
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.4, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return { borderRadius: theme.radius.circle };
      case 'text':
        return { borderRadius: theme.radius.sm, height: height || theme.typography.body1.lineHeight };
      case 'rectangular':
      default:
        return { borderRadius: theme.radius.md };
    }
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        getVariantStyles() as ViewStyle,
        { width: width as any, height: height as any },
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.border,
  },
});
