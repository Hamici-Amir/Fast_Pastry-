import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Settings,
  Bell,
  Globe,
  Clock,
  Heart,
  Calendar,
  LogOut,
  ChevronRight,
  Award,
  Crown
} from 'lucide-react-native';
import Animated, { 
  FadeInDown,
  FadeInRight
} from 'react-native-reanimated';
import { theme } from '../../src/theme';
import { GlassBox } from '../../src/components/ui/GlassBox';
import { AppHeader } from '../../src/components/common/AppHeader';
import { LanguagePicker } from '../../src/components/ui/LanguagePicker';

const { width } = Dimensions.get('window');

// Mock Data
const SAVED_RECIPES = [
  { id: '1', title: 'Midnight Velvet', image: require('../../assets/images/luxury_cake.jpg') },
  { id: '2', title: 'Imperial Gold', image: require('../../assets/images/luxury_cake.jpg') },
  { id: '3', title: 'Rosy Ispahan', image: require('../../assets/images/luxury_cake.jpg') }
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  const handleLogout = () => {
    Alert.alert(
      t('profile:logout'),
      t('profile:logout_confirm'),
      [
        { text: t('common:cancel'), style: "cancel" },
        { text: t('profile:logout'), style: "destructive" }
      ]
    );
  };

  const handleNavigation = (route: string) => {
    Alert.alert(t('profile:settings'), `${route}...`);
  };

  return (
    <View style={styles.container}>
      {/* Universal Modern Header */}
      <AppHeader 
        title={t('profile:title')}
        subtitle={t('profile:edit_profile')}
        rightContent={
          <View className="flex-row gap-3 mr-3">
             <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm">
                <Bell size={18} color="#D4A373" />
             </TouchableOpacity>
             <TouchableOpacity className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm">
                <Settings size={18} color="#D4A373" />
             </TouchableOpacity>
          </View>
        }
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        {/* HEADER SECTION */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.headerBlock}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#C59567', '#D4A373', '#E8C39E']}
              style={styles.avatarGradientRing}
            >
              <View style={styles.avatarInner}>
                <Text style={styles.avatarLetter}>JC</Text>
              </View>
            </LinearGradient>
            
            {/* VIP Floating Badge */}
            <View style={styles.vipBadge}>
              <Crown size={10} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.userName}>Jane Cooper</Text>
          <Text style={styles.userTier}>MAISON VIP MEMBER • SINCE 2024</Text>
        </Animated.View>

        {/* METRICS DASHBOARD */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.metricsContainer}>
          <GlassBox intensity={60} style={styles.metricCard}>
            <Text style={styles.metricValue}>14</Text>
            <Text style={styles.metricLabel}>{t('profile:order_history')}</Text>
          </GlassBox>
          <GlassBox intensity={60} style={styles.metricCard}>
            <Text style={styles.metricValue}>3</Text>
            <Text style={styles.metricLabel}>{t('profile:saved_recipes')}</Text>
          </GlassBox>
          <GlassBox intensity={60} style={styles.metricCard}>
            <Text style={styles.metricValue}>1</Text>
            <Text style={styles.metricLabel}>{t('profile:personal_info')}</Text>
          </GlassBox>
        </Animated.View>

        {/* SAVED RECIPES CAROUSEL */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('profile:saved_recipes')}</Text>
            <TouchableOpacity onPress={() => handleNavigation('All Creations')}>
              <Text style={styles.seeAllText}>{t('common:next')}</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {SAVED_RECIPES.map((recipe, index) => (
              <Animated.View key={recipe.id} entering={FadeInRight.duration(500).delay(300 + (index * 100))}>
                <TouchableOpacity style={styles.recipeCard} activeOpacity={0.8}>
                  <Image source={recipe.image} style={styles.recipeImage} resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(44, 27, 24, 0.8)']}
                    style={styles.recipeGradient}
                  >
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  </LinearGradient>
                  <View style={styles.recipeHeartBadge}>
                    <Heart size={14} color="#D4A373" fill="#D4A373" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* UPCOMING CELEBRATION */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
          <Text style={[styles.sectionTitle, { marginLeft: 24, marginTop: 30, marginBottom: 14 }]}>{t('profile:personal_info')}</Text>
          <View style={{ paddingHorizontal: 24 }}>
            <GlassBox intensity={80} style={styles.eventCard}>
              <View style={styles.eventRow}>
                <View style={styles.eventIconBox}>
                  <Calendar size={20} color="#D4A373" />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{t('profile:personal_info')}</Text>
                  <Text style={styles.eventDate}>{t('profile:personal_info')}</Text>
                </View>
                <TouchableOpacity style={styles.eventActionBtn}>
                  <Text style={styles.eventActionText}>{t('common:edit')}</Text>
                </TouchableOpacity>
              </View>
            </GlassBox>
          </View>
        </Animated.View>

        {/* SETTINGS MENU */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.menuContainer}>
          <Text style={styles.menuSectionTitle}>{t('profile:settings')}</Text>
          
          <GlassBox intensity={40} style={styles.menuListGlass}>
            
            <Animated.View entering={FadeInDown.delay(600)}>
              <TouchableOpacity style={styles.menuItemRow} onPress={() => handleNavigation('Order History')}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(212, 163, 115, 0.15)' }]}>
                  <Clock size={18} color="#D4A373" />
                </View>
                <Text style={styles.menuItemTitle}>{t('profile:order_history')}</Text>
                <ChevronRight size={18} color="#C5B6B3" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.menuDivider} />

            <Animated.View entering={FadeInDown.delay(680)}>
              <View style={styles.menuItemRow}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(140, 122, 119, 0.1)' }]}>
                  <Globe size={18} color="#8C7A77" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.menuItemTitle}>{t('profile:language')}</Text>
                  <LanguagePicker />
                </View>
              </View>
            </Animated.View>

            <View style={styles.menuDivider} />

            <Animated.View entering={FadeInDown.delay(760)}>
              <TouchableOpacity style={styles.menuItemRow} onPress={() => handleNavigation('Notifications')}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(140, 122, 119, 0.1)' }]}>
                  <Bell size={18} color="#8C7A77" />
                </View>
                <Text style={styles.menuItemTitle}>{t('profile:notifications')}</Text>
                <ChevronRight size={18} color="#C5B6B3" />
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.menuDivider} />

            <Animated.View entering={FadeInDown.delay(840)}>
              <TouchableOpacity style={styles.menuItemRow} onPress={() => handleNavigation('Settings')}>
                <View style={[styles.menuIconBg, { backgroundColor: 'rgba(140, 122, 119, 0.1)' }]}>
                  <Settings size={18} color="#8C7A77" />
                </View>
                <Text style={styles.menuItemTitle}>{t('profile:settings')}</Text>
                <ChevronRight size={18} color="#C5B6B3" />
              </TouchableOpacity>
            </Animated.View>
            
          </GlassBox>
        </Animated.View>

        {/* LOGOUT BUTTON */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={18} color="#E06D6D" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>{t('profile:logout')}</Text>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  glowAuraTop: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(212, 163, 115, 0.15)',
    zIndex: -1,
  },
  glowAuraBottom: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(250, 218, 221, 0.4)',
    zIndex: -1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarGradientRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
    backgroundColor: '#FAF5EE',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#2C1B18',
  },
  vipBadge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: '#2C1B18',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF8F2',
  },
  userName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#2C1B18',
  },
  userTier: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#D4A373',
    letterSpacing: 2,
    marginTop: 2,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 36,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.4)',
  },
  metricValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#2C1B18',
  },
  metricLabel: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 11,
    color: '#8C7A77',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#2C1B18',
  },
  seeAllText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    color: '#D4A373',
    marginBottom: 2,
  },
  carouselContainer: {
    paddingLeft: 24,
    paddingRight: 8,
    gap: 16,
  },
  recipeCard: {
    width: width * 0.42,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.3)',
    marginRight: 16,
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  recipeGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  recipeTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  recipeHeartBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.4)',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    flex: 1,
    marginLeft: 14,
  },
  eventTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#2C1B18',
  },
  eventDate: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#D4A373',
    marginTop: 2,
  },
  eventActionBtn: {
    backgroundColor: '#2C1B18',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  eventActionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#FFFFFF',
  },
  menuContainer: {
    paddingHorizontal: 24,
    marginTop: 36,
  },
  menuSectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#8C7A77',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuListGlass: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    overflow: 'hidden',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTitle: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#2C1B18',
    marginLeft: 12,
  },
  menuItemValue: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    color: '#8C7A77',
    marginRight: 8,
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(232, 211, 194, 0.25)',
    marginLeft: 64, // Align with text
  },
  logoutContainer: {
    paddingHorizontal: 24,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(224, 109, 109, 0.3)',
    backgroundColor: 'rgba(224, 109, 109, 0.05)',
  },
  logoutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#E06D6D',
  }
});
