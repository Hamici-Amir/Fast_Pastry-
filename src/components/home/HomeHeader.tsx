import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '../common/AppHeader';
import { LanguagePicker } from '../ui/LanguagePicker';

export const HomeHeader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AppHeader 
      title={t('home:welcome_title')}
      subtitle={t('home:welcome_subtitle')}
      showBell
      showAvatar
      hasNotifications
      avatarUri="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
      rightContent={<LanguagePicker compact />}
    />
  );
};
