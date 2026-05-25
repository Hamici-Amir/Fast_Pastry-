import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Star, Heart } from 'lucide-react-native';
import { theme } from '../../theme';

const RECS = [
  { id: '1', name: 'Mini Lemon Tart', price: 12.00, rating: 4.7, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=300&auto=format&fit=crop' },
  { id: '2', name: 'Macaron Box', price: 28.00, rating: 4.9, image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?q=80&w=300&auto=format&fit=crop' },
  { id: '3', name: 'Honey Croissant', price: 8.50, rating: 4.6, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=300&auto=format&fit=crop' },
  { id: '4', name: 'Chocolate Eclair', price: 9.00, rating: 4.8, image: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?q=80&w=300&auto=format&fit=crop' },
];

export const RecommendationGrid: React.FC = () => {
  return (
    <View className="px-6 pb-24">
      <Text className="font-poppins-bold text-2xl text-deepBrown tracking-wide mb-5">Just for You</Text>
      
      <View className="flex-row flex-wrap justify-between">
        {RECS.map((item) => (
          <TouchableOpacity 
            key={item.id}
            activeOpacity={0.9}
            className="w-[48%] bg-white rounded-3xl p-2 mb-4 shadow-sm"
          >
            <View className="rounded-2xl overflow-hidden relative" style={{ aspectRatio: 1 }}>
                <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                <TouchableOpacity className="absolute top-2 right-2">
                    <Heart size={16} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>
            <View className="mt-3">
                <Text className="font-poppins-bold text-deepBrown text-sm" numberOfLines={1}>{item.name}</Text>
                <View className="flex-row items-center justify-between mt-1">
                    <Text className="font-cairo text-primary font-bold">${item.price}</Text>
                    <View className="flex-row items-center">
                        <Star size={10} color="#FFD700" fill="#FFD700" />
                        <Text className="ml-1 text-[8px] font-poppins-bold text-secondary">{item.rating}</Text>
                    </View>
                </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
