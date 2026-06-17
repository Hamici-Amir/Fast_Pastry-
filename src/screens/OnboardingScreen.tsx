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

const ILLUSTRATIONS = [
  "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557089706-68d02dbda277?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562280963-8a5475740a10?q=80&w=400&auto=format&fit=crop",
];

export const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const { t } = useTranslation();
  const ONBOARDING_DATA = [
    { title: t('home:onboarding_dream_title'), subtitle: t('home:onboarding_dream_subtitle'), illustration: ILLUSTRATIONS[0] },
    { title: t('home:onboarding_express_title'), subtitle: t('home:onboarding_express_subtitle'), illustration: ILLUSTRATIONS[1] },
    { title: t('home:onboarding_preview_title'), subtitle: t('home:onboarding_preview_subtitle'), illustration: ILLUSTRATIONS[2] },
  ];
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
