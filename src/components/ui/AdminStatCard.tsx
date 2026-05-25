import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface AdminStatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
  index: number;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color,
  index 
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(index * 100)} 
      className="flex-1 min-w-[160px]"
    >
      <View className="relative overflow-hidden rounded-3xl border border-rose-200/30 bg-white/60 shadow-sm">
        <BlurView intensity={60} tint="light" className="p-5">
          <View className="flex-row items-center justify-between mb-4">
            <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${color}15` }}>
              <Icon size={20} color={color} />
            </View>
            <View className="px-2 py-1 rounded-lg bg-white/50 border border-rose-200/20">
              <Text className="font-poppins-bold text-[10px] text-green-600">{change}</Text>
            </View>
          </View>
          
          <Text className="font-poppins-bold text-2xl text-adminText mb-1">{value}</Text>
          <Text className="font-cairo-medium text-sm text-adminMuted">{label}</Text>
        </BlurView>
        
        {/* Subtle Bottom Accent */}
        <View className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: color, opacity: 0.4 }} />
      </View>
    </Animated.View>
  );
};
