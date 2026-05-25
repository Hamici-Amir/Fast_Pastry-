import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  Heart, 
  History,
  MoreHorizontal
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

interface AdminCustomerCardProps {
  id: string;
  name: string;
  email: string;
  avatar: string;
  totalSpent: string;
  ordersCount: number;
  status: 'VIP' | 'Regular' | 'New';
  lastActive: string;
  index: number;
  onViewHistory?: () => void;
  onAction?: () => void;
}

const statusColors = {
  'VIP': '#D4A373', // Gold
  'Regular': '#94A3B8', // Slate
  'New': '#38BDF8', // Sky
};

export const AdminCustomerCard: React.FC<AdminCustomerCardProps> = ({
  id,
  name,
  email,
  avatar,
  totalSpent,
  ordersCount,
  status,
  lastActive,
  index,
  onViewHistory,
  onAction
}) => {
  const color = statusColors[status];

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(index * 100)}
      className="mb-4"
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onViewHistory}
        className="rounded-[24px] border border-[#D4A373]/10 bg-surface overflow-hidden shadow-sm"
      >
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <View className="relative">
                <Image 
                  source={{ uri: avatar }} 
                  style={{ width: 48, height: 48, borderRadius: 16 }}
                />
                <View 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white items-center justify-center bg-green-500 shadow-sm"
                />
              </View>
              <View className="ml-4">
                <Text className="font-poppins-bold text-adminText text-base">{name}</Text>
                <Text className="font-cairo-medium text-adminMuted text-xs lowercase">{email}</Text>
              </View>
            </View>
            
            <View 
              className="px-3 py-1 rounded-full border" 
              style={{ borderColor: `${color}40`, backgroundColor: `${color}10` }}
            >
              <Text className="font-cairo-bold text-[9px] uppercase tracking-widest" style={{ color }}>{status}</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="font-cairo-bold text-[9px] text-adminMuted uppercase tracking-widest mb-1">Lifetime Value</Text>
              <View className="flex-row items-center">
                <TrendingUp size={12} color="#D4A373" />
                <Text className="ml-2 font-poppins-bold text-adminText text-sm">{totalSpent}</Text>
              </View>
            </View>
            <View>
              <Text className="font-cairo-bold text-[9px] text-adminMuted uppercase tracking-widest mb-1">Total Orders</Text>
              <View className="flex-row items-center">
                <ShoppingBag size={12} color="#38BDF8" />
                <Text className="ml-2 font-poppins-bold text-adminText text-sm">{ordersCount}</Text>
              </View>
            </View>
            <View>
              <Text className="font-cairo-bold text-[9px] text-adminMuted uppercase tracking-widest mb-1">Engagement</Text>
              <View className="flex-row items-center">
                <Heart size={12} color="#F43F5E" />
                <Text className="ml-2 font-poppins-bold text-adminText text-sm">High</Text>
              </View>
            </View>
          </View>

          <View className="h-[1px] w-full bg-[#D4A373]/10 mb-4" />

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <History size={12} color="#8C7A77" />
              <Text className="ml-2 font-cairo-medium text-adminMuted text-[10px] uppercase">Active {lastActive}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={onAction}
              className="w-8 h-8 rounded-lg bg-[#D4A373]/5 items-center justify-center border border-[#D4A373]/10 shadow-sm"
            >
              <MoreHorizontal size={16} color="#2C1B18" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
