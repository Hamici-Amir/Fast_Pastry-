import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  Edit3, 
  Trash2, 
  Star, 
  Archive, 
  Eye, 
  MoreVertical,
  Plus
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

interface AdminCakeCardProps {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  image: string;
  isFeatured: boolean;
  index: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFeatured?: () => void;
}

export const AdminCakeCard: React.FC<AdminCakeCardProps> = ({
  id,
  name,
  category,
  price,
  stock,
  image,
  isFeatured,
  index,
  onEdit,
  onDelete,
  onToggleFeatured
}) => {
  const stockStatus = stock > 20 ? 'In Stock' : stock > 0 ? 'Low Stock' : 'Out of Stock';
  const stockColor = stock > 20 ? '#4ADE80' : stock > 0 ? '#FBBF24' : '#F43F5E';

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(index * 100)}
      className="mb-6 w-[48%]"
    >
      <View className="rounded-[32px] border border-[#D4A373]/10 bg-surface overflow-hidden shadow-md">
        <View className="relative h-44 w-full">
          <Image 
            source={{ uri: image }} 
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          
          {/* Featured Badge */}
          {isFeatured && (
            <View className="absolute top-4 left-4">
              <View className="px-3 py-1 rounded-full border border-[#D4A373]/20 bg-white/90 flex-row items-center">
                <Star size={10} color="#D4A373" fill="#D4A373" />
                <Text className="ml-1 font-poppins-bold text-[8px] text-gold uppercase">Featured</Text>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="absolute top-4 right-4 gap-2">
            <TouchableOpacity 
              onPress={onEdit}
              className="w-8 h-8 rounded-full bg-surface items-center justify-center border border-[#D4A373]/10 shadow-sm"
            >
              <Edit3 size={14} color="#D4A373" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={onDelete}
              className="w-8 h-8 rounded-full bg-[#D4A373]/5 items-center justify-center border border-[#D4A373]/10 shadow-sm"
            >
              <Trash2 size={14} color="#F43F5E" />
            </TouchableOpacity>
          </View>

          {/* Price Overlay */}
          <View className="absolute bottom-4 left-4">
            <View className="px-3 py-1 rounded-xl bg-white/90 border border-[#D4A373]/10">
              <Text className="font-poppins-bold text-adminText text-xs">{price}</Text>
            </View>
          </View>
        </View>

        <View className="p-4">
          <Text className="font-poppins-bold text-adminText text-sm mb-1" numberOfLines={1}>{name}</Text>
          <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-widest mb-3">{category}</Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: stockColor }} />
              <Text className="font-cairo-bold text-[9px] uppercase" style={{ color: stockColor }}>{stockStatus} ({stock})</Text>
            </View>
            
            <TouchableOpacity className="w-7 h-7 rounded-lg bg-[#D4A373]/5 items-center justify-center border border-[#D4A373]/10">
              <Eye size={14} color="#8C7A77" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};
