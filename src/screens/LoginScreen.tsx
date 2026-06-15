import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthLayout, AuthRole } from '../components/auth/AuthLayout';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { SocialLogin } from '../components/auth/SocialLogin';
import { Mail, Lock, Phone } from 'lucide-react-native';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../components/ui/LanguagePicker';

interface LoginScreenProps {
  onLogin: () => void;
  onGoToRegister: () => void;
  role: AuthRole;
  onSwitchRole: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToRegister, role, onSwitchRole }) => {
  const { t } = useTranslation();
  const [usePhone, setUsePhone] = useState(false);

  const getTitles = () => {
    switch(role) {
      case 'driver': return { title: "Fleet Access", subtitle: "Log in to view your delivery routes and ambassador dashboard." };
      case 'admin': return { title: "Admin Portal", subtitle: "Secure login for platform orchestration and analytics." };
      case 'client':
      default: return { title: t('auth:welcome_back'), subtitle: "Experience the luxury of premium handcrafted pastries delivered to your door." };
    }
  };
  const { title, subtitle } = getTitles();

  const getButtonColor = () => {
    return theme.colors.primary;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: 50, right: 20, zIndex: 100 }}>
        <LanguagePicker compact />
      </View>
      <AuthLayout 
      title={title} 
      subtitle={subtitle}
      role={role}
      onSwitchRole={onSwitchRole}
    >
      <View className="gap-5">
        {usePhone ? (
          <TextInput 
            placeholder={t('auth:phone')} 
            keyboardType="phone-pad"
            leftIcon={<Phone size={20} color={theme.colors.secondary} />} 
          />
        ) : (
          <TextInput 
            placeholder={t('auth:email')} 
            autoCapitalize="none"
            keyboardType="email-address"
            leftIcon={<Mail size={20} color={theme.colors.secondary} />} 
          />
        )}

        <View>
          <TextInput 
            placeholder={t('auth:password')} 
            secureTextEntry
            leftIcon={<Lock size={20} color={theme.colors.secondary} />} 
          />
          <TouchableOpacity className="self-end mt-3">
            <Text className="font-poppins text-xs font-bold tracking-wide" style={{ color: getButtonColor() }}>
                {t('auth:forgot_password')}
            </Text>
          </TouchableOpacity>
        </View>

        <Button 
          title={t('auth:login')} 
          onPress={onLogin} 
          size="lg" 
          style={{ marginTop: 10, backgroundColor: getButtonColor(), borderColor: getButtonColor() }} 
        />

        <TouchableOpacity 
          onPress={() => setUsePhone(!usePhone)}
          className="items-center py-2"
        >
          <Text className="font-poppins text-sm text-[#8C7A77]">
            Use {usePhone ? t('auth:email') : t('auth:phone')} instead
          </Text>
        </TouchableOpacity>
      </View>

      {role === 'client' && <SocialLogin />}

      <View className="flex-row justify-center mt-12 mb-10">
        <Text className="font-poppins text-[#8C7A77]">{t('auth:dont_have_account')} </Text>
        <TouchableOpacity onPress={onGoToRegister}>
          <Text className="font-poppins-bold" style={{ color: getButtonColor() }}>{t('auth:register')}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
    </View>
  );
};
