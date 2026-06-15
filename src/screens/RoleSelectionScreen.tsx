import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Cake, Truck, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react-native';
import { GlassBox } from '../components/ui/GlassBox';
import { theme } from '../theme';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../components/ui/LanguagePicker';

const { width } = Dimensions.get('window');

export type AuthRole = 'client' | 'driver' | 'admin';

interface RoleSelectionScreenProps {
  onSelectRole: (role: AuthRole) => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Soft Pastel Immersive Background */}
      <LinearGradient
        colors={['#FFF8F2', '#FDF5EC', '#FAF0E6']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Cinematic Ambient Glows */}
      <View pointerEvents="none" style={[styles.ambientGlow, { top: -100, left: -100, backgroundColor: 'rgba(255, 255, 255, 0.8)' }]} />
      <View pointerEvents="none" style={[styles.ambientGlow, { bottom: -100, right: -100, backgroundColor: 'rgba(212, 163, 115, 0.15)' }]} />

      <ScrollView 
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 50, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(800).delay(100)} style={styles.header}>
          <View style={styles.badgeWrapper}>
            <Sparkles size={14} color={theme.colors.secondary} />
            <Text style={styles.badgeText}>AUTHENTICATION</Text>
          </View>
          <Text style={styles.title}>{t('auth:role_selection')}</Text>
          <Text style={styles.subtitle}>Select an access level to enter the Fast Pastry digital ecosystem.</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {/* CLIENT CARD */}
          <Animated.View entering={FadeInRight.duration(800).delay(200)}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onSelectRole('client')}>
              <GlassBox intensity={60} style={styles.cardGlass} tint="light">
                <View style={styles.cardInner}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(248, 182, 200, 0.2)' }]}>
                    <Cake size={28} color={theme.colors.primary} strokeWidth={1.5} />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardTitle}>{t('auth:role_customer')}</Text>
                  </View>
                  <View style={styles.arrowBox}>
                    <ChevronRight size={20} color={theme.colors.secondary} />
                  </View>
                </View>
              </GlassBox>
            </TouchableOpacity>
          </Animated.View>

          {/* DRIVER CARD */}
          <Animated.View entering={FadeInRight.duration(800).delay(350)}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onSelectRole('driver')}>
              <GlassBox intensity={60} style={styles.cardGlass} tint="light">
                <View style={styles.cardInner}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(212, 163, 115, 0.15)' }]}>
                    <Truck size={28} color={theme.colors.secondary} strokeWidth={1.5} />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardTitle}>{t('auth:role_driver')}</Text>
                  </View>
                  <View style={styles.arrowBox}>
                    <ChevronRight size={20} color={theme.colors.secondary} />
                  </View>
                </View>
              </GlassBox>
            </TouchableOpacity>
          </Animated.View>

          {/* ADMIN CARD */}
          <Animated.View entering={FadeInRight.duration(800).delay(500)}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => onSelectRole('admin')}>
              <GlassBox intensity={60} style={styles.cardGlass} tint="light">
                <View style={styles.cardInner}>
                  <View style={[styles.iconBox, { backgroundColor: 'rgba(140, 122, 119, 0.1)' }]}>
                    <ShieldCheck size={28} color="#8C7A77" strokeWidth={1.5} />
                  </View>
                  <View style={styles.cardTextContent}>
                    <Text style={styles.cardTitle}>{t('auth:role_admin')}</Text>
                  </View>
                  <View style={styles.arrowBox}>
                    <ChevronRight size={20} color={theme.colors.secondary} />
                  </View>
                </View>
              </GlassBox>
            </TouchableOpacity>
          </Animated.View>
        </View>

      </ScrollView>

      <View style={{ position: 'absolute', top: 50, right: 20, zIndex: 100 }}>
        <LanguagePicker compact />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  ambientGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 44,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  badgeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#D4A373',
    letterSpacing: 2,
    marginLeft: 6,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#2C1B18',
    letterSpacing: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#8C7A77',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '85%',
    lineHeight: 20,
  },
  cardsContainer: {
    gap: 16,
  },
  cardGlass: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  cardTextContent: {
    flex: 1,
    paddingRight: 8,
  },
  cardRoleLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 9,
    color: '#D4A373',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#2C1B18',
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    lineHeight: 16,
  },
  arrowBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.5)',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }
});
