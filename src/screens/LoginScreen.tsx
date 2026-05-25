import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthLayout, AuthRole } from '../components/auth/AuthLayout';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { SocialLogin } from '../components/auth/SocialLogin';
import { Mail, Lock, Phone } from 'lucide-react-native';
import { theme } from '../theme';

interface LoginScreenProps {
  onLogin: () => void;
  onGoToRegister: () => void;
  role: AuthRole;
  onSwitchRole: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToRegister, role, onSwitchRole }) => {
  const [usePhone, setUsePhone] = useState(false);

  const getTitles = () => {
    switch(role) {
      case 'driver': return { title: "Fleet Access", subtitle: "Log in to view your delivery routes and ambassador dashboard." };
      case 'admin': return { title: "Admin Portal", subtitle: "Secure login for platform orchestration and analytics." };
      case 'client':
      default: return { title: "Welcome Back", subtitle: "Experience the luxury of premium handcrafted pastries delivered to your door." };
    }
  };
  const { title, subtitle } = getTitles();

  const getButtonColor = () => {
    return theme.colors.primary;
  };

  return (
    <AuthLayout 
      title={title} 
      subtitle={subtitle}
      role={role}
      onSwitchRole={onSwitchRole}
    >
      <View className="gap-5">
        {usePhone ? (
          <TextInput 
            placeholder="Phone Number" 
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={theme.colors.secondary} />} 
          />
        ) : (
          <TextInput 
            placeholder="Email Address" 
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Mail size={20} color={theme.colors.secondary} />} 
          />
        )}

        <View>
          <TextInput 
            placeholder="Password" 
            secureTextEntry
            leftIcon={<Lock size={20} color={theme.colors.secondary} />} 
          />
          <TouchableOpacity className="self-end mt-3">
            <Text className="font-poppins text-xs font-bold tracking-wide" style={{ color: getButtonColor() }}>
                Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <Button 
          title="Login" 
          onPress={onLogin} 
          size="lg" 
          style={{ marginTop: 10, backgroundColor: getButtonColor(), borderColor: getButtonColor() }} 
        />

        <TouchableOpacity 
          onPress={() => setUsePhone(!usePhone)}
          className="items-center py-2"
        >
          <Text className="font-poppins text-sm text-[#8C7A77]">
            Use {usePhone ? 'Email' : 'Phone'} instead
          </Text>
        </TouchableOpacity>
      </View>

      {role === 'client' && <SocialLogin />}

      <View className="flex-row justify-center mt-12 mb-10">
        <Text className="font-poppins text-[#8C7A77]">Don’t have an account? </Text>
        <TouchableOpacity onPress={onGoToRegister}>
          <Text className="font-poppins-bold" style={{ color: getButtonColor() }}>Register</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};
