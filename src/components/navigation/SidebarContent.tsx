import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch, Dimensions, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Home, 
  ShoppingBag, 
  Palette, 
  Heart, 
  Calendar, 
  Bell, 
  Truck, 
  MessageCircle, 
  Settings, 
  LogOut,
  Moon,
  Globe,
  Star,
  Sparkles,
  ChevronRight,
  BookOpen,
  User
} from 'lucide-react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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

const MENU_ITEMS = [
  { icon: Home, label: 'Collection', screen: 'index', path: '/(tabs)' },
  { icon: BookOpen, label: 'Catalogue', screen: 'catalogue', path: '/(tabs)/catalogue' },
  { icon: Palette, label: 'Customizer', screen: 'customizer', path: '/(tabs)/customizer' },
  { icon: ShoppingBag, label: 'Orders', screen: 'orders', path: '/(tabs)/cart' },
  { icon: Heart, label: 'Favorites', screen: 'saved', path: '/(tabs)/catalogue' },
  { icon: Calendar, label: 'Occasions', screen: 'calendar', path: '/(tabs)/calendar' },
  { icon: Truck, label: 'Tracking', screen: 'tracking', path: '/tracking' },
  { icon: Bell, label: 'Notifications', screen: 'notifications', path: '/notifications' },
  { icon: MessageCircle, label: 'Concierge', screen: 'support', path: '/chat' },
  { icon: Settings, label: 'Settings', screen: 'settings', path: '/settings' },
];

const AnimatedMenuItem: React.FC<{ 
    item: typeof MENU_ITEMS[0], 
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

export const SidebarContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (screen: string) => {
    try {
      (navigation as any).closeDrawer?.();
    } catch (e) {
      navigation.dispatch(DrawerActions.closeDrawer());
    }
    switch(screen) {
        case 'index': router.push('/(tabs)' as any); break;
        case 'catalogue': router.push('/(tabs)/catalogue' as any); break;
        case 'customizer': router.push('/(tabs)/customizer' as any); break;
        case 'orders': router.push('/(tabs)/cart' as any); break;
        case 'tracking': router.push('/tracking' as any); break;
        case 'support': router.push('/chat' as any); break;
        case 'saved': router.push('/(tabs)/catalogue' as any); break;
        case 'notifications': router.push('/(tabs)' as any); break;
        case 'settings': router.push('/(tabs)/profile' as any); break;
        default: router.push('/(tabs)' as any);
    }
  };

  return (
    <View className="flex-1 bg-[#FFFDFB]">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-20"
      >
        {/* HEADER SECTION */}
        <Animated.View entering={FadeInDown.duration(800)} className="mb-10 px-4">
            <View className="flex-row items-center">
                <View className="w-16 h-16 rounded-full border border-[#D4A373]/30 p-1">
                    <View className="flex-1 rounded-full overflow-hidden bg-slate-50">
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </View>
                </View>
                <View className="ml-6">
                    <Text className="font-cairo-bold text-[#D4A373] text-[9px] tracking-[4px] uppercase mb-1 opacity-70">Privée Member</Text>
                    <Text className="font-poppins-semibold text-xl text-[#2C1B18] tracking-tight">Jane Cooper</Text>
                    <Text className="font-cairo-medium text-[9px] text-[#8C7A77] tracking-widest mt-1">2,450 POINTS</Text>
                </View>
            </View>
        </Animated.View>

        {/* REFINED MENU */}
        <View className="flex-1 gap-0.5">
            {MENU_ITEMS.map((item, index) => (
                <AnimatedMenuItem 
                    key={index}
                    item={item}
                    index={index}
                    isActive={pathname === item.path}
                    onPress={handleNavigation}
                />
            ))}
        </View>

        {/* CLEAN FOOTER */}
        <Animated.View entering={FadeInDown.delay(1000)} className="mt-16 pt-10 border-t border-[#F2EDE9] px-4">
            <View className="flex-row items-center justify-between mb-10">
                <Text className="font-cairo-bold text-[10px] text-[#8C7A77] uppercase tracking-widest">Midnight Mode</Text>
                <Switch 
                    value={isDarkMode} 
                    onValueChange={setIsDarkMode} 
                    trackColor={{ false: '#F2EDE9', true: '#FCCECC' }}
                    thumbColor="#FFFFFF"
                />
            </View>

            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => {
                    try {
                        (navigation as any).closeDrawer?.();
                    } catch (e) {
                        navigation.dispatch(DrawerActions.closeDrawer());
                    }
                    router.replace('/' as any);
                }}
                className="items-center py-4 rounded-2xl border border-[#D4A373]/10 bg-white shadow-sm shadow-[#D4A373]/5"
            >
                <Text className="font-poppins-bold text-[#D4A373] tracking-[3px] uppercase text-[9px]">Sign Out</Text>
            </TouchableOpacity>
            
            <View className="mt-10 items-center">
               <Text className="font-cairo-medium text-[8px] text-[#8C7A77]/30 tracking-[6px] uppercase">Fast Pastry • Edition 2026</Text>
            </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};
