import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Dimensions, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Cake, 
  Users, 
  Truck, 
  BarChart3, 
  DollarSign, 
  Tag, 
  Bell, 
  Star, 
  FileText, 
  Settings, 
  LogOut,
  ShieldCheck,
  ChevronRight,
  Layers,
  Heart,
  MessageSquare,
  Activity,
  Globe
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

const MENU_SECTIONS = [
  {
    title: 'OPERATIONS',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', screen: 'admin', path: '/admin' },
      { icon: ShoppingCart, label: 'Orders', screen: 'admin-orders', path: '/admin-orders' },
      { icon: Cake, label: 'Cakes', screen: 'admin-cakes', path: '/admin-cakes' },
      { icon: Layers, label: 'Categories', screen: 'admin', path: '/admin' },
    ]
  },
  {
    title: 'PARTNERS',
    items: [
      { icon: Users, label: 'Customers', screen: 'admin-customers', path: '/admin-customers' },
      { icon: Truck, label: 'Drivers', screen: 'admin-drivers', path: '/admin-drivers' },
    ]
  },
  {
    title: 'GROWTH',
    items: [
      { icon: BarChart3, label: 'Analytics', screen: 'admin', path: '/admin' },
      { icon: DollarSign, label: 'Revenue', screen: 'admin', path: '/admin' },
      { icon: Tag, label: 'Promotions', screen: 'admin', path: '/admin' },
    ]
  },
  {
    title: 'ENGAGEMENT',
    items: [
      { icon: Bell, label: 'Notifications', screen: 'admin-notifications', path: '/admin-notifications', badge: '3' },
      { icon: Heart, label: 'Reviews', screen: 'admin', path: '/admin' },
      { icon: MessageSquare, label: 'Support', screen: 'admin', path: '/admin' },
    ]
  },
  {
    title: 'SYSTEM',
    items: [
      { icon: FileText, label: 'Reports', screen: 'admin', path: '/admin' },
      { icon: Settings, label: 'Settings', screen: 'admin-settings', path: '/admin-settings' },
    ]
  }
];

const AnimatedMenuItem: React.FC<{ 
    item: typeof MENU_SECTIONS[0]['items'][0], 
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
            entering={FadeInDown.delay(index * 20 + 300).duration(400)}
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
                    <View className="flex-row items-center">
                        {item.badge && (
                            <View className="bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-xl mr-3">
                                <Text className="font-cairo-bold text-[9px] text-[#D4A373] tracking-widest">{item.badge}</Text>
                            </View>
                        )}
                        {isActive && (
                            <Animated.View entering={FadeInRight} className="w-1.5 h-1.5 rounded-full bg-[#D4A373] mr-2" />
                        )}
                    </View>
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

export const AdminSidebarContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const [isSystemActive, setIsSystemActive] = useState(true);
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
        {/* HQ PROFILE HEADER (Minimalist) */}
        <Animated.View entering={FadeInDown.duration(800)} className="mb-8 px-4">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <View className="relative">
                        <View className="w-16 h-16 rounded-full border border-[#D4A373]/30 p-1">
                            <View className="flex-1 rounded-full overflow-hidden bg-slate-50">
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </View>
                        </View>
                        <View className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${isSystemActive ? 'bg-green-500' : 'bg-red-400'}`} />
                    </View>
                    <View className="ml-6">
                        <Text className="font-cairo-bold text-[#D4A373] text-[9px] tracking-[4px] uppercase mb-1 opacity-70">Super Admin</Text>
                        <Text className="font-poppins-semibold text-xl text-[#2C1B18] tracking-tight">Elena Rostova</Text>
                        <View className="flex-row items-center mt-1">
                            <ShieldCheck size={12} color="#D4A373" strokeWidth={1.5} />
                            <Text className="ml-1.5 font-cairo-medium text-[9px] text-[#8C7A77] tracking-widest uppercase">HQ PORTAL</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="h-[1px] bg-[#D4A373]/10 my-5 ml-2 mr-6" />

            <View className="flex-row justify-between items-center px-2 pr-6">
                <View>
                    <Text className="font-cairo-medium text-[8px] text-[#8C7A77] uppercase tracking-widest">Revenue Today</Text>
                    <Text className="font-poppins-medium text-base text-[#2C1B18]">$12,450</Text>
                </View>
                <View className="bg-[#D4A373]/10 px-3 py-1 rounded-xl">
                    <Text className="font-cairo-bold text-[9px] text-[#D4A373] tracking-widest">842 ORDERS</Text>
                </View>
            </View>
        </Animated.View>

        {/* SYSTEM TOGGLE (Minimalist) */}
        <Animated.View entering={FadeInDown.delay(200)} className="mb-6 mx-2">
            <View className="px-5 py-4 flex-row items-center justify-between rounded-2xl bg-slate-50 border border-slate-100">
                <View className="flex-row items-center">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isSystemActive ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <Activity size={16} color={isSystemActive ? '#4ADE80' : '#EF4444'} strokeWidth={1.5} />
                    </View>
                    <View className="ml-4">
                        <Text className="font-poppins-medium text-xs text-[#2C1B18] uppercase tracking-widest">{isSystemActive ? 'System Active' : 'Maintenance'}</Text>
                        <Text className="font-cairo-medium text-[9px] text-[#8C7A77] mt-0.5 tracking-wide">{isSystemActive ? 'All services operational' : 'Accepting APIs blocked'}</Text>
                    </View>
                </View>
                <Switch 
                    value={isSystemActive} 
                    onValueChange={setIsSystemActive} 
                    trackColor={{ false: '#F2EDE9', true: '#D4A373' }}
                    thumbColor="#FFFFFF"
                />
            </View>
        </Animated.View>

        {/* SECTIONS MENU items */}
        <View className="flex-1 pb-4">
            {MENU_SECTIONS.map((section, sIndex) => (
                <View key={sIndex} className="mb-6">
                    <Text className="font-cairo-bold text-[9px] text-[#8C7A77]/60 tracking-[4px] uppercase ml-6 mb-2">
                        {section.title}
                    </Text>
                    <View className="gap-0.5">
                        {section.items.map((item, index) => (
                            <AnimatedMenuItem 
                                key={index}
                                item={item}
                                index={sIndex * 10 + index}
                                isActive={item.screen === 'admin' ? (index === 0 && sIndex === 0 ? true : false) : pathname.includes(item.screen)}
                                onPress={handleNavigation}
                            />
                        ))}
                    </View>
                </View>
            ))}
        </View>

        {/* BOTTOM SECTION */}
        <Animated.View entering={FadeInDown.delay(1000)} className="mt-8 pt-10 border-t border-[#F2EDE9] px-4">
            <TouchableOpacity className="flex-row items-center mb-10">
                <View className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 items-center justify-center">
                    <Globe size={14} color="#8C7A77" strokeWidth={1.5} />
                </View>
                <Text className="ml-4 font-cairo-bold text-[10px] text-[#8C7A77] uppercase tracking-widest">Global Ops (NY)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                activeOpacity={0.8}
                className="items-center py-4 rounded-2xl border border-[#D4A373]/10 bg-white"
                onPress={() => {
                    try {
                        (navigation as any).closeDrawer?.();
                    } catch (e) {
                        navigation.dispatch(DrawerActions.closeDrawer());
                    }
                    router.replace('/' as any);
                }}
            >
                <Text className="font-poppins-bold text-[#D4A373] tracking-[3px] uppercase text-[9px]">End Session</Text>
            </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
