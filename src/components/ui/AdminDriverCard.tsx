import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  Truck, 
  Star, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Activity
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';

interface AdminDriverCardProps {
  id: string;
  name: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'Pending';
  rating: number;
  totalEarnings: string;
  deliveriesCount: number;
  activeDelivery?: string;
  index: number;
  onApprove?: () => void;
  onViewDetails?: () => void;
}

export const AdminDriverCard: React.FC<AdminDriverCardProps> = ({
  id,
  name,
  avatar,
  status,
  rating,
  totalEarnings,
  deliveriesCount,
  activeDelivery,
  index,
  onApprove,
  onViewDetails
}) => {
  const isOnline = status === 'Online';
  const isPending = status === 'Pending';
  const statusColor = isOnline ? '#4ADE80' : isPending ? '#FBBF24' : '#94A3B8';

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(index * 100)}
      className="mb-4"
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={onViewDetails}
        className="rounded-[24px] border border-[#D4A373]/10 bg-surface overflow-hidden shadow-sm"
      >
        <View className="p-5">
          <View className="flex-row items-center justify-between mb-5">
            <View className="flex-row items-center">
              <View className="relative">
                <Image 
                  source={{ uri: avatar }} 
                  style={{ width: 52, height: 52, borderRadius: 16 }}
                />
                <View 
                style={{ backgroundColor: statusColor }}
                />
              </View>
              <View className="ml-4">
                <Text className="font-poppins-bold text-adminText text-base">{name}</Text>
                <View className="flex-row items-center">
                  <Star size={10} color="#FBBF24" fill="#FBBF24" />
                  <Text className="ml-1 font-cairo-bold text-[#FBBF24] text-[10px] mt-0.5">{rating.toFixed(1)}</Text>
                  <View className="w-1 h-1 rounded-full bg-[#8C7A77] mx-2" />
                  <Text className="font-cairo-medium text-[#8C7A77] text-[10px] uppercase">ID: {id}</Text>
                </View>
              </View>
            </View>
            
            {isPending ? (
              <TouchableOpacity 
                onPress={onApprove}
                className="px-4 py-2 rounded-xl bg-gold items-center justify-center"
              >
                <Text className="font-poppins-bold text-black text-[10px]">Approve</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="w-8 h-8 rounded-lg bg-[#D4A373]/5 items-center justify-center border border-[#D4A373]/10">
                <MoreVertical size={16} color="#8C7A77" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row justify-between mb-5">
            <View>
              <Text className="font-cairo-bold text-[9px] text-[#8C7A77] uppercase tracking-widest mb-1">Lifetime Earnings</Text>
              <View className="flex-row items-center">
                <DollarSign size={12} color="#4ADE80" />
                <Text className="ml-1 font-poppins-bold text-adminText text-sm">{totalEarnings}</Text>
              </View>
            </View>
            <View>
              <Text className="font-cairo-bold text-[9px] text-[#8C7A77] uppercase tracking-widest mb-1">Deliveries</Text>
              <View className="flex-row items-center">
                <CheckCircle2 size={12} color="#38BDF8" />
                <Text className="ml-2 font-poppins-bold text-adminText text-sm">{deliveriesCount}</Text>
              </View>
            </View>
            <View>
              <Text className="font-cairo-bold text-[9px] text-[#8C7A77] uppercase tracking-widest mb-1">Current Job</Text>
              <View className="flex-row items-center">
                <Activity size={12} color={activeDelivery ? '#FBBF24' : '#94A3B8'} />
                <Text className="ml-2 font-poppins-bold text-adminText text-sm">{activeDelivery || 'Idle'}</Text>
              </View>
            </View>
          </View>

          {activeDelivery && (
            <View className="bg-[#D4A373]/10 rounded-xl border border-[#D4A373]/10 p-3 flex-row items-center mb-3">
              <MapPin size={12} color="#D4A373" />
              <Text className="ml-3 font-poppins-medium text-adminMuted text-[10px]" numberOfLines={1}>
                En route to: 742 Evergreen Terrace, Springfield
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
               <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: statusColor }} />
               <Text className="font-cairo-bold text-[9px] uppercase tracking-widest" style={{ color: statusColor }}>{status}</Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
               <Text className="font-poppins-bold text-gold text-[10px] mr-1">Performance Report</Text>
               <Clock size={10} color="#D4A373" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
