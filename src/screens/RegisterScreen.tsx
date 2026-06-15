import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthLayout, AuthRole } from '../components/auth/AuthLayout';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { SocialLogin } from '../components/auth/SocialLogin';
import { Mail, Lock, User, Phone } from 'lucide-react-native';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../components/ui/LanguagePicker';

interface RegisterScreenProps {
  onRegister: () => void;
  onGoToLogin: () => void;
  role: AuthRole;
  onSwitchRole: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onGoToLogin, role, onSwitchRole }) => {
  const { t } = useTranslation();

  const getTitles = () => {
    switch(role) {
      case 'driver': return { title: "Join the Fleet", subtitle: "Become an elite pastry ambassador and earn by delivering luxury." };
      case 'admin': return { title: "System Registration", subtitle: "Apply for management access to orchestrate the global ecosystem." };
      case 'client':
      default: return { title: t('auth:register'), subtitle: "Join the exclusive Fast Pastry club and start personalizing your dream cakes." };
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
        <TextInput 
          placeholder={t('auth:full_name')} 
          leftIcon={<User size={20} color={theme.colors.secondary} />} 
        />
        
        <TextInput 
          placeholder={t('auth:email')} 
          autoCapitalize="none"
          keyboardType="email-address"
          leftIcon={<Mail size={20} color={theme.colors.secondary} />} 
        />

        <TextInput 
          placeholder={t('auth:phone')} 
          keyboardType="phone-pad"
          leftIcon={<Phone size={20} color={theme.colors.secondary} />} 
        />

        <TextInput 
          placeholder={t('auth:password')} 
          secureTextEntry
          leftIcon={<Lock size={20} color={theme.colors.secondary} />} 
        />

        <Button 
          title={t('auth:register')} 
          onPress={onRegister} 
          size="lg" 
          style={{ marginTop: 10, backgroundColor: getButtonColor(), borderColor: getButtonColor() }} 
        />
      </View>

      {role === 'client' && <SocialLogin />}

      <View className="flex-row justify-center mt-12 mb-10">
        <Text className="font-poppins text-[#8C7A77]">{t('auth:already_have_account')} </Text>
        <TouchableOpacity onPress={onGoToLogin}>
          <Text className="font-poppins-bold" style={{ color: getButtonColor() }}>{t('auth:login')}</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
    </View>
  );
};
