import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Dimensions, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'expo-router';
import { 
  LayoutDashboard, 
  PackageSearch, 
  MapPin, 
  Wallet, 
  Bell, 
  FileText, 
  MessageCircle, 
  Settings, 
  LogOut,
  Globe,
  Star,
  CircleDot,
  History,
  ShieldCheck,
  TrendingUp,
  Truck,
  ChevronRight
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { DrawerActions } from '@react-navigation/native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useNavigation } from 'expo-router';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  interpolateColor
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const getMenuItems = (t: any) => [
  { icon: LayoutDashboard, label: t('driver:dashboard'), screen: 'driver', path: '/driver' },
  { icon: PackageSearch, label: t('driver:active_delivery'), screen: 'driver-delivery', path: '/driver-delivery' },
  { icon: History, label: t('driver:deliveries'), screen: 'driver', path: '/driver' },
  { icon: Wallet, label: t('driver:earnings'), screen: 'driver', path: '/driver' },
  { icon: TrendingUp, label: t('driver:earnings'), screen: 'driver', path: '/driver' },
  { icon: Bell, label: t('driver:notifications'), screen: 'driver-notifications', path: '/driver-notifications' },
  { icon: FileText, label: t('driver:dashboard'), screen: 'driver', path: '/driver' },
  { icon: Star, label: t('driver:dashboard'), screen: 'driver', path: '/driver' },
  { icon: MessageCircle, label: t('driver:dashboard'), screen: 'driver', path: '/driver' },
  { icon: Settings, label: t('driver:settings'), screen: 'driver-pending', path: '/driver-pending' },
];

const AnimatedMenuItem: React.FC<{ 
    item: ReturnType<typeof getMenuItems>[0], 
    index: number, 
    isActive: boolean, 
    onPress: (screen: string) => void 
}> = ({ item, index, isActive, onPress }) => {
    const pressed = useSharedValue(0);
    
    const animatedStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            pressed.value,
            [0, 1],
            [isActive ? 'rgba(212, 163, 115, 0.1)' : 'rgba(212, 163, 115, 0)', 'rgba(212, 163, 115, 0.25)']
        );
        return {
            transform: [
                { translateX: withSpring(pressed.value * 10, { damping: 15, stiffness: 100 }) },
                { scale: withSpring(1 - (pressed.value * 0.015)) }
            ],
            backgroundColor: bgColor,
            borderRadius: 16,
        };
    });

    return (
        <Animated.View 
            entering={FadeInDown.delay(index * 30 + 300).duration(500)}
        >
            <Animated.View style={animatedStyle}>
                <Pressable
                    onPressIn={() => (pressed.value = 1)}
                    onPressOut={() => (pressed.value = 0)}
                    onPress={() => onPress(item.screen)}
                    className="flex-row items-center py-2.5 px-4 justify-between"
                >
                    <View className="flex-row items-center">
                        <View className="w-6 h-6 items-center justify-center">
                            <item.icon size={19} color={isActive ? "#D4A373" : "#8C7A77"} strokeWidth={1.2} />
                        </View>
                        <Text className={`ml-6 font-poppins-medium text-[15px] tracking-tight ${isActive ? 'text-[#2C1B18]' : 'text-[#8C7A77]'}`}>
                            {item.label}
                        </Text>
                    </View>
                    {isActive && (
                        <Animated.View entering={FadeInRight} className="w-1.5 h-1.5 rounded-full bg-[#D4A373] mr-2" />
                    )}
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

export const DriverSidebarContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (screenName: string) => {
    try {
      (navigation as any).closeDrawer?.();
    } catch (e) {
      navigation.dispatch(DrawerActions.closeDrawer());
    }
    router.replace(`/${screenName}` as any);
  };

  return (
    <View className="flex-1 bg-[#FFFDFB]">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-20"
      >
        {/* DRIVER PROFILE HEADER (Minimalist) */}
        <Animated.View entering={FadeInDown.duration(800)} className="mb-8 px-4">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="relative">
                        <View className="w-16 h-16 rounded-full border border-[#D4A373]/30 p-1">
                            <View className="flex-1 rounded-full overflow-hidden bg-slate-50">
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </View>
                        </View>
                        <View className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </View>
                    <View className="ml-6">
                        <Text className="font-cairo-bold text-[#D4A373] text-[9px] tracking-[4px] uppercase mb-1 opacity-70">{t('driver:dashboard')}</Text>
                        <Text className="font-poppins-semibold text-xl text-[#2C1B18] tracking-tight">Michael Chang</Text>
                        <View className="flex-row items-center mt-1">
                            <Star size={10} color="#D4A373" />
                            <Text className="ml-1.5 font-cairo-medium text-[9px] text-[#8C7A77] tracking-widest uppercase">{t('driver:rating')}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="h-[1px] bg-[#D4A373]/10 my-5 ml-2 mr-6" />

            <View className="flex-row justify-between items-center px-2 pr-6">
                <View>
                    <Text className="font-cairo-medium text-[8px] text-[#8C7A77] uppercase tracking-widest">{t('driver:total_deliveries')}</Text>
                    <Text className="font-poppins-medium text-base text-[#2C1B18]">142</Text>
                </View>
                <View className="bg-[#D4A373]/10 px-3 py-1 rounded-xl">
                    <Text className="font-cairo-bold text-[9px] text-[#D4A373] tracking-widest">{t('driver:dashboard')}</Text>
                </View>
            </View>
        </Animated.View>

        {/* DUTY TOGGLE (Minimalist) */}
        <Animated.View entering={FadeInDown.delay(200)} className="mb-6 mx-2">
            <View className="px-5 py-4 flex-row items-center justify-between rounded-2xl bg-slate-50 border border-slate-100">
                <View className="flex-row items-center">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isOnline ? 'bg-green-500/10' : 'bg-slate-200/50'}`}>
                        <CircleDot size={16} color={isOnline ? '#4ADE80' : '#8E99A8'} strokeWidth={1.5} />
                    </View>
                    <View className="ml-4">
                        <Text className="font-poppins-medium text-xs text-[#2C1B18] uppercase tracking-widest">{isOnline ? t('driver:status_online') : t('driver:status_offline')}</Text>
                        <Text className="font-cairo-medium text-[9px] text-[#8C7A77] mt-0.5 tracking-wide">{isOnline ? t('driver:dashboard') : t('driver:dashboard')}</Text>
                    </View>
                </View>
                <Switch 
                    value={isOnline} 
                    onValueChange={setIsOnline} 
                    trackColor={{ false: '#F2EDE9', true: '#D4A373' }}
                    thumbColor="#FFFFFF"
                />
            </View>
        </Animated.View>

        {/* REFINED MENU items */}
        <View className="flex-1 gap-0.5">
            {getMenuItems(t).map((item, index) => (
                <AnimatedMenuItem 
                    key={index}
                    item={item}
                    index={index}
                    isActive={index === 0 ? true : pathname === item.path}
                    onPress={handleNavigation}
                />
            ))}
        </View>

        {/* BOTTOM SECTION */}
        <Animated.View entering={FadeInDown.delay(1000)} className="mt-16 pt-10 border-t border-[#F2EDE9] px-4">
            <TouchableOpacity className="flex-row items-center mb-10">
                <View className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 items-center justify-center">
                    <Globe size={14} color="#8C7A77" strokeWidth={1.5} />
                </View>
                <Text className="ml-4 font-cairo-bold text-[10px] text-[#8C7A77] uppercase tracking-widest">{t('profile:language')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                activeOpacity={0.8}
                className="items-center py-4 rounded-2xl border border-red-500/10 bg-red-50"
                onPress={() => {
                    try {
                        (navigation as any).closeDrawer?.();
                    } catch (e) {
                        navigation.dispatch(DrawerActions.closeDrawer());
                    }
                    router.replace('/' as any);
                }}
            >
                <Text className="font-poppins-bold text-red-400 tracking-[3px] uppercase text-[9px]">{t('profile:logout')}</Text>
            </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
