import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Image } from 'expo-image';
import { Star, Heart, ShoppingBag } from 'lucide-react-native';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';

const PRODUCTS = [
  {
    id: '1',
    name: 'Vanilla Dream',
    price: 34.00,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Strawberry Luxe',
    price: 45.00,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Midnight Velvet',
    price: 40.00,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop'
  }
];

export const ProductCarousel: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <View className="mb-10">
      <View className="flex-row justify-between items-center px-6 mb-5">
        <Text className="font-poppins-bold text-2xl text-deepBrown tracking-wide">{title}</Text>
        <TouchableOpacity>
            <Text className="font-poppins-bold text-secondary text-sm">{t('home:view_all')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
};

const ProductCard = ({ product }: { product: any }) => (
    <TouchableOpacity 
        activeOpacity={0.9}
        className="mr-6 w-48 bg-white rounded-[32px] overflow-hidden shadow-sm"
        style={{ elevation: 10 }}
    >
        <View className="h-48 relative">
            <Image 
                source={{ uri: product.image }} 
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
            />
            <View className="absolute top-4 right-4">
                <GlassBox intensity={40} style={{ width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Heart size={18} color={theme.colors.primary} fill={theme.colors.primary} />
                </GlassBox>
            </View>
            <View className="absolute bottom-4 left-4">
                <GlassBox intensity={30} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <Star size={12} color="#FFD700" fill="#FFD700" />
                    <Text className="ml-1 text-[10px] font-poppins-bold text-white">{product.rating}</Text>
                </GlassBox>
            </View>
        </View>

        <View className="p-5">
            <Text className="font-poppins-bold text-lg text-deepBrown">{product.name}</Text>
            <View className="flex-row items-center justify-between mt-2">
                <Text className="font-cairo text-primary font-bold text-xl">${product.price}</Text>
                <TouchableOpacity className="w-10 h-10 bg-primary rounded-xl items-center justify-center">
                    <ShoppingBag size={18} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    </TouchableOpacity>
);
