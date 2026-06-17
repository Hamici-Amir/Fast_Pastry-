import React from 'react';
import { Tabs } from 'expo-router';
import { TabBar } from '../../src/components/navigation/TabBar';
import { Home, LayoutGrid, Palette, ShoppingBag, User, MapPin } from 'lucide-react-native';
import { theme } from '../../src/theme';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

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
          title: t('common:tab_home'),
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: t('common:tab_catalogue'),
          tabBarIcon: ({ color, size }) => <LayoutGrid color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="customizer"
        options={{
          title: t('common:tab_customizer'),
          tabBarIcon: ({ color, size }) => <Palette color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: t('common:tab_cart'),
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('common:tab_profile'),
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tracking"
        options={{
          title: t('common:tab_tracking'),
          href: hasActiveOrder ? undefined : null,
          tabBarIcon: ({ color, size }) => <MapPin color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
