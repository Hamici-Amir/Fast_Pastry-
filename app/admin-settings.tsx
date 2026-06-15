import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, TextInput, StyleSheet, Switch } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../src/components/ui/LanguagePicker';
import { 
  Menu, 
  Bell, 
  CreditCard, 
  Truck, 
  Shield, 
  Globe, 
  Settings, 
  Smartphone,
  ChevronRight,
  Sparkles,
  Lock,
  Moon,
  Volume2,
  Cpu,
  BadgeCheck,
  Save
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';

const { width } = Dimensions.get('window');

interface SettingsItemProps {
  icon: any;
  label: string;
  subLabel: string;
  type: 'toggle' | 'link' | 'input';
  value?: boolean | string;
  onValueChange?: (v: any) => void;
  color: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon: Icon, label, subLabel, type, value, onValueChange, color }) => (
  <TouchableOpacity 
    disabled={type === 'input'}
    activeOpacity={0.7}
    className="flex-row items-center justify-between py-4"
  >
    <View className="flex-row items-center flex-1">
      <View 
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: `${color}10` }}
      >
        <Icon size={18} color={color} />
      </View>
      <View className="flex-1">
        <Text className="font-poppins-bold text-adminText text-sm">{label}</Text>
        <Text className="font-cairo-medium text-adminMuted text-[10px] uppercase tracking-widest">{subLabel}</Text>
      </View>
    </View>

    {type === 'toggle' && (
      <Switch 
        value={value as boolean} 
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: color }}
        thumbColor="#FFFFFF"
      />
    )}
    {type === 'link' && <ChevronRight size={16} color="#8C7A77" />}
    {type === 'input' && (
      <TextInput 
        value={value as string}
        onChangeText={onValueChange}
        className="bg-white/60 border border-border/50 rounded-lg px-3 py-1 text-adminText font-poppins text-xs w-24 text-right shadow-sm"
      />
    )}
  </TouchableOpacity>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Animated.View entering={FadeInDown.duration(600)} className="mb-8">
    <Text className="font-cairo-bold text-gold/80 text-[10px] tracking-widest uppercase mb-4 px-1">{title}</Text>
    <View className="bg-white/70 rounded-[32px] border border-border/30 overflow-hidden shadow-sm">
      <BlurView intensity={40} tint="light" className="px-6 py-2">
        {children}
      </BlurView>
    </View>
  </Animated.View>
);

export default function AdminSettingsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const [settings, setSettings] = useState({
    autoApprove: true,
    stripeLive: false,
    mfaEnabled: true,
    deliveryFee: '5.00',
    appLanguage: 'English',
    notificationsEnabled: true,
    darkMode: false,
  });

  return (
    <View className="flex-1 bg-background">
      <View style={StyleSheet.absoluteFillObject} className="bg-background" />
      
      {/* Ambient Gloss Effects */}
      <View className="absolute -top-[100] -left-[100] w-[400] h-[400] rounded-full bg-white/40 opacity-50" pointerEvents="none" />
      <View className="absolute bottom-[200] -right-[150] w-[350] h-[350] rounded-full bg-gold/5 opacity-50" pointerEvents="none" />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        <AppHeader 
          title={t('admin:settings')} 
          subtitle="Admin Hub" 
          showBell 
          onBellPress={() => {}}
        />

        <View className="px-6 pt-8">
           {/* HEADER */}
          <View className="mb-8">
             <View className="flex-row items-center mb-1">
                <Sparkles size={14} color="#D4A373" />
                <Text className="ml-2 font-cairo-medium text-gold/80 text-[10px] tracking-widest uppercase">Global Preferences</Text>
             </View>
             <Text className="font-poppins-bold text-3xl text-adminText tracking-tightest">{t('admin:settings')}</Text>
          </View>

          {/* PAYMENT SETTINGS */}
          <SettingsSection title={t('admin:settings')}>
             <SettingsItem 
                icon={CreditCard} 
                label="Stripe Integration" 
                subLabel="Live Production payments" 
                type="toggle" 
                value={settings.stripeLive}
                onValueChange={(v) => setSettings({...settings, stripeLive: v})}
                color="#6366F1"
             />
             <View className="h-[1px] w-full bg-rose-200/10" />
             <SettingsItem 
                icon={BadgeCheck} 
                label={t('admin:manage_orders')} 
                subLabel="Skip manual review for VIPs" 
                type="toggle" 
                value={settings.autoApprove}
                onValueChange={(v) => setSettings({...settings, autoApprove: v})}
                color="#4ADE80"
             />
          </SettingsSection>

          {/* DELIVERY SETTINGS */}
          <SettingsSection title={t('admin:fleet')}>
             <SettingsItem 
                icon={Truck} 
                label="Global Delivery Fee" 
                subLabel="Flat rate per delivery" 
                type="input" 
                value={settings.deliveryFee}
                onValueChange={(v) => setSettings({...settings, deliveryFee: v})}
                color="#FBBF24"
             />
             <View className="h-[1px] w-full bg-rose-200/10" />
             <SettingsItem 
                icon={Cpu} 
                label="Optimize Fleet Route" 
                subLabel="AI Automated Dispatching" 
                type="toggle" 
                value={true}
                color="#38BDF8"
             />
          </SettingsSection>

          {/* SECURITY SETTINGS */}
          <SettingsSection title={t('admin:settings')}>
             <SettingsItem 
                icon={Shield} 
                label="Multi-Factor Auth" 
                subLabel="Extra layer for Admin logins" 
                type="toggle" 
                value={settings.mfaEnabled}
                onValueChange={(v) => setSettings({...settings, mfaEnabled: v})}
                color="#F43F5E"
             />
             <View className="h-[1px] w-full bg-rose-200/10" />
             <SettingsItem 
                icon={Lock} 
                label="Session Timeout" 
                subLabel="Auto-logout after 1h" 
                type="toggle" 
                value={true}
                color="#8C7A77"
             />
          </SettingsSection>

           {/* APP SETTINGS */}
          <SettingsSection title={t('admin:settings')}>
             <View className="py-3">
                <LanguagePicker compact />
             </View>
             <View className="h-[1px] w-full bg-rose-200/10" />
             <SettingsItem 
                icon={Moon} 
                label={t('profile:dark_mode')} 
                subLabel="Enhanced OLED UI" 
                type="toggle" 
                value={settings.darkMode}
                onValueChange={(v) => setSettings({...settings, darkMode: v})}
                color="#2C1B18"
             />
             <View className="h-[1px] w-full bg-rose-200/10" />
             <SettingsItem 
                icon={Volume2} 
                label="System Sounds" 
                subLabel="Tactile Audio Feedback" 
                type="toggle" 
                value={true}
                color="#F8B6C8"
             />
          </SettingsSection>

          {/* NOTIFICATION SETTINGS */}
          <SettingsSection title={t('profile:notifications')}>
             <SettingsItem 
                icon={Bell} 
                label={t('profile:notifications')} 
                subLabel="Broadcast to all devices" 
                type="toggle" 
                value={settings.notificationsEnabled}
                onValueChange={(v) => setSettings({...settings, notificationsEnabled: v})}
                color="#38BDF8"
             />
          </SettingsSection>

          <TouchableOpacity className="mt-4 mb-20 items-center">
             <Text className="font-cairo-bold text-rose-400 text-[10px] uppercase tracking-widest">{t('admin:settings')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Floating Save Hint */}
      <View className="absolute bottom-10 left-6 right-6">
         <BlurView intensity={90} tint="light" className="rounded-3xl border border-border/50 overflow-hidden shadow-2xl">
            <View className="flex-row items-center justify-between p-5 bg-white/40">
               <View>
                   <Text className="font-poppins-bold text-adminText text-sm">{t('profile:save_changes')}</Text>
                  <Text className="font-cairo-medium text-adminMuted text-[10px]">3 unsaved modifications</Text>
               </View>
               <TouchableOpacity className="bg-gold px-6 py-2 rounded-xl shadow-sm">
                   <Text className="font-poppins-bold text-white text-xs">{t('common:save')}</Text>
               </TouchableOpacity>
            </View>
         </BlurView>
      </View>
    </View>
  );
}
