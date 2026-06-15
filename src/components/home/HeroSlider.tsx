import React, { useRef } from 'react';
import { View, Text, Dimensions, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle, 
  interpolate,
  Extrapolate,
  SharedValue
} from 'react-native-reanimated';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 48; // Full width minus padding

const PROMOTIONS = [
  {
    id: '1',
    title: 'Seasonal Offer',
    subtitle: '20% OFF ALL WEDDING CAKES',
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb8c9?q=80&w=800&auto=format&fit=crop',
    color: '#F8B6C8',
  },
  {
    id: '2',
    title: 'Limited Edition',
    subtitle: 'GOLD LEAF VELVET SPECIAL',
    image: 'https://images.unsplash.com/photo-1557089706-68d02dbda277?q=80&w=800&auto=format&fit=crop',
    color: '#D4A373',
  },
  {
    id: '3',
    title: 'Customizer Beta',
    subtitle: 'DESIGN YOUR CAKE IN 3D',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
    color: '#8CB38C',
  }
];

export const HeroSlider: React.FC = () => {
  const { t } = useTranslation();
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View className="mb-10">
      <Animated.FlatList
        data={PROMOTIONS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        snapToInterval={ITEM_WIDTH + 16}
        decelerationRate="fast"
        renderItem={({ item, index }) => {
          return (
            <PromotionCard 
              item={item} 
              index={index} 
              scrollX={scrollX} 
            />
          );
        }}
      />
    </View>
  );
};

const PromotionCard = ({ item, index, scrollX }: { item: any, index: number, scrollX: SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View 
        style={[animatedStyle, { width: ITEM_WIDTH, marginRight: 16 }]} 
        className="rounded-[32px] overflow-hidden shadow-xl bg-white"
    >
      <View style={{ aspectRatio: 16/9 }}>
        <Image 
          source={{ uri: item.image }} 
          style={{ width: '100%', height: '100%' }} 
          contentFit="cover"
          transition={300}
        />
      </View>
      <LinearGradient
        colors={['transparent', 'rgba(44, 27, 24, 0.8)']}
        className="absolute inset-0 justify-end p-8"
      >
        <Text className="font-cairo text-xs text-white/80 tracking-[2px] font-bold uppercase mb-1">
            {t('home:promotions')}
        </Text>
        <Text className="font-poppins-bold text-2xl text-white tracking-wide leading-8">
            {item.subtitle}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};
