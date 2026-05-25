import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LayoutDashboard, Package, Truck, Users, Settings } from 'lucide-react-native';
import Animated, { 
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';
import { GlassBox } from '../ui/GlassBox';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = Math.min(width - 40, 420);

const TABS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dash' },
  { id: 'orders', icon: Package, label: 'Orders' },
  { id: 'fleet', icon: Truck, label: 'Fleet' },
  { id: 'customers', icon: Users, label: 'Users' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

interface AdminTabBarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const AdminTabBar: React.FC<AdminTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabWidth = TAB_BAR_WIDTH / TABS.length;
  const indicatorPosition = useSharedValue(0);
  
  const currentVisibleIndex = TABS.findIndex(t => t.id === activeTab);
  const safeIndex = currentVisibleIndex >= 0 ? currentVisibleIndex : 0;

  useEffect(() => {
    indicatorPosition.value = withSpring(safeIndex * tabWidth, {
      damping: 20,
      stiffness: 150,
    });
  }, [activeTab, safeIndex, tabWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.wrapper}>
      <GlassBox intensity={60} style={styles.container} tint="light">
        <Animated.View 
          style={[
            styles.indicator, 
            { width: tabWidth - 20 }, 
            animatedIndicatorStyle
          ]} 
        />
        {TABS.map((tab) => {
          const isFocused = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onTabChange(tab.id);
              }}
              style={styles.tab}
            >
              <TabIcon focused={isFocused} icon={tab.icon} />
            </TouchableOpacity>
          );
        })}
      </GlassBox>
    </Animated.View>
  );
};

const TabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = focused ? "#D4A373" : "#8E99A8";

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {focused && <View style={styles.glow} />}
        {icon && React.createElement(icon, { color: iconColor, size: 24, strokeWidth: focused ? 2 : 1.5 })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    zIndex: 50,
    shadowColor: "#D4A373",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 20,
  },
  container: {
    flexDirection: 'row',
    width: TAB_BAR_WIDTH,
    height: 72,
    borderRadius: 36,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(212, 163, 115, 0.15)',
    backgroundColor: 'rgba(255,255,255,0.85)'
  },
  tab: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  indicator: {
    position: 'absolute',
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    marginHorizontal: 10,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D4A373",
    opacity: 0.15,
  }
});
