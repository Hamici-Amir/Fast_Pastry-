import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { DriverTabBar } from '../src/components/navigation/DriverTabBar';
import { DriverDashboardView } from '../src/screens/driver/DriverDashboardView';
import { DriverOrdersView } from '../src/screens/driver/DriverOrdersView';
import { DriverEarningsView } from '../src/screens/driver/DriverEarningsView';
import { DriverNavigationView } from '../src/screens/driver/DriverNavigationView';
import { DriverProfileView } from '../src/screens/driver/DriverProfileView';
import { Bell, Menu } from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';

export default function DriverDashboardScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hasNotifications, setHasNotifications] = useState(true);

  const renderContent = () => {
    switch(activeTab) {
      case 'orders':
        return <DriverOrdersView />;
      case 'navigation':
        return <DriverNavigationView />;
      case 'earnings':
        return <DriverEarningsView />;
      case 'profile':
        return <DriverProfileView />;
      case 'dashboard':
      default:
        return <DriverDashboardView />;
    }
  };

  const getHeaderDetails = () => {
    switch(activeTab) {
      case 'orders':
        return { subtitle: t('driver:active_delivery'), title: 'Fast Pastry' };
      case 'navigation':
        return { subtitle: t('driver:navigation'), title: 'Fragile Transit' };
      case 'earnings':
        return { subtitle: t('driver:earnings'), title: t('driver:earnings') };
      case 'profile':
        return { subtitle: t('driver:profile'), title: t('driver:profile') };
      case 'dashboard':
      default:
        return { subtitle: 'Welcome back,', title: 'Michael' };
    }
  };

  const headerMeta = getHeaderDetails();

  return (
    <View className="flex-1 bg-background">
      <AppHeader 
        title={headerMeta.title} 
        subtitle={headerMeta.subtitle} 
        showBell 
        hasNotifications={hasNotifications}
        onBellPress={() => {
          setHasNotifications(false);
          router.push('/driver-notifications');
        }}
      />

      <View className="flex-1">
        {renderContent()}
      </View>

      {/* FLOATING TAB BAR */}
      <DriverTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
