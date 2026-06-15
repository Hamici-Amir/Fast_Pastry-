import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  LayoutAnimation,
  Platform
} from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeOutLeft, 
  Layout 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { GlassBox } from '../src/components/ui/GlassBox';
import { DriverTabBar } from '../src/components/navigation/DriverTabBar';
import { AppHeader } from '../src/components/common/AppHeader';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  Wallet, 
  Info, 
  MapPin, 
  Settings, 
  ShieldCheck, 
  Star, 
  X, 
  Clock, 
  Check 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Notification Type definitions
type NotificationType = 'delivery' | 'payout' | 'announcement' | 'support' | 'performance';

interface PastryNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  unread: boolean;
  actionText?: string;
  actionType?: 'accept' | 'view_payout' | 'view_profile';
}

const INITIAL_NOTIFICATIONS: PastryNotification[] = [
  {
    id: 'n1',
    type: 'delivery',
    title: 'NEW ROUTE REQUEST • $34.00',
    body: 'Boutique HQ → Beverly Hills Residence. 3.2 miles. 3-Tier Anniversary Cake (Extremely Fragile).',
    timestamp: '2 mins ago',
    unread: true,
    actionText: 'ACCEPT OFFER',
    actionType: 'accept'
  },
  {
    id: 'n2',
    type: 'payout',
    title: 'INSTANT PAYOUT SUCCESS',
    body: 'Disbursed $1,482.50 instantly to your connected fast pastry Prestige Debit Card **** 4921.',
    timestamp: '15 mins ago',
    unread: true,
    actionText: 'VIEW PRESTIGE CARD',
    actionType: 'view_payout'
  },
  {
    id: 'n3',
    type: 'performance',
    title: 'PLATINUM TIER ACHIEVED',
    body: 'Outstanding! Your 30-day Success rating reached 98% and 4.98⭐. Active bonuses boosted by +5%.',
    timestamp: '2 hours ago',
    unread: true,
    actionText: 'VIEW STATUS',
    actionType: 'view_profile'
  },
  {
    id: 'n4',
    type: 'support',
    title: 'VEHICLE COMPARTMENT PERMIT APPROVED',
    body: 'Your specialized Pastry Safe Temperature Sprinter permit (AC-77) has been successfully verified.',
    timestamp: '1 day ago',
    unread: false
  },
  {
    id: 'n5',
    type: 'announcement',
    title: 'PLATFORM EXPANSION',
    body: 'Fast Pastry is expanding luxury delivery routes to Malibu and Pasadena starting Monday! Prepare for peak rates.',
    timestamp: '2 days ago',
    unread: false
  }
];

export default function DriverNotificationsScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifications, setNotifications] = useState<PastryNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | NotificationType>('all');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mark all notifications as read
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Delete notification from list with layout transition
  const deleteNotification = (id: string) => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Execute interactive button action
  const handleAction = (item: PastryNotification) => {
    if (item.actionType === 'accept') {
      // Simulate quick order accept state transition
      alert('Order #4921 Accepted! Navigating to Boutique HQ...');
      router.replace('/driver');
    } else if (item.actionType === 'view_payout') {
      // Return to driver dashboard with Earnings Tab focused
      router.replace('/driver');
    } else if (item.actionType === 'view_profile') {
      // Return to driver dashboard with Profile Tab focused
      router.replace('/driver');
    }
  };

  // Filter list
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  // Get color-coded type details
  const getTypeMeta = (type: NotificationType) => {
    switch (type) {
      case 'delivery':
        return { icon: MapPin, color: '#D4A373', bg: 'rgba(212, 163, 115, 0.15)' };
      case 'payout':
        return { icon: Wallet, color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.15)' };
      case 'support':
        return { icon: ShieldCheck, color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.15)' };
      case 'performance':
        return { icon: Star, color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)' };
      case 'announcement':
      default:
        return { icon: Info, color: '#E2E8F0', bg: 'rgba(255, 255, 255, 0.1)' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject} className="bg-background" />
      
      {/* Dynamic Ambient Glows */}
      <View pointerEvents="none" style={[styles.ambientGlow, { top: -80, right: -80, backgroundColor: 'rgba(212, 163, 115, 0.12)' }]} />
      <View pointerEvents="none" style={[styles.ambientGlow, { bottom: 100, left: -100, backgroundColor: 'rgba(212, 163, 115, 0.04)' }]} />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader 
          title={t('driver:notifications')} 
          subtitle={t('driver:notifications')} 
          showBack 
          onBackPress={() => router.back()}
          showBell 
          hasNotifications={notifications.some(n => n.unread)}
        />

        {/* ================= CONTROLLER LINKS ================= */}
        <View style={styles.headerActions}>
          <Text style={styles.feedStatus}>
            {notifications.filter(n => n.unread).length} {t('driver:notifications').toUpperCase()}
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={markAllRead}>
            <Text style={styles.markReadText}>{t('common:confirm')}</Text>
          </TouchableOpacity>
        </View>

        {/* ================= FILTER HORIZONTAL TABS ================= */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity 
            onPress={() => setFilter('all')} 
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          >
            <Text style={[styles.filterLabel, filter === 'all' && styles.filterLabelActive]}>{t('orders:active')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setFilter('delivery')} 
            style={[styles.filterTab, filter === 'delivery' && styles.filterTabActive]}
          >
            <Text style={[styles.filterLabel, filter === 'delivery' && styles.filterLabelActive]}>{t('driver:deliveries')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setFilter('payout')} 
            style={[styles.filterTab, filter === 'payout' && styles.filterTabActive]}
          >
            <Text style={[styles.filterLabel, filter === 'payout' && styles.filterLabelActive]}>{t('driver:earnings')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setFilter('performance')} 
            style={[styles.filterTab, filter === 'performance' && styles.filterTabActive]}
          >
            <Text style={[styles.filterLabel, filter === 'performance' && styles.filterLabelActive]}>{t('driver:rating')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setFilter('announcement')} 
            style={[styles.filterTab, filter === 'announcement' && styles.filterTabActive]}
          >
            <Text style={[styles.filterLabel, filter === 'announcement' && styles.filterLabelActive]}>{t('common:info')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setFilter('support')} 
            style={[styles.filterTab, filter === 'support' && styles.filterTabActive]}
          >
            <Text style={[styles.filterLabel, filter === 'support' && styles.filterLabelActive]}>{t('common:save')}</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= NOTIFICATIONS LIST ================= */}
        <View style={styles.listContainer}>
          {filteredNotifications.length === 0 ? (
            <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyContainer}>
              <View style={styles.emptyCircle}>
                <CheckCircle size={32} color="#D4A373" />
              </View>
              <Text style={styles.emptyTitle}>{t('driver:notifications')}</Text>
              <Text style={styles.emptySub}>{t('common:no_results')}</Text>
            </Animated.View>
          ) : (
            filteredNotifications.map((item, index) => {
              const meta = getTypeMeta(item.type);
              return (
                <Animated.View 
                  key={item.id} 
                  entering={FadeInDown.duration(500).delay(index * 100)}
                  exiting={FadeOutLeft.duration(300)}
                  layout={Layout.springify()}
                  style={styles.cardWrapper}
                >
                  <GlassBox intensity={60} tint="light" style={styles.notificationCard}>
                    <LinearGradient
                      colors={[item.unread ? 'rgba(212, 163, 115, 0.08)' : 'transparent', 'transparent']}
                      style={StyleSheet.absoluteFillObject}
                    />

                    {/* Unread indicator dot */}
                    {item.unread && (
                      <View style={styles.unreadPulseDot} />
                    )}

                    <View style={styles.cardHeader}>
                      {/* Left category icon avatar */}
                      <View style={[styles.iconAvatar, { backgroundColor: meta.bg }]}>
                        <meta.icon size={18} color={meta.color} />
                      </View>

                      {/* Title & Timestamp */}
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.cardBody}>{item.body}</Text>
                      </View>

                      {/* Right Dismiss icon button */}
                      <TouchableOpacity 
                        onPress={() => deleteNotification(item.id)} 
                        style={styles.dismissBtn}
                      >
                        <X size={16} color="#8E99A8" />
                      </TouchableOpacity>
                    </View>

                    {/* Context Action Shortcut Buttons */}
                    {item.actionText && (
                      <View style={styles.cardActions}>
                        <TouchableOpacity 
                          activeOpacity={0.8}
                          onPress={() => handleAction(item)}
                          style={[
                            styles.actionBtn,
                            item.actionType === 'accept' && styles.actionBtnGold
                          ]}
                        >
                          {item.actionType === 'accept' ? (
                            <LinearGradient colors={['#D4A373', '#B8860B']} style={styles.gradientActionBtn}>
                              <Text style={styles.actionBtnTextGold}>{item.actionText}</Text>
                            </LinearGradient>
                          ) : (
                            <Text style={styles.actionBtnText}>{item.actionText}</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}

                    <View style={styles.timestampRow}>
                      <Clock size={10} color="#8E99A8" style={{ marginRight: 4 }} />
                      <Text style={styles.timestampText}>{item.timestamp}</Text>
                    </View>
                  </GlassBox>
                </Animated.View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ================= FLOATING TAB BAR ================= */}
      {/* Navigating back to main driver dashboard screen when clicking tabs */}
      <DriverTabBar 
        activeTab="" 
        onTabChange={(tab) => {
          setActiveTab(tab);
          router.replace('/driver');
        }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  ambientGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  feedStatus: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#D4A373',
    letterSpacing: 1.5,
  },
  markReadText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#8C7A77',
    textDecorationLine: 'underline',
  },
  filterContainer: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
    height: 40,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.1)',
    marginRight: 8,
    justifyContent: 'center',
  },
  filterTabActive: {
    borderColor: 'rgba(212, 163, 115, 0.4)',
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
  },
  filterLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    color: '#8C7A77',
  },
  filterLabelActive: {
    color: '#D4A373',
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  notificationCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  unreadPulseDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A373',
  },
  cardHeader: {
    flexDirection: 'row',
  },
  iconAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    paddingRight: 10,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#2C1B18',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardBody: {
    fontFamily: 'Cairo-Medium',
    fontSize: 12,
    color: '#8C7A77',
    lineHeight: 18,
  },
  dismissBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  cardActions: {
    marginTop: 16,
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientActionBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  actionBtnGold: {
    borderWidth: 0,
  },
  actionBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#2C1B18',
    letterSpacing: 0.5,
  },
  actionBtnTextGold: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  timestampText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 10,
    color: '#8C7A77',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 163, 115, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#2C1B18',
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: 'Cairo-Medium',
    fontSize: 12,
    color: '#8C7A77',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  }
});
