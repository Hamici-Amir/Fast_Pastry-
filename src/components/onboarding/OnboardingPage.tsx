import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme';
import { Button } from '../ui/Button';

const { width, height } = Dimensions.get('window');

interface OnboardingPageProps {
  title: string;
  subtitle: string;
  illustration: string;
  isLast?: boolean;
  onNext: () => void;
  scrollX: SharedValue<number>;
  index: number;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  title,
  subtitle,
  illustration,
  isLast,
  onNext,
  scrollX,
  index,
}) => {
  const insets = useSafeAreaInsets();

  // Dynamic Scroll Parallax Styles
  const animStyleIllustration = useAnimatedStyle(() => {
    const translateX = -scrollX.value;
    const pagePosition = index * width;
    const distance = translateX - pagePosition;
    
    const scale = interpolate(
      distance,
      [-width, 0, width],
      [0.82, 1, 0.82],
      'clamp'
    );
    
    const opacity = interpolate(
      distance,
      [-width, 0, width],
      [0, 1, 0],
      'clamp'
    );

    const rotate = interpolate(
      distance,
      [-width, 0, width],
      [-8, 0, 8],
      'clamp'
    );

    const illustrationTranslateX = interpolate(
      distance,
      [-width, 0, width],
      [width * 0.3, 0, -width * 0.3],
      'clamp'
    );

    return {
      transform: [
        { scale },
        { translateX: illustrationTranslateX },
        { rotate: `${rotate}deg` }
      ],
      opacity,
    };
  });

  const animStyleText = useAnimatedStyle(() => {
    const translateX = -scrollX.value;
    const pagePosition = index * width;
    const distance = translateX - pagePosition;

    const textTranslateX = interpolate(
      distance,
      [-width, 0, width],
      [width * 0.4, 0, -width * 0.4],
      'clamp'
    );

    const opacity = interpolate(
      distance,
      [-width, 0, width],
      [0, 1, 0],
      'clamp'
    );

    return {
      transform: [{ translateX: textTranslateX }],
      opacity,
    };
  });

  const animStyleButton = useAnimatedStyle(() => {
    const translateX = -scrollX.value;
    const pagePosition = index * width;
    const distance = translateX - pagePosition;

    const opacity = interpolate(
      distance,
      [-width, 0, width],
      [0, 1, 0],
      'clamp'
    );

    const scale = interpolate(
      distance,
      [-width, 0, width],
      [0.9, 1, 0.9],
      'clamp'
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const animStyleGlow = useAnimatedStyle(() => {
    const translateX = -scrollX.value;
    const pagePosition = index * width;
    const distance = translateX - pagePosition;

    const glowTranslateX = interpolate(
      distance,
      [-width, 0, width],
      [-width * 0.6, 0, width * 0.6],
      'clamp'
    );

    const scale = interpolate(
      distance,
      [-width, 0, width],
      [0.8, 1, 1.2],
      'clamp'
    );

    return {
      transform: [
        { translateX: glowTranslateX },
        { scale }
      ],
    };
  });

  return (
    <View 
      style={{ 
        width, 
        height, 
        paddingTop: Math.max(insets.top + 20, 40), 
        paddingBottom: Math.max(insets.bottom + 20, 40),
        paddingHorizontal: 40,
        backgroundColor: '#FFF8F2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Decorative Background Element */}
      <Animated.View 
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: 160,
            backgroundColor: '#FADADD',
            opacity: 0.15,
          },
          animStyleGlow
        ]}
      />
      
      {/* Centered Illustration */}
      <Animated.View 
        style={[styles.illustrationWrapper, animStyleIllustration]}
      >
        <View style={styles.glowOverlay} />
        <Image
          source={{ uri: illustration }}
          style={{ width: width * 0.75, height: width * 0.75, borderRadius: 36 }}
          contentFit="cover"
          transition={1000}
        />
      </Animated.View>

      {/* Copy Section */}
      <Animated.View 
        style={[styles.textWrapper, animStyleText]}
      >
        <Text style={styles.pageTitle}>
          {title}
        </Text>
        <Text style={styles.pageSubtitle}>
          {subtitle}
        </Text>
      </Animated.View>

      {/* Action Button */}
      <Animated.View 
        style={[{ width: '100%', marginBottom: 15 }, animStyleButton]}
      >
        <Button 
          title={isLast ? "Begin Journey" : "Next Step"} 
          onPress={onNext}
          size="lg"
          variant="primary"
          style={{ width: '100%', height: 60 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  illustrationWrapper: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  glowOverlay: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
  },
  textWrapper: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  pageTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#3D2C29',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  pageSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#8C7A77',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});
