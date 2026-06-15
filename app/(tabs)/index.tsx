import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  FadeInDown 
} from 'react-native-reanimated';
import { HomeHeader } from '../../src/components/home/HomeHeader';
import { SearchBar } from '../../src/components/home/SearchBar';
import { HeroSlider } from '../../src/components/home/HeroSlider';
import { CategoryList } from '../../src/components/home/CategoryList';
import { ProductCarousel } from '../../src/components/home/ProductCarousel';
import { EventSection } from '../../src/components/home/EventSection';
import { RecommendationGrid } from '../../src/components/home/RecommendationGrid';
import { theme } from '../../src/theme';

export default function HomeScreen() {
  const { t } = useTranslation();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [50, 150],
      [0, 1],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [50, 150],
      [-20, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }],
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    };
  });

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      
      {/* Sticky Header (Overlay) */}
      <Animated.View style={stickyHeaderStyle}>
        <HomeHeader />
      </Animated.View>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <HomeHeader />
        
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <SearchBar />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <HeroSlider />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <CategoryList />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
          <ProductCarousel title={t('home:trending_now')} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(500)}>
          <EventSection />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(600)}>
          <ProductCarousel title={t('home:recommended')} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(700)}>
          <RecommendationGrid />
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
