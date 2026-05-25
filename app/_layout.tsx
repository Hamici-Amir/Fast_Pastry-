import 'react-native-gesture-handler';
import "../global.css";
import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { 
  Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold 
} from '@expo-google-fonts/poppins';
import {
  Cairo_400Regular, Cairo_500Medium, Cairo_600SemiBold, Cairo_700Bold
} from '@expo-google-fonts/cairo';
import { SplashScreen as AppSplashScreen } from '../src/screens/SplashScreen';
import { OnboardingScreen } from '../src/screens/OnboardingScreen';
import { LoginScreen } from '../src/screens/LoginScreen';
import { RegisterScreen } from '../src/screens/RegisterScreen';
import { RoleSelectionScreen, AuthRole } from '../src/screens/RoleSelectionScreen';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { cssInterop } from 'react-native-css-interop';

cssInterop(BlurView, {
  className: 'style',
});

cssInterop(Image, {
  className: 'style',
});

import { Drawer } from 'expo-router/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { SidebarContent } from '../src/components/navigation/SidebarContent';
import { DriverSidebarContent } from '../src/components/navigation/DriverSidebarContent';
import { AdminSidebarContent } from '../src/components/navigation/AdminSidebarContent';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
    'Cairo-Regular': Cairo_400Regular,
    'Cairo-Medium': Cairo_500Medium,
    'Cairo-SemiBold': Cairo_600SemiBold,
    'Cairo-Bold': Cairo_700Bold
  });

  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);

  if (!fontsLoaded) return null;

  if (showSplash) {
    return <AppSplashScreen onFinish={() => {
        setShowSplash(false);
        setShowOnboarding(true);
    }} />;
  }

  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => {
        setShowOnboarding(false);
        setShowAuth(true);
    }} />;
  }

  if (showAuth) {
    if (!authRole) {
      return <RoleSelectionScreen onSelectRole={setAuthRole} />;
    }

    if (authMode === 'login') {
      return (
        <LoginScreen 
          onLogin={() => setShowAuth(false)} 
          onGoToRegister={() => setAuthMode('register')} 
          role={authRole}
          onSwitchRole={() => setAuthRole(null)}
        />
      );
    }
    return (
      <RegisterScreen 
        onRegister={() => setShowAuth(false)} 
        onGoToLogin={() => setAuthMode('login')} 
        role={authRole}
        onSwitchRole={() => setAuthRole(null)}
      />
    );
  }

  return (
    <>
      <Drawer
        initialRouteName={authRole === 'admin' ? 'admin' : (authRole === 'driver' ? 'driver' : '(tabs)')}
        drawerContent={(props) => {
          if (authRole === 'admin') return <AdminSidebarContent {...props} />;
          if (authRole === 'driver') return <DriverSidebarContent {...props} />;
          return <SidebarContent {...props} />;
        }}
        screenOptions={{
            headerShown: false,
            drawerType: 'slide',
            overlayColor: (authRole === 'driver' || authRole === 'admin') ? 'rgba(0, 0, 0, 0.8)' : 'rgba(61, 44, 41, 0.4)',
        }}
      >
        <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
        <Drawer.Screen name="admin" options={{ headerShown: false, title: 'Admin Hub' } as any} />
        <Drawer.Screen name="driver" options={{ headerShown: false, title: 'Driver Dashboard' } as any} />
        <Drawer.Screen name="driver-pending" options={{ headerShown: false, title: 'Pending Approval' } as any} />
        <Drawer.Screen name="driver-delivery" options={{ headerShown: false, title: 'Delivery Details' } as any} />
        <Drawer.Screen name="driver-notifications" options={{ headerShown: false, title: 'Driver Notifications' } as any} />
        <Drawer.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' } as any} />
        <Drawer.Screen name="checkout" options={{ headerShown: false, title: 'Checkout' } as any} />
        <Drawer.Screen name="tracking" options={{ headerShown: false, title: 'Delivery Tracking' } as any} />
        <Drawer.Screen name="chat" options={{ headerShown: false, title: 'Boutique Chat' } as any} />
      </Drawer>
      <StatusBar style="auto" />
    </>
  );
}
