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
  Users, 
  UserPlus,
  TrendingUp, 
  DollarSign, 
  Filter, 
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  SearchX
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';
import { AdminCustomerCard } from '../src/components/ui/AdminCustomerCard';

const { width } = Dimensions.get('window');

// MOCK DATA
const CUSTOMERS: any[] = [
  { 
    id: 'CUST-001', 
    name: 'Eleanor Fant', 
    email: 'eleanor.f@luxury.com', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    totalSpent: '$1,240.50',
    ordersCount: 12,
    status: 'VIP',
    lastActive: '2h ago'
  },
  { 
    id: 'CUST-002', 
    name: 'Marcus Aurelius', 
    email: 'marcus.a@stoic.it', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    totalSpent: '$420.00',
    ordersCount: 4,
    status: 'Regular',
    lastActive: '5h ago'
  },
  { 
    id: 'CUST-003', 
    name: 'Isabella Rossellini', 
    email: 'isabella@cine.fr', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    totalSpent: '$2,100.00',
    ordersCount: 18,
    status: 'VIP',
    lastActive: '1d ago'
  },
  { 
    id: 'CUST-004', 
    name: 'John Wick', 
    email: 'baba.yaga@continental.com', 
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=200&auto=format&fit=crop',
    totalSpent: '$65.00',
    ordersCount: 1,
    status: 'New',
    lastActive: '2d ago'
  },
];

const ANALYTICS = [
  { label: 'Total Customers', value: '4,842', icon: Users, color: '#38BDF8' },
  { label: 'Avg. LTV', value: '$248.50', icon: DollarSign, color: '#D4A373' },
  { label: 'Retention Rate', value: '78.2%', icon: TrendingUp, color: '#4ADE80' },
];

const STATUS_FILTERS = ['All', 'VIP', 'Regular', 'New'];

export default function AdminCustomersScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = CUSTOMERS.filter(cust => {
    const matchesFilter = activeFilter === 'All' || cust.status === activeFilter;
    const matchesSearch = cust.name.toLowerCase().includes(searchQuery.toLowerCase()) || cust.email.toLowerCase().includes(searchQuery.toLowerCase());
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
          title="Customer Registry" 
          subtitle="CRM Portal" 
          showBell 
          hasNotifications
        />

        <View className="px-6 pt-8">
          {/* HEADER */}
          <View className="flex-row justify-between items-end mb-8">
             <View>
                <View className="flex-row items-center mb-1">
                   <Sparkles size={14} color="#D4A373" />
                   <Text className="ml-2 font-cairo-medium text-gold/80 text-[10px] tracking-widest uppercase">Customer Relationship</Text>
                </View>
                <Text className="font-poppins-bold text-3xl text-adminText">Customers</Text>
             </View>
             <TouchableOpacity className="w-12 h-12 rounded-2xl bg-gold items-center justify-center shadow-xl shadow-[#D4A373]/20">
                <UserPlus size={20} color="#FFFFFF" />
             </TouchableOpacity>
          </View>

          {/* CRM ANALYTICS */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 overflow-visible">
            {ANALYTICS.map((stat, i) => (
              <View 
                key={i} 
                className="w-[180] mr-4 bg-surface rounded-[28px] border border-[#D4A373]/10 p-5 overflow-hidden shadow-sm"
              >
                <View 
                  className="w-10 h-10 rounded-xl items-center justify-center mb-4"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon size={18} color={stat.color} />
                </View>
                <Text className="font-poppins-bold text-2xl text-adminText">{stat.value}</Text>
                <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-widest">{stat.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* SEARCH & FILTERS */}
          <View className="mb-8">
            <View className="flex-row items-center h-12 bg-surface rounded-2xl px-4 border border-[#D4A373]/10 mb-4 shadow-sm">
              <Search size={18} color="#8C7A77" />
              <TextInput 
                placeholder="Find customer by name or email..." 
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
              {STATUS_FILTERS.map((filter, i) => ( activeFilter === filter ? (
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

          {/* CUSTOMER LIST */}
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-poppins-bold text-xl text-adminText">Registry</Text>
              <View className="flex-row items-center">
                 <Filter size={14} color="#D4A373" />
                 <Text className="ml-2 font-cairo-bold text-gold text-[10px] uppercase">{filteredCustomers.length} Users Found</Text>
              </View>
            </View>

            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((cust, i) => (
                <AdminCustomerCard 
                   key={cust.id}
                   {...cust}
                   index={i}
                   onViewHistory={() => {}}
                />
              ))
            ) : (
              <View className="py-20 items-center justify-center">
                 <View className="w-20 h-20 rounded-full bg-[#D4A373]/5 items-center justify-center mb-6 border border-[#D4A373]/10">
                    <SearchX size={40} color="#8C7A77" />
                 </View>
                 <Text className="font-poppins-bold text-adminText text-lg">No matches in registry</Text>
                 <Text className="font-cairo-medium text-adminMuted text-sm text-center px-10">We couldn't find any customers matching your search criteria.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
