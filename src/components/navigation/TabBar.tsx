import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const TAB_BAR_WIDTH = width - 40; // Horizontal margin of 20 on each side

export const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const visibleRoutes = state.routes.filter(route => {
    const options = descriptors[route.key].options as any;
    return options.href !== null;
  });

  const tabWidth = TAB_BAR_WIDTH / visibleRoutes.length;
  const indicatorPosition = useSharedValue(0);

  // Find the index of the currently focused visible route
  const foundIndex = visibleRoutes.findIndex(r => r.key === state.routes[state.index].key);
  const currentVisibleIndex = foundIndex >= 0 ? foundIndex : 0;

  useEffect(() => {
    indicatorPosition.value = withSpring(currentVisibleIndex * tabWidth, {
      damping: 20,
      stiffness: 150,
    });
  }, [state.index, currentVisibleIndex, tabWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <GlassBox intensity={60} style={styles.container} tint="light">
        {/* Sliding Indicator */}
        <Animated.View 
          style={[
            styles.indicator, 
            { width: tabWidth - 20 }, 
            animatedIndicatorStyle
          ]} 
        />

        {visibleRoutes.map((route) => {
          const options = descriptors[route.key].options as any;
          const isFocused = state.routes[state.index].key === route.key;

          const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={onPress}
              style={styles.tab}
            >
              <TabIcon 
                focused={isFocused} 
                icon={options.tabBarIcon}
                isSpecial={route.name === 'tracking'}
              />
            </TouchableOpacity>
          );
        })}
      </GlassBox>
    </View>
  );
};

const TabIcon = ({ focused, icon, isSpecial }: { focused: boolean; icon: any; isSpecial?: boolean }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : (isSpecial ? 1.1 : 1));
  }, [focused, isSpecial]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconColor = isSpecial 
    ? (focused ? theme.colors.primary : theme.colors.primary + 'AA') 
    : (focused ? theme.colors.primary : theme.colors.textMuted);

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
        {(focused || isSpecial) && <View style={[styles.glow, isSpecial && !focused && { opacity: 0.08 }]} />}
        {icon && icon({ 
            focused: focused, 
            color: iconColor, 
            size: isSpecial ? 28 : 24 
        })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
    shadowColor: theme.colors.primary,
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
    borderColor: 'rgba(255,255,255,0.4)',
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 26,
    marginHorizontal: 10,
    zIndex: 1,
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
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    filter: 'blur(8px)',
  }
});
