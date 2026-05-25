import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  MapPin, 
  Clock, 
  Navigation, 
  MessageCircle, 
  AlertCircle,
  PackageSearch,
  Sparkles,
  ChevronRight
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const INCOMING_ORDERS = [
  {
    id: '#5092',
    customer: 'Jessica T.',
    cake: 'Three-Tier Vanilla Rose',
    price: '$34.50',
    distance: '2.4 miles',
    eta: '12 mins',
    bakery: 'Boutique HQ',
    destination: 'Beverly Hills',
    isRush: true,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: '#5091',
    customer: 'Michael R.',
    cake: 'Chocolate Ganache Supreme',
    price: '$18.00',
    distance: '4.1 miles',
    eta: '22 mins',
    bakery: 'Westside Kitchen',
    destination: 'Santa Monica',
    isRush: false,
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=300&auto=format&fit=crop'
  }
];

export const DriverOrdersView = () => {
  const router = useRouter();
  return (
    <ScrollView 
      contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20, paddingTop: 10 }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(600)} className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-gold/10 items-center justify-center">
             <PackageSearch size={20} color="#D4A373" />
          </View>
          <Text className="font-poppins-bold text-2xl text-adminText ml-4">Order Radar</Text>
        </View>
        <View className="flex-row items-center bg-green-50 px-3 py-1.5 rounded-xl border border-green-100">
          <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
          <Text className="font-cairo-bold text-[10px] text-green-500 tracking-widest uppercase">Scanning</Text>
        </View>
      </Animated.View>

      <View className="gap-6">
        {INCOMING_ORDERS.map((order, i) => (
          <Animated.View key={order.id} entering={FadeInRight.duration(600).delay(i * 150)}>
            <View className="bg-surface rounded-[32px] border border-[#D4A373]/10 overflow-hidden shadow-sm">
              <View className="p-5">
                {order.isRush && (
                  <View className="flex-row items-center bg-[#D4A373]/10 px-3 py-1 rounded-xl border border-[#D4A373]/20 self-start mb-4">
                    <AlertCircle size={12} color="#F43F5E" className="mr-1.5" />
                    <Text className="font-cairo-bold text-[9px] text-[#D4A373] tracking-widest uppercase">Priority Dispatch</Text>
                  </View>
                )}

                <View className="flex-row mb-5">
                  <View className="w-20 h-20 rounded-2xl overflow-hidden border border-rose-200/30 shadow-sm">
                    <Image source={{ uri: order.image }} style={{ width: '100%', height: '100%' }} />
                  </View>
                  <View className="flex-1 ml-4 justify-center">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-cairo-bold text-xs text-gold/80 tracking-widest leading-tight uppercase">{order.id}</Text>
                      <Text className="font-poppins-bold text-xl text-adminText leading-tight">{order.price}</Text>
                    </View>
                    <Text className="font-poppins-bold text-base text-adminText" numberOfLines={1}>{order.cake}</Text>
                    <Text className="font-cairo-medium text-adminMuted text-xs">For {order.customer}</Text>
                  </View>
                </View>

                <View className="flex-row gap-4 mb-5">
                   <View className="flex-row items-center bg-white/60 px-3 py-2 rounded-xl border border-rose-200/30">
                      <MapPin size={14} color="#D4A373" />
                      <Text className="ml-2 font-poppins-bold text-xs text-adminText">{order.distance}</Text>
                   </View>
                   <View className="flex-row items-center bg-[#D4A373]/5 px-3 py-2 rounded-xl border border-[#D4A373]/10">
                      <Clock size={14} color="#D4A373" />
                      <Text className="ml-2 font-poppins-bold text-xs text-adminText">{order.eta} avg</Text>
                   </View>
                </View>

                <View className="bg-[#D4A373]/5 p-4 rounded-2xl border border-[#D4A373]/10 mb-6">
                   <View className="flex-row items-center">
                      <View className="w-2.5 h-2.5 rounded-full bg-gold border-2 border-white mr-3 shadow-sm" />
                      <Text className="font-poppins-bold text-xs text-adminText" numberOfLines={1}>{order.bakery}</Text>
                   </View>
                   <View className="w-0.5 h-4 bg-[#D4A373]/20 ml-1.25 my-1" />
                   <View className="flex-row items-center">
                      <View className="w-2.5 h-2.5 rounded-full bg-[#D4A373] border-2 border-white mr-3 shadow-sm" />
                      <Text className="font-poppins-bold text-xs text-adminText" numberOfLines={1}>{order.destination}</Text>
                   </View>
                </View>

                <View className="flex-row gap-3">
                  <TouchableOpacity className="flex-1 h-14 rounded-xl bg-[#D4A373]/5 border border-[#D4A373]/10 items-center justify-center">
                    <Text className="font-poppins-bold text-adminMuted text-sm">Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-[2.5] h-14 rounded-xl bg-gold items-center justify-center shadow-lg shadow-[#D4A373]/30"
                    onPress={() => router.push('/driver-delivery')}
                  >
                    <View className="flex-row items-center">
                       <Navigation size={18} color="#FFFFFF" className="mr-2" />
                       <Text className="font-poppins-bold text-white text-sm tracking-widest uppercase">Accept Delivery</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});
