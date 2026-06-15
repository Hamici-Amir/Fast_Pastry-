import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { BlurView } from 'expo-blur';
import { 
  Menu, 
  Send, 
  Bell, 
  Target, 
  Calendar, 
  History, 
  Megaphone, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MoreVertical,
  Plus,
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';

const { width } = Dimensions.get('window');

// MOCK DATA
const NOTIFICATION_HISTORY = [
  { id: 'N-001', title: 'Midnight Velvet Flash Sale!', type: 'Campaign', target: 'VIP Customers', reach: '1,240', opens: '84%', status: 'Sent', time: '2h ago' },
  { id: 'N-002', title: 'New Fleet Guidelines Updated', type: 'Announcement', target: 'All Drivers', reach: '42', opens: '100%', status: 'Sent', time: '5h ago' },
  { id: 'N-003', title: 'Weekend Special: Rose Bloom', type: 'Campaign', target: 'General Users', reach: '3,500', opens: '12%', status: 'Scheduled', time: 'Tomorrow' },
];

const TARGETS = ['All Users', 'VIP Customers', 'Drivers', 'New Registered'];

export default function AdminNotificationsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [targetAudience, setTargetAudience] = useState('All Users');

  return (
    <View className="flex-1 bg-adminBg">
      <LinearGradient
        colors={['#FFF8F2', '#FADADD', '#F8B6C8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Ambient Gloss Effects */}
      <View className="absolute -top-[100] -left-[100] w-[400] h-[400] rounded-full bg-white/40 blur-[100px]" pointerEvents="none" />
      <View className="absolute bottom-[100] -right-[150] w-[350] h-[350] rounded-full bg-gold/10 blur-[100px]" pointerEvents="none" />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <AppHeader 
          title={t('admin:notifications')} 
          subtitle="Communication Hub" 
          showBell 
          onBellPress={() => {}}
        />

        <View className="px-6 pt-8">
          {/* HEADER */}
          <View className="mb-8">
             <View className="flex-row items-center mb-1">
                <Sparkles size={14} color="#D4A373" />
                <Text className="ml-2 font-cairo-medium text-gold/80 text-[10px] tracking-widest uppercase">Communication Hub</Text>
             </View>
             <Text className="font-poppins-bold text-3xl text-adminText tracking-tightest">{t('admin:notifications')}</Text>
          </View>

          {/* TABS */}
          <View className="flex-row bg-white/60 rounded-2xl border border-rose-200/30 p-1.5 mb-8 shadow-sm">
             <TouchableOpacity 
                onPress={() => setActiveTab('create')}
                className={`flex-1 flex-row items-center justify-center h-12 rounded-xl ${activeTab === 'create' ? 'bg-rose-400 shadow-sm' : ''}`}
             >
                <Plus size={16} color={activeTab === 'create' ? '#FFFFFF' : '#8C7A77'} />
                <Text className={`ml-2 font-poppins-bold text-sm ${activeTab === 'create' ? 'text-white' : 'text-[#8C7A77]'}`}>{t('admin:send_notification')}</Text>
             </TouchableOpacity>
             <TouchableOpacity 
                onPress={() => setActiveTab('history')}
                className={`flex-1 flex-row items-center justify-center h-12 rounded-xl ${activeTab === 'history' ? 'bg-rose-400 shadow-sm' : ''}`}
             >
                <History size={16} color={activeTab === 'history' ? '#FFFFFF' : '#8C7A77'} />
                <Text className={`ml-2 font-poppins-bold text-sm ${activeTab === 'history' ? 'text-white' : 'text-[#8C7A77]'}`}>{t('admin:notifications')}</Text>
             </TouchableOpacity>
          </View>

          {activeTab === 'create' ? (
            <Animated.View entering={FadeInUp.duration(600)}>
               {/* CREATE FORM */}
               <View className="bg-white/70 rounded-[32px] border border-rose-200/30 p-6 gap-6 shadow-sm overflow-hidden">
                  <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFillObject} />
                  {/* Title & Message */}
                  <View>
                      <Text className="font-cairo-bold text-[10px] text-gold/80 uppercase tracking-widest mb-3">{t('admin:send_notification')}</Text>
                     <TextInput 
                         placeholder={t('admin:notification_title')}
                        placeholderTextColor="#A18E8B"
                        className="bg-white/60 rounded-2xl border border-rose-200/50 px-5 h-14 text-adminText font-poppins text-sm mb-4 transition-all"
                     />
                     <TextInput 
                         placeholder={t('admin:notification_body')}
                        placeholderTextColor="#A18E8B"
                        multiline
                        textAlignVertical="top"
                        className="bg-white/60 rounded-2xl border border-rose-200/50 px-5 py-4 min-h-[120] text-adminText font-poppins text-sm"
                     />
                  </View>

                  {/* Target Audience */}
                  <View>
                      <Text className="font-cairo-bold text-[10px] text-gold/80 uppercase tracking-widest mb-3">{t('admin:send_notification')}</Text>
                     <View className="flex-row flex-wrap gap-2">
                        {TARGETS.map((target, i) => {
                          const isActive = targetAudience === target;
                          return (
                           <TouchableOpacity 
                               key={i}
                               onPress={() => setTargetAudience(target)}
                               className={`px-4 py-2 rounded-xl border border-rose-200/30 ${isActive ? 'bg-gold border-gold shadow-sm' : 'bg-white/60'}`}
                           >
                               <Text className={`font-poppins-bold text-[10px] ${isActive ? 'text-white' : 'text-adminMuted'}`}>{target}</Text>
                           </TouchableOpacity>
                          );
                        })}
                     </View>
                  </View>

                  {/* Settings */}
                  <View className="gap-4">
                     <View className="flex-row items-center justify-between p-4 bg-white/60 rounded-2xl border border-rose-200/30">
                        <View className="flex-row items-center">
                           <TrendingUp size={16} color="#4ADE80" />
                           <Text className="ml-3 font-poppins-bold text-adminText text-sm">{t('admin:send_notification')}</Text>
                        </View>
                        <Switch trackColor={{ false: '#E2E8F0', true: '#4ADE80' }} thumbColor="#FFFFFF" />
                     </View>
                     <View className="flex-row items-center justify-between p-4 bg-white/60 rounded-2xl border border-rose-200/30">
                        <View className="flex-row items-center">
                           <Calendar size={16} color="#38BDF8" />
                           <Text className="ml-3 font-poppins-bold text-adminText text-sm">{t('admin:send_notification')}</Text>
                        </View>
                        <Switch trackColor={{ false: '#E2E8F0', true: '#38BDF8' }} thumbColor="#FFFFFF" />
                     </View>
                  </View>

                  <TouchableOpacity className="h-16 bg-rose-400 rounded-[24px] items-center justify-center shadow-2xl shadow-rose-400/30 mt-2">
                     <View className="flex-row items-center">
                        <Send size={20} color="#FFFFFF" />
                        <Text className="ml-3 font-poppins-bold text-white text-lg uppercase">{t('admin:send_notification')}</Text>
                     </View>
                  </TouchableOpacity>
               </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.duration(600)}>
               {/* CAMPAIGN HISTORY */}
               <View className="gap-4">
                  {NOTIFICATION_HISTORY.map((item, i) => (
                    <TouchableOpacity 
                       key={i} 
                       className="bg-white/70 rounded-[28px] border border-rose-200/30 overflow-hidden shadow-sm"
                    >
                       <BlurView intensity={60} tint="light" className="p-5">
                          <View className="flex-row justify-between mb-4">
                             <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-xl bg-rose-100 items-center justify-center border border-rose-200/50">
                                   <Megaphone size={16} color="#D4A373" />
                                </View>
                                <View className="ml-4">
                                   <Text className="font-poppins-bold text-adminText text-base" numberOfLines={1}>{item.title}</Text>
                                   <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-widest">{item.type} • {item.target}</Text>
                                </View>
                             </View>
                             <TouchableOpacity className="w-8 h-8 rounded-lg bg-white/40 items-center justify-center border border-rose-200/30">
                                <MoreVertical size={16} color="#8C7A77" />
                             </TouchableOpacity>
                          </View>

                          <View className="flex-row justify-between p-4 bg-white/40 rounded-2xl border border-rose-200/50 border-dashed mb-4">
                             <View>
                                <Text className="font-cairo-bold text-[8px] text-adminMuted uppercase mb-1">TOTAL REACH</Text>
                                <View className="flex-row items-center">
                                   <Users size={12} color="#38BDF8" />
                                   <Text className="ml-2 font-poppins-bold text-adminText text-xs">{item.reach}</Text>
                                </View>
                             </View>
                             <View className="h-full w-[1] bg-rose-200/50" />
                             <View>
                                <Text className="font-cairo-bold text-[8px] text-adminMuted uppercase mb-1">OPEN RATE</Text>
                                <View className="flex-row items-center">
                                   <TrendingUp size={12} color="#4ADE80" />
                                   <Text className="ml-2 font-poppins-bold text-adminText text-xs">{item.opens}</Text>
                                </View>
                             </View>
                             <View className="h-full w-[1] bg-rose-200/50" />
                             <View className="items-end">
                                <Text className="font-cairo-bold text-[8px] text-adminMuted uppercase mb-1">STATUS</Text>
                                <Text className={`font-poppins-bold text-[10px] ${item.status === 'Sent' ? 'text-green-600' : 'text-amber-600'}`}>{item.status}</Text>
                             </View>
                          </View>

                          <View className="flex-row items-center justify-between">
                             <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase">Sent {item.time}</Text>
                             <TouchableOpacity className="flex-row items-center">
                                <Text className="font-poppins-bold text-gold text-[10px] mr-1">Deep Analytics</Text>
                                <ChevronRight size={10} color="#D4A373" />
                             </TouchableOpacity>
                          </View>
                       </BlurView>
                    </TouchableOpacity>
                  ))}
               </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Quick Stats Overlay */}
      <View className="absolute bottom-10 left-6 right-6 shadow-2xl">
         <BlurView intensity={90} tint="light" className="rounded-3xl border border-rose-200/50 overflow-hidden">
            <View className="flex-row justify-around py-4 bg-white/40">
               <View className="items-center">
                  <Text className="font-poppins-bold text-adminText text-lg">12.4k</Text>
                  <Text className="font-cairo-bold text-adminMuted text-[8px] uppercase">Month Reach</Text>
               </View>
               <View className="w-[1] h-full bg-rose-200/50" />
               <View className="items-center">
                  <Text className="font-poppins-bold text-adminText text-lg">68%</Text>
                  <Text className="font-cairo-bold text-adminMuted text-[8px] uppercase">Avg Open Rate</Text>
               </View>
               <View className="w-[1] h-full bg-rose-200/50" />
               <View className="items-center">
                  <Text className="font-poppins-bold text-adminText text-lg">420</Text>
                  <Text className="font-cairo-bold text-adminMuted text-[8px] uppercase">Conversions</Text>
               </View>
            </View>
         </BlurView>
      </View>
    </View>
  );
}
