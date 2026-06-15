import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { 
  Menu, 
  Search, 
  Bell, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign,
  Plus,
  Tag,
  Truck,
  MessageSquare,
  ArrowRight,
  MoreVertical,
  Activity,
  Award
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';
import { AdminStatCard } from '../src/components/ui/AdminStatCard';
import { PremiumChart } from '../src/components/ui/PremiumChart';
import { AdminTabBar } from '../src/components/navigation/AdminTabBar';

const { width } = Dimensions.get('window');

// MOCK DATA
const RECENT_ORDERS = [
  { id: '#FP-9281', customer: 'Isabella V.', status: 'In Route', amount: '$184.00', time: '5m ago', color: '#60A5FA' },
  { id: '#FP-9280', customer: 'Marcus J.', status: 'Pending', amount: '$420.50', time: '12m ago', color: '#FBBF24' },
  { id: '#FP-9279', customer: 'Elena S.', status: 'Delivered', amount: '$95.00', time: '45m ago', color: '#4ADE80' },
];

const QUICK_ACTIONS = [
  { icon: Plus, label: 'Add Cake', sub: 'New inventory', color: '#D4A373' },
  { icon: Tag, label: 'Promotions', sub: 'Boost sales', color: '#F43F5E' },
  { icon: Truck, label: 'Assign', sub: 'Fleet management', color: '#60A5FA' },
  { icon: MessageSquare, label: 'Broadcast', sub: 'To customers', color: '#A78BFA' },
];

export default function AdminDashboardScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState('dashboard');

  const STATS = [
    { label: t('admin:total_revenue'), value: '$128.4K', change: '+14.2%', icon: DollarSign, color: '#D4A373' },
    { label: t('admin:total_orders'), value: '42', change: '+8.1%', icon: Package, color: '#60A5FA' },
    { label: t('admin:orders_today'), value: '840', change: '+12.5%', icon: Truck, color: '#4ADE80' },
    { label: t('admin:manage_customers'), value: '1.2K', change: '+24.3%', icon: Users, color: '#A78BFA' },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
      default:
        return (
          <ScrollView 
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
          >
            <AppHeader 
              showSearch 
              searchPlaceholder={t('common:search')} 
              showBell 
              hasNotifications 
              showAvatar 
            />

            <View className="px-6 pt-8">
          {/* GREETING */}
          <Animated.View entering={FadeInDown.duration(600)} className="mb-8">
            <View className="flex-row items-center mb-1">
              <Text className="font-cairo-medium text-gold/80 text-xs tracking-widest uppercase">{t('admin:dashboard')}</Text>
              <View className="ml-2 px-2 py-[2px] bg-gold/10 rounded-md border border-gold/20">
                <Text className="font-poppins-bold text-[8px] text-gold uppercase">Prime</Text>
              </View>
            </View>
            <Text className="font-poppins-bold text-3xl text-adminText tracking-tightest">{t('admin:dashboard')}</Text>
          </Animated.View>

          {/* QUICK ACTIONS GRID */}
          <View className="flex-row flex-wrap justify-between gap-3 mb-8">
            {QUICK_ACTIONS.map((action, i) => (
              <TouchableOpacity 
                key={i} 
                className="w-[48%] bg-surface rounded-2xl border border-[#D4A373]/10 p-4 shadow-sm"
              >
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg items-center justify-center bg-white border border-[#D4A373]/10 mr-3">
                    <action.icon size={16} color={action.color} />
                  </View>
                  <Text className="font-poppins-bold text-adminText text-[13px]">{action.label}</Text>
                </View>
                <Text className="font-cairo-medium text-[#8C7A77] text-[10px]">{action.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* STATISTICS GRID */}
          <View className="flex-row flex-wrap justify-between gap-4 mb-8">
            {STATS.map((stat, i) => (
              <AdminStatCard key={i} {...stat} index={i} />
            ))}
          </View>

          {/* REVENUE ANALYTICS */}
          <Animated.View 
            entering={FadeInUp.duration(800).delay(400)} 
            className="mb-8 p-6 bg-surface rounded-[32px] border border-[#D4A373]/10 shadow-sm"
          >
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-poppins-bold text-2xl text-adminText">$45,240.00</Text>
                <Text className="font-cairo-medium text-[#8C7A77] text-sm">{t('admin:monthly_report')}</Text>
              </View>
              <View className="flex-row items-center px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                <TrendingUp size={12} color="#4ADE80" />
                <Text className="ml-1 font-poppins-bold text-[10px] text-green-600">+12%</Text>
              </View>
            </View>

            <PremiumChart data={[20, 45, 28, 80, 60, 95, 120]} />

            <View className="flex-row justify-between mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <Text key={i} className="font-cairo-bold text-[10px] text-[#A18E8B]">{day}</Text>
              ))}
            </View>
          </Animated.View>

          {/* LIVE ACTIVITY FEED */}
          <View className="mb-20">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <Activity size={20} color="#D4A373" />
                <Text className="ml-2 font-poppins-bold text-xl text-adminText">{t('admin:dashboard')}</Text>
              </View>
              <TouchableOpacity className="flex-row items-center">
                <Text className="font-cairo-bold text-gold text-sm">{t('admin:weekly_report')}</Text>
                <ArrowRight size={14} color="#D4A373" className="ml-1" />
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              {RECENT_ORDERS.map((order, i) => (
                <Animated.View 
                  key={i} 
                  entering={FadeInDown.duration(600).delay(700 + i * 100)}
                  className="flex-row items-center bg-surface rounded-2xl border border-[#D4A373]/10 p-4 shadow-sm"
                >
                  <View className="w-12 h-12 rounded-xl items-center justify-center bg-white border border-[#D4A373]/10 mr-4">
                    <Text className="font-poppins-bold text-lg text-[#D4A373]">{order.customer.charAt(0)}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-poppins-bold text-adminText text-base">{order.customer}</Text>
                      <Text className="font-poppins-bold text-gold text-sm">{order.amount}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="font-cairo-medium text-[#8C7A77] text-xs uppercase tracking-widest">{order.id} • {order.time}</Text>
                      <View className="mx-2 w-1 h-1 rounded-full bg-[#D4A373]/20" />
                      <View className="px-2 py-[2px] rounded-md border" style={{ borderColor: `${order.color}30`, backgroundColor: `${order.color}10` }}>
                        <Text className="font-cairo-bold text-[9px]" style={{ color: order.color }}>{order.status}</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity className="ml-4">
                    <MoreVertical size={20} color="#8C7A77" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        </View>
        </ScrollView>
        );
      case 'orders':
      case 'fleet':
      case 'customers':
      case 'settings':
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="font-poppins-medium text-[#8C7A77]">{t('admin:no_data')}</Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        {renderContent()}
      </View>

      {/* Floating Global Action (Only on Dashboard) */}
      {activeTab === 'dashboard' && (
          <TouchableOpacity 
            className="absolute bottom-28 right-6 w-14 h-14 bg-[#D4A373] rounded-full items-center justify-center shadow-lg shadow-[#D4A373]/30"
            style={{ elevation: 10 }}
          >
            <Plus size={30} color="#FFFFFF" strokeWidth={1.5} />
          </TouchableOpacity>
      )}

      {/* Floating Tab Bar entirely synced with Client */}
      <AdminTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
