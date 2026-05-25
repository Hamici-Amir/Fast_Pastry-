import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { 
  Package, 
  User, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Truck,
  AlertCircle
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';

interface OrderTimelineItem {
  status: string;
  time: string;
  isCompleted: boolean;
}

interface AdminOrderCardProps {
  id: string;
  customerName: string;
  amount: string;
  status: 'Pending' | 'Preparing' | 'In Route' | 'Delivered' | 'Cancelled';
  priority: 'High' | 'Medium' | 'Low';
  driver?: string;
  time: string;
  index: number;
  onPress?: () => void;
  onAssignDriver?: () => void;
  items?: string[];
}

const statusColors = {
  'Pending': '#FBBF24',
  'Preparing': '#A78BFA',
  'In Route': '#60A5FA',
  'Delivered': '#4ADE80',
  'Cancelled': '#F43F5E',
};

const priorityColors = {
  'High': '#F43F5E',
  'Medium': '#FBBF24',
  'Low': '#4ADE80',
};

export const AdminOrderCard: React.FC<AdminOrderCardProps> = ({
  id,
  customerName,
  amount,
  status,
  priority,
  driver,
  time,
  index,
  onPress,
  onAssignDriver,
  items = ['Signature Red Velvet (Med)', 'Gold Leaf Topping']
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const color = statusColors[status];
  const pColor = priorityColors[priority];

  return (
    <Animated.View 
      entering={FadeInDown.duration(600).delay(index * 100)}
      className="mb-4"
    >
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={() => {
          setIsExpanded(!isExpanded);
          if (onPress) onPress();
        }}
        className="rounded-[24px] border border-[#D4A373]/10 bg-surface overflow-hidden shadow-sm"
      >
        <View className="p-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View 
                className="w-10 h-10 rounded-xl items-center justify-center bg-[#D4A373]/5 border border-[#D4A373]/10"
              >
                <Package size={18} color={color} />
              </View>
              <View className="ml-3">
                <Text className="font-poppins-bold text-adminText text-base">{id}</Text>
                <Text className="font-cairo-medium text-adminMuted text-xs uppercase tracking-widest">{time}</Text>
              </View>
            </View>
            
            <View className="items-end">
               <View className="px-3 py-1 rounded-full border border-[#D4A373]/10 bg-[#D4A373]/5 mb-1">
                  <Text className="font-poppins-bold text-adminText text-xs">{amount}</Text>
               </View>
               <View 
                  className="px-2 py-[2px] rounded-md border" 
                  style={{ borderColor: `${pColor}40`, backgroundColor: `${pColor}10` }}
                >
                  <Text className="font-cairo-bold text-[8px] uppercase" style={{ color: pColor }}>{priority} Priority</Text>
                </View>
            </View>
          </View>

          {/* Body */}
          <View className="gap-2 mb-4">
            <View className="flex-row items-center">
              <User size={14} color="#8C7A77" />
              <Text className="ml-2 font-poppins-medium text-adminText text-sm">{customerName}</Text>
            </View>
            <View className="flex-row items-center">
              <Truck size={14} color="#8C7A77" />
              <Text className="ml-2 font-poppins-medium text-adminMuted text-sm">
                {driver ? `Driver: ${driver}` : 'No driver assigned'}
              </Text>
            </View>
          </View>

          {/* Expanded Content */}
          {isExpanded && (
            <Animated.View entering={FadeInDown.duration(400)} className="mb-4 pt-4 border-t border-[#D4A373]/10">
              <Text className="font-cairo-bold text-[#8C7A77] text-[10px] uppercase tracking-widest mb-2">Order manifest</Text>
              {items.map((item, i) => (
                <View key={i} className="flex-row items-center mb-1">
                  <View className="w-1 h-1 rounded-full bg-gold/40 mr-2" />
                  <Text className="font-poppins-medium text-adminText text-xs">{item}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Status Line */}
          <View className="h-[1px] w-full bg-[#D4A373]/10 mb-4" />

          {/* Footer Actions */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
              <Text className="font-cairo-bold text-xs uppercase tracking-widest" style={{ color }}>{status}</Text>
            </View>
            
            <View className="flex-row gap-2">
              {!driver && status !== 'Cancelled' && status !== 'Delivered' && (
                <TouchableOpacity 
                   onPress={onAssignDriver}
                   className="px-4 py-2 rounded-xl bg-gold/10 border border-gold/30"
                >
                  <Text className="font-poppins-bold text-gold text-[10px]">Assign Driver</Text>
                </TouchableOpacity>
              )}
              <View 
                className="w-8 h-8 rounded-lg bg-[#D4A373]/5 items-center justify-center border border-[#D4A373]/10"
                style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
              >
                <ChevronRight size={16} color="#2C1B18" />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
