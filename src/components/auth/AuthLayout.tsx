import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Cake, Truck, ShieldCheck, ArrowLeft } from 'lucide-react-native';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';
import Animated, { FadeInDown } from 'react-native-reanimated';

export type AuthRole = 'client' | 'driver' | 'admin';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  role: AuthRole;
  onSwitchRole?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, role, onSwitchRole }) => {
  const insets = useSafeAreaInsets();

  // Unified Luxury Bakery Theme Generation
  const getRoleTheme = () => {
    const baseTheme = {
      gradient: [theme.colors.background, theme.colors.primaryLight, theme.colors.rosePastel] as readonly [string, string, string],
      textColor: '#2C1B18',
      subtitleColor: '#8C7A77',
      iconColor: theme.colors.primary,
      iconBg: 'rgba(255, 255, 255, 0.3)',
    };

    switch(role) {
      case 'driver':
        return {
          ...baseTheme,
          IconComponent: Truck,
          systemName: 'AMBASSADOR FLEET'
        };
      case 'admin':
        return {
          ...baseTheme,
          IconComponent: ShieldCheck,
          systemName: 'MANAGEMENT HQ'
        };
      case 'client':
      default:
        return {
          ...baseTheme,
          IconComponent: Cake,
          systemName: 'FAST PASTRY'
        };
    }
  };

  const currentTheme = getRoleTheme();
  const Icon = currentTheme.IconComponent;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={currentTheme.gradient}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Soft Ambient Glow Elements */}
      <View pointerEvents="none" style={[styles.ambientGlow, { top: -100, left: -50, backgroundColor: '#FFFFFF', opacity: 0.2 }]} />
      <View pointerEvents="none" style={[styles.ambientGlow, { bottom: -100, right: -50, backgroundColor: '#F8B6C8', opacity: 0.1 }]} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingTop: Math.max(insets.top + 10, 40), 
            paddingBottom: Math.max(insets.bottom + 20, 40),
            paddingHorizontal: 28,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Actor Switcher */}
          {onSwitchRole && (
            <Animated.View entering={FadeInDown.duration(400)}>
              <TouchableOpacity onPress={onSwitchRole} style={styles.switcherButton}>
                <ArrowLeft size={16} color={currentTheme.subtitleColor} />
                <Text style={[styles.switcherText, { color: currentTheme.subtitleColor }]}>Switch Actor</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Logo Section */}
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.logoSection}>
            <GlassBox intensity={30} style={[styles.logoWrapper, { backgroundColor: currentTheme.iconBg }]}>
              <Icon size={44} color={currentTheme.iconColor} strokeWidth={1.5} />
            </GlassBox>
            <Text style={[styles.logoTitle, { color: currentTheme.textColor }]}>
              {currentTheme.systemName}
            </Text>
            <View style={[styles.logoDivider, { backgroundColor: currentTheme.iconColor }]} />
          </Animated.View>

          {/* Form Section */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={{ flex: 1, width: '100%' }}>
            <Text style={[styles.formTitle, { color: currentTheme.textColor }]}>
              {title}
            </Text>
            <Text style={[styles.formSubtitle, { color: currentTheme.subtitleColor }]}>
              {subtitle}
            </Text>
            
            {children}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  switcherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
    paddingRight: 12,
  },
  switcherText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 6,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 35,
    width: '100%',
  },
  logoWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1.5,
  },
  logoTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginTop: 14,
    letterSpacing: 6,
    textAlign: 'center',
  },
  logoDivider: {
    height: 1.5,
    width: 40,
    marginTop: 12,
    opacity: 0.5,
  },
  formTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  formSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 22,
  },
});
