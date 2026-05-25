import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { BlurView } from 'expo-blur';
import { 
  Menu, 
  Search, 
  Bell, 
  Truck, 
  ShieldCheck,
  TrendingUp, 
  DollarSign, 
  Filter, 
  ChevronRight,
  Sparkles,
  Map,
  Users,
  AlertCircle,
  Clock
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';
import { AdminDriverCard } from '../src/components/ui/AdminDriverCard';

const { width } = Dimensions.get('window');

// MOCK DATA
const DRIVERS: any[] = [
  { 
    id: 'DRV-102', 
    name: 'Sarah Miller', 
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    status: 'Online',
    rating: 4.9,
    totalEarnings: '$2,840.00',
    deliveriesCount: 412,
    activeDelivery: '#FP-1201'
  },
  { 
    id: 'DRV-105', 
    name: 'James Rodriguez', 
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    status: 'Online',
    rating: 4.7,
    totalEarnings: '$1,920.50',
    deliveriesCount: 284,
    activeDelivery: null
  },
  { 
    id: 'DRV-133', 
    name: 'Elena Gilbert', 
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=200&auto=format&fit=crop',
    status: 'Pending',
    rating: 0,
    totalEarnings: '$0.00',
    deliveriesCount: 0,
    activeDelivery: null
  },
  { 
    id: 'DRV-098', 
    name: 'Michael Chen', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    status: 'Offline',
    rating: 4.8,
    totalEarnings: '$3,150.00',
    deliveriesCount: 520,
    activeDelivery: null
  },
];

const STATS = [
  { label: 'Active Fleet', value: '42', icon: Truck, color: '#4ADE80' },
  { label: 'Pending Apps', value: '7', icon: Clock, color: '#FBBF24' },
  { label: 'Fleet ROI', value: '84%', icon: TrendingUp, color: '#38BDF8' },
];

const FILTERS = ['All Drivers', 'Online', 'Offline', 'Pending Approval'];

export default function AdminDriversScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [activeFilter, setActiveFilter] = useState('All Drivers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = DRIVERS.filter(drv => {
    const filterMap: any = {
       'All Drivers': true,
       'Online': drv.status === 'Online',
       'Offline': drv.status === 'Offline',
       'Pending Approval': drv.status === 'Pending'
    };
    const matchesFilter = filterMap[activeFilter];
    const matchesSearch = drv.name.toLowerCase().includes(searchQuery.toLowerCase()) || drv.id.toLowerCase().includes(searchQuery.toLowerCase());
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
          title="Drive Force" 
          subtitle="Fleet Management" 
          showBell 
          hasNotifications
        />

        <View className="px-6 pt-8">
          {/* HEADER SECTION */}
          <View className="mb-8">
             <View className="flex-row items-center mb-1">
                <Sparkles size={14} color="#D4A373" />
                <Text className="ml-2 font-cairo-medium text-gold/80 text-[10px] tracking-widest uppercase">Fleet Management</Text>
             </View>
             <Text className="font-poppins-bold text-3xl text-adminText">Drive Force</Text>
          </View>

          {/* FLEET ANALYTICS */}
          <View className="flex-row justify-between mb-8">
             {STATS.map((stat, i) => (
                <View key={i} className="flex-1 mr-3 last:mr-0 shadow-sm">
                   <View className="bg-surface rounded-[24px] border border-[#D4A373]/10 p-4 items-center">
                      <View className="w-8 h-8 rounded-full bg-[#D4A373]/10 items-center justify-center mb-2">
                         <stat.icon size={14} color="#D4A373" />
                      </View>
                      <Text className="font-poppins-bold text-xl text-adminText">{stat.value}</Text>
                      <Text className="font-cairo-medium text-adminMuted text-[8px] uppercase tracking-widest text-center">{stat.label}</Text>
                   </View>
                </View>
             ))}
          </View>

          {/* SEARCH & FILTERS */}
          <View className="mb-8">
            <View className="flex-row items-center h-12 bg-surface rounded-2xl px-4 border border-[#D4A373]/10 mb-4 shadow-sm">
              <Search size={18} color="#8C7A77" />
              <TextInput 
                placeholder="Search fleet by name or ID..." 
                placeholderTextColor="#A18E8B"
                value={searchQuery}
                onChangeText={setSearchQuery}
                className="flex-1 ml-3 text-adminText font-poppins text-sm"
              />
              <TouchableOpacity className="ml-2 w-8 h-8 items-center justify-center rounded-lg bg-gold/10">
                <Filter size={14} color="#D4A373" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {FILTERS.map((filter, i) => ( activeFilter === filter ? (
                <TouchableOpacity 
                   key={i}
                   onPress={() => setActiveFilter(filter)}
                   className="px-5 py-2 rounded-xl bg-gold border border-gold shadow-sm"
                >
                  <Text className="font-poppins-bold text-xs text-white">
                    {filter}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  key={i}
                  onPress={() => setActiveFilter(filter)}
                  className="px-5 py-2 rounded-xl border border-[#D4A373]/10 bg-surface shadow-sm"
                >
                  <Text className="font-poppins-bold text-xs text-adminMuted">
                    {filter}
                  </Text>
                </TouchableOpacity>
              )))}
            </ScrollView>
          </View>

          {/* DRIVERS LIST */}
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-poppins-bold text-xl text-adminText">Personnel</Text>
              <View className="flex-row items-center">
                 <Users size={14} color="#D4A373" />
                 <Text className="ml-2 font-cairo-bold text-gold text-[10px] uppercase">{filteredDrivers.length} ACTIVE MEMBERS</Text>
              </View>
            </View>

            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((drv, i) => (
                <AdminDriverCard 
                   key={drv.id}
                   {...drv}
                   index={i}
                   onApprove={() => {}}
                   onViewDetails={() => {}}
                />
              ))
            ) : (
              <View className="py-20 items-center justify-center">
                 <View className="w-16 h-16 rounded-full bg-[#D4A373]/5 items-center justify-center mb-4 border border-[#D4A373]/10">
                    <AlertCircle size={32} color="#8C7A77" />
                 </View>
                 <Text className="font-poppins-bold text-adminText text-lg">No personnel found</Text>
                 <Text className="font-cairo-medium text-adminMuted text-sm text-center px-10">Adjust your filters to see more members of the delivery fleet.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
