import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { 
  Menu, 
  Search, 
  Bell, 
  Filter, 
  Plus, 
  TrendingUp, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  ArrowUpDown
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';
import { AdminOrderCard } from '../src/components/ui/AdminOrderCard';

const { width } = Dimensions.get('window');

// MOCK DATA
const ORDERS: any[] = [
  { id: '#FP-1201', customerName: 'Sophia Loren', amount: '$84.50', status: 'Pending', priority: 'High', time: '2m ago', driver: null },
  { id: '#FP-1200', customerName: 'James Dean', amount: '$120.00', status: 'Preparing', priority: 'Medium', time: '15m ago', driver: 'Alex R.' },
  { id: '#FP-1199', customerName: 'Audrey H.', amount: '$45.00', status: 'In Route', priority: 'Low', time: '22m ago', driver: 'Sarah M.' },
  { id: '#FP-1198', customerName: 'Marilyn M.', amount: '$210.30', status: 'Delivered', priority: 'High', time: '1h ago', driver: 'John D.' },
  { id: '#FP-1197', customerName: 'Elvis P.', amount: '$75.00', status: 'Cancelled', priority: 'Medium', time: '2h ago', driver: null },
];

const ORDER_STATS = [
  { label: 'Total Orders', value: '1,284', icon: ShoppingCart, color: '#D4A373' },
  { label: 'In Progress', value: '42', icon: Clock, color: '#60A5FA' },
  { label: 'Completed', value: '1,120', icon: CheckCircle2, color: '#4ADE80' },
  { label: 'Issues', value: '3', icon: AlertCircle, color: '#F43F5E' },
];

const FILTERS = ['All', 'Pending', 'Preparing', 'In Route', 'Delivered'];

export default function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = ORDERS.filter(order => {
    const matchesFilter = activeFilter === 'All' || order.status === activeFilter;
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View className="flex-1 bg-background">
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <AppHeader 
          title="Order Management" 
          subtitle="Admin Hub" 
          showBell 
        />

        <View className="px-6 pt-8">
          {/* ANALYTICS HEADER */}
          <View className="flex-row flex-wrap justify-between gap-3 mb-8">
            {ORDER_STATS.map((stat, i) => (
              <Animated.View 
                key={i} 
                entering={FadeInDown.duration(600).delay(i * 100).springify()}
                className="w-[48%] bg-surface rounded-2xl border border-[#D4A373]/10 p-4 shadow-sm"
              >
                <View 
                  className="w-8 h-8 rounded-lg items-center justify-center mb-3"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon size={16} color={stat.color} />
                </View>
                <Text className="font-poppins-bold text-xl text-adminText">{stat.value}</Text>
                <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-widest">{stat.label}</Text>
              </Animated.View>
            ))}
          </View>

          {/* SEARCH & FILTERS */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)} className="mb-8">
            <View className="flex-row items-center h-12 bg-surface rounded-2xl px-4 border border-[#D4A373]/10 mb-4 shadow-sm">
              <Search size={18} color="#8C7A77" />
              <TextInput 
                placeholder="Search orders or customers..." 
                placeholderTextColor="#A18E8B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-adminText font-poppins text-sm"
              />
              <TouchableOpacity className="ml-2 w-8 h-8 items-center justify-center rounded-lg bg-gold/10">
                <ArrowUpDown size={14} color="#D4A373" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {FILTERS.map((filter, i) => {
                 const isActive = activeFilter === filter;
                 return (
                  <TouchableOpacity 
                    key={i}
                    onPress={() => setActiveFilter(filter)}
                    activeOpacity={0.8}
                    className={`px-5 py-2 rounded-xl shadow-sm border ${isActive ? 'bg-gold border-gold' : 'border-[#D4A373]/10 bg-surface'}`}
                  >
                    <Text className={`font-poppins-bold text-xs ${isActive ? 'text-white' : 'text-adminMuted'}`}>
                      {filter}
                    </Text>
                  </TouchableOpacity>
                 );
              })}
            </ScrollView>
          </Animated.View>

          {/* ORDERS LIST */}
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-poppins-bold text-xl text-adminText">All Orders</Text>
              <Text className="font-cairo-bold text-gold text-xs">{filteredOrders.length} RESULTS</Text>
            </View>

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, i) => (
                <Animated.View 
                  key={order.id} 
                  entering={FadeInDown.duration(600).delay(i * 100).springify().damping(12)}
                  layout={Layout.springify()}
                >
                  <AdminOrderCard 
                     {...order}
                     index={i}
                     onAssignDriver={() => {}}
                  />
                </Animated.View>
              ))
            ) : (
              <Animated.View entering={FadeInUp} className="py-20 items-center justify-center">
                 <View className="w-16 h-16 rounded-full bg-[#D4A373]/5 items-center justify-center mb-4 border border-[#D4A373]/10">
                    <XCircle size={32} color="#8C7A77" />
                 </View>
                 <Text className="font-poppins-bold text-adminText text-lg">No orders found</Text>
                 <Text className="font-cairo-medium text-adminMuted text-sm text-center px-10">Try adjusting your filters or search query to find what you're looking for.</Text>
              </Animated.View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action */}
      <TouchableOpacity 
        className="absolute bottom-10 right-6 w-14 h-14 bg-gold rounded-full items-center justify-center shadow-2xl shadow-[#D4A373]/40"
        style={{ elevation: 10 }}
      >
        <Plus size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
