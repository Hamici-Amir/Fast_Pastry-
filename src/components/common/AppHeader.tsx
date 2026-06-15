import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Menu, Search, Bell, ArrowLeft } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Path, Defs, Pattern, Rect } from 'react-native-svg';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  rightContent?: React.ReactNode;
  showAvatar?: boolean;
  avatarUri?: string;
  onSearchChange?: (text: string) => void;
  showBell?: boolean;
  hasNotifications?: boolean;
  onBellPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
  leftContent?: React.ReactNode;
  transparent?: boolean;
  noBorder?: boolean;
}

const HeaderPattern = () => (
  <View style={StyleSheet.absoluteFill} className="opacity-[0.03]">
    <Svg width="100%" height="100%">
      <Defs>
        <Pattern
          id="headerPattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          viewBox="0 0 40 40"
        >
          <Path
            d="M0 40L40 0M-10 10L10 -10M30 50L50 30"
            stroke="#D4A373"
            strokeWidth="1"
            fill="none"
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#headerPattern)" />
    </Svg>
  </View>
);

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBackPress,
  showSearch,
  searchPlaceholder,
  rightContent,
  showAvatar,
  avatarUri,
  onSearchChange,
  showBell,
  hasNotifications,
  onBellPress,
  leftContent,
  transparent,
  noBorder
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const placeholder = searchPlaceholder || t('common:search');

  return (
    <Animated.View entering={FadeIn.duration(600)} style={{ zIndex: 50 }}>
      <BlurView 
        intensity={transparent ? 0 : 95} 
        tint="light" 
        style={{ 
          paddingTop: Math.max(insets.top, 20),
          backgroundColor: transparent ? 'transparent' : undefined
        }} 
        className={`${noBorder ? '' : 'border-b border-[#D4A373]/20'} overflow-hidden`}
      >
        {!transparent && <HeaderPattern />}
        
        <View className="flex-row items-center justify-between px-6 pb-5">
          {/* LEFT: Custom Content, Back or Menu Button */}
          <View className="z-10">
            {leftContent ? (
              leftContent
            ) : showBack ? (
              <TouchableOpacity 
                onPress={onBackPress || (() => navigation.goBack())} 
                className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm"
              >
                <ArrowLeft size={22} color="#2C1B18" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
                className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm"
              >
                <Menu size={22} color="#2C1B18" />
              </TouchableOpacity>
            )}
          </View>

          {/* CENTER: Title/Subtitle or Search */}
          <View className="flex-1 px-4">
            {showSearch ? (
              <Animated.View 
                entering={FadeInDown.delay(100)}
                className="flex-row items-center h-11 bg-white/60 rounded-2xl px-4 border border-[#D4A373]/20"
              >
                <Search size={18} color="#8C7A77" />
                <TextInput 
                  placeholder={placeholder} 
                  placeholderTextColor="#A18E8B"
                  className="flex-1 ml-3 text-[#2C1B18] font-poppins text-[14px]"
                  onChangeText={onSearchChange}
                />
              </Animated.View>
            ) : (
              <View className="items-center">
                {subtitle && (
                  <Animated.Text 
                    entering={FadeInDown.delay(100)}
                    className="font-cairo-medium text-[#8C7A77] text-[10px] uppercase tracking-[2px] mb-0.5"
                  >
                    {subtitle}
                  </Animated.Text>
                )}
                {title && (
                  <Animated.Text 
                    entering={FadeInDown.delay(200)}
                    className="font-poppins-bold text-[19px] text-[#2C1B18] leading-tight" 
                    numberOfLines={1}
                  >
                    {title}
                  </Animated.Text>
                )}
              </View>
            )}
          </View>

          {/* RIGHT: Dynamic Content */}
          <View className="flex-row items-center z-10">
            {rightContent}
            
            {showBell && (
              <TouchableOpacity 
                onPress={onBellPress}
                className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm relative"
              >
                <Bell size={22} color="#2C1B18" />
                {hasNotifications && (
                  <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#D4A373] rounded-full border-2 border-white" />
                )}
              </TouchableOpacity>
            )}

            {showAvatar && (
              <View className="ml-3 w-11 h-11 rounded-2xl overflow-hidden border border-[#D4A373]/30 shadow-sm p-0.5 bg-white">
                <View className="flex-1 rounded-[14px] overflow-hidden bg-slate-100">
                  <Image 
                    source={{ uri: avatarUri || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
};
