import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { MapPin, Navigation, ArrowLeft, ArrowUpRight, Compass, Shield, Clock, Lock, Sparkles } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export const DriverNavigationView = () => {
  return (
    <View className="flex-1 bg-cream">
      {/* MAP BACKGROUND SIMULATOR - PREMIUM LIGHT LUXURY THEME */}
      <View className="absolute inset-0 bg-[#FFFBF7]">
        {/* Ambient Grid Lines */}
        <View className="absolute top-[35%] left-0 right-0 h-px bg-rose-200/20" />
        <View className="absolute top-[65%] left-0 right-0 h-px bg-rose-200/20" />
        <View className="absolute left-[30%] top-0 bottom-0 w-px bg-rose-200/20" />
        <View className="absolute left-[70%] top-0 bottom-0 w-px bg-rose-200/20" />

        {/* Delivery Points */}
        <View className="absolute top-[30%] left-[25%] items-center justify-center">
          <View className="w-10 h-10 rounded-full bg-adminText/5 items-center justify-center">
            <View className="w-3 h-3 rounded-full bg-adminMuted shadow-sm shadow-black/10" />
          </View>
          <Text className="font-cairo-bold text-[8px] text-adminMuted mt-1 tracking-widest uppercase">Boutique HQ</Text>
        </View>

        <View className="absolute top-[55%] right-[30%] items-center justify-center">
          <Animated.View entering={ZoomIn.delay(500)} className="w-12 h-12 items-center justify-center">
            <View className="absolute w-12 h-12 rounded-full bg-rose-400/20" />
            <View className="w-4 h-4 rounded-full bg-rose-400 border-2 border-white shadow-lg shadow-rose-400/50" />
          </Animated.View>
          <Text className="font-cairo-bold text-[8px] text-rose-400 mt-1 tracking-widest uppercase font-bold">Jessica's Residence</Text>
        </View>
      </View>

      {/* TOP HUD DISPLACEMENT - NEXT TURN */}
      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)} 
        className="absolute top-6 left-5 right-5 z-20"
      >
        <View className="bg-white/90 rounded-[32px] border-2 border-rose-200/50 shadow-xl overflow-hidden">
          <BlurView intensity={60} tint="light" className="p-5">
            <View className="flex-row items-center">
              <View className="w-14 h-14 rounded-2xl bg-rose-100 items-center justify-center shadow-sm">
                <ArrowUpRight size={32} color="#F8B6C8" />
              </View>
              <View className="ml-5 flex-1">
                <Text className="font-poppins-bold text-xl text-adminText">In 500 feet</Text>
                <Text className="font-cairo-medium text-adminMuted text-xs mt-0.5">Turn right on Golden Gate Boulevard</Text>
              </View>
            </View>
          </BlurView>
        </View>
      </Animated.View>

      {/* BOTTOM CONTROL HUB */}
      <Animated.View 
        entering={FadeInDown.duration(600).delay(300)} 
        className="absolute bottom-28 left-5 right-5 z-20"
      >
        <View className="bg-white/80 rounded-[40px] border border-rose-200/30 shadow-2xl overflow-hidden">
          <LinearGradient
            colors={['rgba(212, 163, 115, 0.05)', 'transparent']}
            style={StyleSheet.absoluteFillObject}
          />
          <BlurView intensity={40} tint="light" className="p-6">
            <View className="flex-row justify-between items-start mb-6">
              <View className="bg-gold/10 px-4 py-2 rounded-xl border border-gold/20 flex-row items-center">
                <Compass size={14} color="#D4A373" className="mr-2" />
                <Text className="font-poppins-bold text-[10px] text-gold tracking-widest uppercase">Live GPS Routing</Text>
              </View>
              <View className="w-12 h-12 bg-white rounded-xl border-2 border-adminText items-center justify-center shadow-sm">
                <Text className="font-poppins-bold text-lg text-adminText leading-none">35</Text>
                <Text className="font-cairo-bold text-[6px] text-adminText mt-0.5">LIMIT</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-around py-4 bg-rose-50/50 rounded-3xl border border-rose-100 mb-6">
              <View className="items-center">
                <Text className="font-poppins-bold text-2xl text-adminText">14</Text>
                <Text className="font-cairo-bold text-[9px] text-gold tracking-widest uppercase mt-1">MINS</Text>
              </View>
              <View className="w-px h-8 bg-rose-200/30" />
              <View className="items-center">
                <Text className="font-poppins-bold text-2xl text-adminText">3.2</Text>
                <Text className="font-cairo-bold text-[9px] text-gold tracking-widest uppercase mt-1">MILES</Text>
              </View>
              <View className="w-px h-8 bg-rose-200/30" />
              <View className="items-center">
                <Text className="font-poppins-bold text-2xl text-adminText">14:32</Text>
                <Text className="font-cairo-bold text-[9px] text-gold tracking-widest uppercase mt-1">ETA</Text>
              </View>
            </View>

            <View className="bg-white/90 rounded-3xl border border-rose-200/20 p-4 flex-row items-center mb-6">
              <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center">
                <MapPin size={20} color="#F8B6C8" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="font-cairo-bold text-[8px] text-adminMuted tracking-widest uppercase">Delivering To</Text>
                <Text className="font-poppins-bold text-sm text-adminText mt-0.5">Jessica Thompson</Text>
                <Text className="font-cairo-medium text-[10px] text-adminMuted mt-0.5">4200 Luxury Avenue, Beverly Hills</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center">
              <Shield size={14} color="#4ADE80" className="mr-2" />
              <Text className="font-cairo-bold text-[10px] text-green-500 uppercase tracking-widest">Temperature Shield Active • 64°F</Text>
            </View>
          </BlurView>
        </View>
      </Animated.View>
    </View>
  );
};
