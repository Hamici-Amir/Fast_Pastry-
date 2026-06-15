import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { OnboardingPage } from '../components/onboarding/OnboardingPage';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    title: "Dream Cake Design",
    subtitle: "Customize every detail of your luxury cake. Choose flavors, toppings, and designs with a simple tap.",
    illustration: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop",
  },
  {
    title: "Express Freshness",
    subtitle: "From our luxury bakery straight to your door. Experience the fastest premium delivery in the city.",
    illustration: "https://images.unsplash.com/photo-1557089706-68d02dbda277?q=80&w=400&auto=format&fit=crop",
  },
  {
    title: "Live Preview",
    subtitle: "See your creation come to life in real-time. Our premium renderer shows you exactly what you'll receive.",
    illustration: "https://images.unsplash.com/photo-1562280963-8a5475740a10?q=80&w=400&auto=format&fit=crop",
  }
];

export const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onNext = () => {
    if (activeIndex < ONBOARDING_DATA.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      scrollX.value = withTiming(-nextIndex * width, {
        duration: 900,
        easing: Easing.bezier(0.25, 1, 0.3, 1),
      });
    } else {
      onFinish();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: scrollX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.scrollContainer, animatedStyle]}>
        {ONBOARDING_DATA.map((item, index) => (
          <OnboardingPage
            key={index}
            {...item}
            isLast={index === ONBOARDING_DATA.length - 1}
            onNext={onNext}
            scrollX={scrollX}
            index={index}
          />
        ))}
      </Animated.View>

      {/* Pagination Indicators */}
      <View style={styles.indicatorContainer}>
        {ONBOARDING_DATA.map((_, index) => (
          <PaginationDot key={index} active={index === activeIndex} />
        ))}
      </View>
    </View>
  );
};

const PaginationDot = ({ active }: { active: boolean }) => {
  const widthVal = useSharedValue(8);
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    widthVal.value = withTiming(active ? 24 : 8, {
      duration: 600,
      easing: Easing.bezier(0.25, 1, 0.3, 1),
    });
    opacity.value = withTiming(active ? 1 : 0.4, {
      duration: 600,
      easing: Easing.bezier(0.25, 1, 0.3, 1),
    });
  }, [active]);

  const style = useAnimatedStyle(() => ({
    width: widthVal.value,
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, style]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  }
});
