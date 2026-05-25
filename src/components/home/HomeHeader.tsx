import React from 'react';
import { AppHeader } from '../common/AppHeader';

export const HomeHeader: React.FC = () => {
  return (
    <AppHeader 
      title="Jane Cooper 👋"
      subtitle="Good Morning"
      showBell
      showAvatar
      hasNotifications
      avatarUri="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    />
  );
};
