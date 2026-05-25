import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Navigation, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  DollarSign,
  MessageCircle,
  MapPin,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const DriverDashboardView = () => {
  return (
    <ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* STATS GRID */}
      <View className="flex-row flex-wrap justify-between mb-8 mt-4 gap-y-4">
        {[
          { label: "Today's Earnings", value: "$482.50", icon: DollarSign, color: "#D4A373", delay: 100 },
          { label: "Completed", value: "24", icon: ShieldCheck, color: "rgba(74, 222, 128, 1)", delay: 200 },
          { label: "Online Time", value: "6.2h", icon: Clock, color: "rgba(56, 189, 248, 1)", delay: 300 },
          { label: "Success Score", value: "99.8%", icon: Sparkles, color: "rgba(248, 182, 200, 1)", delay: 400 },
        ].map((stat, i) => (
          <Animated.View 
            key={i}
            entering={FadeInDown.duration(600).delay(stat.delay)} 
            style={{ width: (width - 50) / 2 }}
          >
            <View className="bg-surface rounded-[28px] border border-[#D4A373]/10 overflow-hidden shadow-sm">
                <View className="p-4">
                    <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}15` }}>
                        <stat.icon size={18} color={stat.color} />
                    </View>
                    <Text className="font-poppins-bold text-2xl text-adminText leading-tight">{stat.value}</Text>
                    <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-widest">{stat.label}</Text>
                </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* ACTIVE DELIVERY CARD */}
      <Animated.View entering={FadeInRight.duration(800).delay(500)}>
        <View className="flex-row items-center mb-4 ml-1">
            <Sparkles size={14} color="#D4A373" />
            <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Current Order</Text>
        </View>
        
        <View className="bg-surface rounded-[32px] border-2 border-[#D4A373]/20 shadow-xl overflow-hidden">
            <View className="p-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View className="bg-[#D4A373]/10 px-3 py-1.5 rounded-xl border border-[#D4A373]/20">
                        <Text className="font-poppins-bold text-[10px] text-[#D4A373] tracking-widest">ORDER #4921</Text>
                    </View>
                    <View className="flex-row items-center">
                        <Clock size={12} color="#4ADE80" />
                        <Text className="ml-1.5 font-poppins-bold text-sm text-green-500">ETA: 14 mins</Text>
                    </View>
                </View>

                <View className="flex-row items-center mb-6">
                    <View className="w-14 h-14 rounded-2xl bg-[#D4A373]/5 shadow-sm items-center justify-center border border-[#D4A373]/10">
                        <Text className="font-poppins-bold text-xl text-adminText">SJ</Text>
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="font-poppins-bold text-lg text-adminText">Sarah Jenkins</Text>
                        <Text className="font-cairo-medium text-adminMuted text-xs" numberOfLines={1}>124 Luxury Avenue, Suite 402</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-[#D4A373]/10 items-center justify-center border border-[#D4A373]/10">
                        <MessageCircle size={20} color="#F8B6C8" />
                    </TouchableOpacity>
                </View>

                <View className="mb-6">
                    <View className="h-2 bg-[#D4A373]/10 rounded-full overflow-hidden mb-3">
                        <View className="h-full bg-gold rounded-full" style={{ width: '65%' }} />
                    </View>
                    <Text className="font-cairo-bold text-adminMuted text-[10px] tracking-widest uppercase text-right">3.2 miles remaining</Text>
                </View>

                <TouchableOpacity activeOpacity={0.8} className="overflow-hidden rounded-[24px] shadow-lg shadow-[#D4A373]/30">
                    <View className="bg-gold flex-row items-center justify-center h-16">
                        <Navigation size={18} color="#FFFFFF" className="mr-3" />
                        <Text className="font-poppins-bold text-white text-base tracking-widest">OPEN NAVIGATION</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
      </Animated.View>

      {/* INCOMING REQUEST PREVIEW */}
      <Animated.View entering={FadeInRight.duration(800).delay(700)}>
        <View className="flex-row items-center mb-4 mt-8 ml-1">
            <CheckCircle size={14} color="#D4A373" />
            <Text className="ml-2 font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase">Incoming Requests</Text>
        </View>

        <View className="bg-surface rounded-[32px] border border-[#D4A373]/10 overflow-hidden shadow-sm">
            <View className="p-5">
                <View className="flex-row items-center mb-6">
                    <View className="w-14 h-14 rounded-2xl bg-[#D4A373]/10 items-center justify-center border border-[#D4A373]/20">
                        <MapPin size={24} color="#D4A373" />
                    </View>
                    <View className="flex-1 ml-4">
                        <Text className="font-poppins-bold text-2xl text-adminText leading-tight">$24.00</Text>
                        <Text className="font-cairo-medium text-adminMuted text-xs" numberOfLines={1}>Boutique HQ → Downtown</Text>
                        <Text className="font-cairo-bold text-[#D4A373] text-[10px] uppercase tracking-widest mt-1">4.5 miles • Large Custom Cake</Text>
                    </View>
                </View>
                
                <View className="flex-row gap-3">
                    <TouchableOpacity className="flex-1 h-12 rounded-xl bg-[#D4A373]/5 border border-[#D4A373]/10 items-center justify-center">
                        <Text className="font-poppins-bold text-adminMuted text-xs">Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-[2] h-12 rounded-xl bg-gold items-center justify-center shadow-lg shadow-gold/20">
                        <Text className="font-poppins-bold text-white text-xs tracking-widest uppercase">Accept Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
