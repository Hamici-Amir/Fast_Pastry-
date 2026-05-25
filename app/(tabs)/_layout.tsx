import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../src/components/navigation/TabBar';
import { Home, LayoutGrid, Palette, ShoppingBag, User, MapPin } from 'lucide-react-native';
import { theme } from '../../src/theme';

export default function TabLayout() {
  // TODO: Connect this to actual order state from context/global store
  const hasActiveOrder = true;

  return (
    <Tabs 
        tabBar={(props) => <TabBar {...props} />} 
        screenOptions={{ 
            headerShown: false,
            tabBarShowLabel: false,
        }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: 'Catalogue',
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="customizer"
        options={{
          title: 'Customizer',
          tabBarIcon: ({ color, size }) => <Palette color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: 'Tracking',
          href: hasActiveOrder ? undefined : null,
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
