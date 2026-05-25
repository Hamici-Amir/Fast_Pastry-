import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ChevronLeft, Menu } from 'lucide-react-native';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showMenu?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  glass?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  showMenu,
  rightAction,
  transparent,
  glass,
  style,
}) => {
  const navigation = useNavigation();

  const content = (
    <View style={[styles.container, transparent && styles.transparent, style]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        {showMenu && !onBack && (
          <TouchableOpacity 
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())} 
            style={styles.backButton}
          >
            <Menu size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.center}>
        {title && <Text style={[theme.typography.h3 as any, styles.title]}>{title}</Text>}
      </View>
      
      <View style={styles.right}>
        {rightAction}
      </View>
    </View>
  );

  if (glass) {
    return <GlassBox intensity={80} style={{ borderRadius: 0, padding: 0, borderWidth: 0 }}>{content}</GlassBox>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    height: 60,
    backgroundColor: theme.colors.background,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
  },
  center: {
    flex: 2,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: theme.colors.text,
  },
  backButton: {
    padding: theme.spacing.xs,
  }
});
