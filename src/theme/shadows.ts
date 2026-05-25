import { Platform, ViewStyle } from 'react-native';
import { colors } from './colors';

export const shadows = {
  sm: Platform.select({
    ios: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    }
  }) as ViewStyle,
  md: Platform.select({
    ios: {
      shadowColor: colors.primaryLight,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    android: {
      elevation: 6,
    },
    default: {
      shadowColor: colors.primaryLight,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    }
  }) as ViewStyle,
  lg: Platform.select({
    ios: {
      shadowColor: '#C48BA0', // Slightly deeper pink shadow for large elements
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
    },
    android: {
      elevation: 12,
    },
    default: {
      shadowColor: '#C48BA0',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
    }
  }) as ViewStyle,
};
