import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info,
  Thermometer,
  Navigation
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay, 
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { theme } from '../src/theme';
import { GlassBox } from '../src/components/ui/GlassBox';
import { Button } from '../src/components/ui/Button';
import { AppHeader } from '../src/components/common/AppHeader';

const { width, height } = Dimensions.get('window');

// 20 Floating Gold Sparkles for Ambient Map Decoration
const SPARKLE_COUNT = 10;

function AmbientSparkle({ index }: { index: number }) {
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4 + Math.random() * 0.4, { duration: 1500 + Math.random() * 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(0.8 + Math.random() * 0.6, { duration: 1500 + Math.random() * 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const top = 30 + Math.random() * 120;
  const left = 20 + Math.random() * (width - 80);

  return (
    <Animated.View 
      style={[
        styles.ambientSparkle, 
        { top, left },
        style
      ]}
    >
      <Sparkles size={8} color="#D4A373" />
    </Animated.View>
  );
}

// Simulated Interactive Logistics Map with Live Animated Courier Capsule
const InteractiveLogisticsMap = () => {
  const { t } = useTranslation();
  // Shared progress value of courier van from 0 (Boutique) to 1 (Home)
  const courierProgress = useSharedValue(0);

  useEffect(() => {
    // Loop the courier van along the street path continuously (8 seconds duration)
    courierProgress.value = withRepeat(
      withTiming(1, { 
        duration: 8000, 
        easing: Easing.inOut(Easing.quad) 
      }),
      -1,
      false // Restart from 0 at the end of the loop
    );
  }, []);

  // Compute animated coordinates along the S-shaped logistics route
  // The path starts at: Boutique (60, 40)
  // segment 1 (horizontal): x: 60 -> 160 at y: 40 (progress 0 to 0.4)
  // segment 2 (vertical): y: 40 -> 140 at x: 160 (progress 0.4 to 0.8)
  // segment 3 (horizontal): x: 160 -> 240 at y: 140 (progress 0.8 to 1.0)
  const animatedVanStyle = useAnimatedStyle(() => {
    const p = courierProgress.value;
    let x = 60;
    let y = 40;
    let rotation = '0deg';

    if (p <= 0.4) {
      // Horizontal segment 1
      const localProgress = p / 0.4;
      x = interpolate(localProgress, [0, 1], [60, 160]);
      y = 40;
      rotation = '90deg'; // Facing East
    } else if (p <= 0.8) {
      // Vertical segment 2
      const localProgress = (p - 0.4) / 0.4;
      x = 160;
      y = interpolate(localProgress, [0, 1], [40, 140]);
      rotation = '180deg'; // Facing South
    } else {
      // Horizontal segment 3
      const localProgress = (p - 0.8) / 0.2;
      x = interpolate(localProgress, [0, 1], [160, 240]);
      y = 140;
      rotation = '90deg'; // Facing East
    }

    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: rotation }
      ]
    };
  });

  return (
    <View style={styles.mapContainer}>
      <LinearGradient 
        colors={['#FAF5EE', '#F5EBE0']} 
        style={StyleSheet.absoluteFillObject}
      />
      {/* Decorative sparkles */}
      {Array.from({ length: SPARKLE_COUNT }).map((_, i) => (
        <AmbientSparkle key={i} index={i} />
      ))}

      {/* Abstract Streets Grid Lines */}
      <View style={[styles.mapStreet, { top: 40, left: 10, width: '90%', height: 2 }]} />
      <View style={[styles.mapStreet, { top: 90, left: 20, width: '70%', height: 2 }]} />
      <View style={[styles.mapStreet, { top: 140, left: 10, width: '90%', height: 2 }]} />
      <View style={[styles.mapStreet, { top: 10, left: 60, width: 2, height: '85%' }]} />
      <View style={[styles.mapStreet, { top: 20, left: 160, width: 2, height: '85%' }]} />
      <View style={[styles.mapStreet, { top: 10, left: 250, width: 2, height: '85%' }]} />

      {/* Parisian Street Name Labels */}
      <Text style={[styles.streetLabelText, { top: 26, left: 75 }]}>RUE ROYALE</Text>
      <Text style={[styles.streetLabelText, { top: 126, left: 80 }]}>BD HAUSSMANN</Text>
      <Text style={[styles.streetLabelText, { top: 60, left: 166, transform: [{ rotate: '90deg' }] }]}>AVENUE MONTAIGNE</Text>

      {/* S-Shaped Golden Dotted Route Path */}
      <View style={styles.routePathWrapper}>
        <View style={[styles.routePathSegment, { top: 40, left: 60, width: 100, height: 2, borderStyle: 'dotted', borderTopWidth: 2, borderColor: '#D4A373' }]} />
        <View style={[styles.routePathSegment, { top: 40, left: 160, width: 2, height: 100, borderStyle: 'dotted', borderLeftWidth: 2, borderColor: '#D4A373' }]} />
        <View style={[styles.routePathSegment, { top: 140, left: 160, width: 80, height: 2, borderStyle: 'dotted', borderTopWidth: 2, borderColor: '#D4A373' }]} />
      </View>

      {/* Boutique Marker */}
      <View style={[styles.mapMarker, { top: 26, left: 40 }]}>
        <View style={styles.markerCircleBoutique}>
          <Text style={{ fontSize: 10 }}>⚜️</Text>
        </View>
        <View style={styles.markerLabelFrame}>
          <Text style={styles.markerLabelTitle}>{t('orders:title')}</Text>
        </View>
      </View>

      {/* Destination Marker */}
      <View style={[styles.mapMarker, { top: 124, left: 226 }]}>
        <View style={styles.markerCircleHome}>
          <MapPin size={10} color="#FFFFFF" />
        </View>
        <View style={styles.markerLabelFrame}>
          <Text style={styles.markerLabelTitle}>{t('orders:delivery_address')}</Text>
        </View>
      </View>

      {/* LIVE ANIMATED COURIER VAN CAPSULE (Upgraded with Chef Avatar) */}
      <Animated.View style={[styles.animatedVanCapsule, animatedVanStyle]}>
        <View style={styles.vanInnerCircle}>
          <Text style={{ fontSize: 9 }}>👨‍🍳</Text>
        </View>
        <View style={styles.vanPulseCircle} />
      </Animated.View>

      {/* Shipping Details Overlay */}
      <GlassBox intensity={95} style={styles.mapInfoBadge}>
        <View style={styles.mapInfoPulse} />
        <Thermometer size={10} color="#D4A373" style={{ marginRight: 4 }} />
        <Text style={styles.mapInfoText}>{t('orders:status_delivering')}</Text>
      </GlassBox>
    </View>
  );
};

export default function DeliveryTrackingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Hardcoded premium delivery details
  const deliveryData = {
    orderId: 'FP-892110',
    estimatedTime: '14:52 PM',
    minsRemaining: 14,
    courierName: 'Jean-Pierre D.',
    courierRating: '4.9',
    destination: '72 Rue Royale, Paris, 75008',
    itemsList: [
      { id: '1', title: 'Imperial Gold Opulence Cake ⚜️', qty: 1, details: '3 Tiers • Cacao Royale Flavor • Edible Gold' },
      { id: '2', title: 'Rosy Ispahan Secret Garden 🌸', qty: 2, details: '1 Tier • L\'Amour Rose Flavor • Wild Berries' }
    ]
  };

  const handleCallDriver = () => {
    Alert.alert(
      t('orders:title'),
      t('orders:track_order'),
      [{ text: t('common:close') }]
    );
  };

  const handleChatBoutique = () => {
    router.push('/chat' as any);
  };

  return (
    <View style={styles.container}>
      
      {/* Premium Floating Ambient Glow Auras */}
      <View style={styles.glowAuraPink} />
      <View style={styles.glowAuraGold} />
      {/* Premium Safe Header overlay */}
      {/* Universal Modern Header */}
      <AppHeader 
        title={t('orders:title')}
        subtitle={t('orders:track_order')}
        showBack
        onBackPress={() => router.back()}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}
      >
        {/* SECTION 1: MAP AND ESTIMATE TIME CARD */}
        <View style={styles.mapAreaWrapper}>
          <InteractiveLogisticsMap />
          
          {/* Estimated Arrival Time Floating Overlay */}
          <GlassBox intensity={95} style={styles.floatingEstimateCard}>
            <View style={styles.estimateRow}>
              <View style={styles.clockIconCircle}>
                <Clock size={22} color="#D4A373" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.estimateTitle}>{t('orders:estimated_delivery')}</Text>
                <Text style={styles.estimateTimeValue}>
                  {deliveryData.estimatedTime} <Text style={styles.estimateRemainingText}>({deliveryData.minsRemaining} {t('common:loading')})</Text>
                </Text>
              </View>
              <View style={styles.statusOnScheduleBadge}>
                <Text style={styles.statusOnScheduleText}>{t('orders:status_delivering')}</Text>
              </View>
            </View>
            <View style={styles.estimateSeparator} />
            <Text style={styles.estimateDescText}>
              {t('orders:estimated_delivery')}
            </Text>
          </GlassBox>
        </View>

        {/* SECTION 2: COURIER PROFILE CARD */}
        <Text style={styles.sectionTitle}>{t('orders:title')}</Text>
        <GlassBox intensity={80} style={styles.courierProfileCard}>
          <View style={styles.courierRow}>
            {/* Courier Avatar Silhouette */}
            <View style={styles.courierAvatarWrapper}>
              <View style={styles.avatarInnerCircle}>
                <Text style={styles.avatarLetterText}>JP</Text>
              </View>
              <View style={styles.avatarVerifiedBadge}>
                <Award size={10} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </View>
            
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.courierName}>{deliveryData.courierName}</Text>
              <Text style={styles.courierStatusLabel}>{t('orders:status_delivering')}</Text>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStars}>⭐️⭐️⭐️⭐️⭐️</Text>
                <Text style={styles.ratingValText}>{deliveryData.courierRating} ({t('orders:status_delivered')})</Text>
              </View>
            </View>
          </View>

          {/* Direct Communication Buttons Row */}
          <View style={styles.communicationRow}>
            <TouchableOpacity 
              style={[styles.commButtonTouch, styles.commButtonSecondary]}
              onPress={handleCallDriver}
            >
              <Phone size={15} color="#2C1B18" style={{ marginRight: 8 }} />
              <Text style={styles.commButtonTextSecondary}>{t('orders:track_order')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.commButtonTouch}
              onPress={handleChatBoutique}
            >
              <LinearGradient
                colors={['#C59567', '#D4A373']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.commButtonGradient}
              >
                <MessageSquare size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.commButtonTextPrimary}>{t('orders:title')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </GlassBox>

        {/* SECTION 3: DELIVERY STATUS TIMELINE */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>{t('orders:active')}</Text>
        <GlassBox intensity={50} style={styles.timelineCard}>
          
          {/* Milestone 1 (Completed) */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineConnectorLine} />
            <View style={styles.timelineIndicatorCheck}>
              <Check size={9} color="#FFFFFF" strokeWidth={3} />
            </View>
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineLabelTitleCheck}>{t('orders:status_confirmed')}</Text>
              <Text style={styles.timelineLabelDesc}>{t('orders:status_confirmed')}</Text>
            </View>
          </View>

          {/* Milestone 2 (Completed) */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineConnectorLine} />
            <View style={styles.timelineIndicatorCheck}>
              <Check size={9} color="#FFFFFF" strokeWidth={3} />
            </View>
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineLabelTitleCheck}>{t('orders:status_preparing')}</Text>
              <Text style={styles.timelineLabelDesc}>{t('orders:status_preparing')}</Text>
            </View>
          </View>

          {/* Milestone 3 (Active) */}
          <View style={styles.timelineItem}>
            <View style={styles.timelineConnectorLine} />
            {/* Pulsing Active Dot */}
            <View style={styles.timelineIndicatorActiveOuter}>
              <View style={styles.timelineIndicatorActiveInner} />
            </View>
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineLabelTitleActive}>{t('orders:status_delivering')}</Text>
              <Text style={styles.timelineLabelDescActive}>{t('orders:status_delivering')}</Text>
            </View>
          </View>

          {/* Milestone 4 (Pending) */}
          <View style={[styles.timelineItem, { paddingBottom: 0 }]}>
            <View style={styles.timelineIndicatorPending}>
              <View style={styles.timelinePendingDotInner} />
            </View>
            <View style={styles.timelineDetails}>
              <Text style={styles.timelineLabelTitlePending}>{t('orders:status_delivered')}</Text>
              <Text style={styles.timelineLabelDesc}>{t('orders:status_delivered')}</Text>
            </View>
          </View>

        </GlassBox>

        {/* SECTION 4: COLLAPSIBLE DELIVERY SUMMARY */}
        <View style={styles.collapsibleSummaryWrapper}>
          <TouchableOpacity 
            style={styles.summaryHeaderTouch}
            onPress={() => setSummaryExpanded(!summaryExpanded)}
            activeOpacity={0.8}
          >
            <GlassBox intensity={70} style={styles.summaryHeaderGlass}>
              <View style={styles.summaryHeaderRow}>
                <View style={styles.summaryHeaderTitleBlock}>
                  <Text style={styles.summaryHeaderTitle}>{t('orders:title')}</Text>
                  <Text style={styles.summaryHeaderSubtitle}>{t('orders:order_id')}: {deliveryData.orderId}</Text>
                </View>
                {summaryExpanded ? (
                  <ChevronUp size={18} color="#8C7A77" />
                ) : (
                  <ChevronDown size={18} color="#8C7A77" />
                )}
              </View>
            </GlassBox>
          </TouchableOpacity>

          {summaryExpanded && (
            <GlassBox intensity={80} style={styles.summaryExpandedGlass}>
              {/* Destination Address */}
              <View style={styles.expandedInfoBlock}>
                <Text style={styles.expandedBlockTitle}>{t('orders:delivery_address')}</Text>
                <View style={styles.destinationRow}>
                  <MapPin size={14} color="#D4A373" style={{ marginRight: 8, marginTop: 1 }} />
                  <Text style={styles.destinationText}>{deliveryData.destination}</Text>
                </View>
              </View>

              <View style={styles.expandedDivider} />

              {/* Items List */}
              <Text style={styles.expandedBlockTitle}>{t('orders:items')}</Text>
              <View style={styles.expandedItemsList}>
                {deliveryData.itemsList.map(item => (
                  <View key={item.id} style={styles.expandedItemRow}>
                    <View style={styles.expandedItemQtyBox}>
                      <Text style={styles.expandedItemQtyText}>{item.qty}x</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.expandedItemTitle}>{item.title}</Text>
                      <Text style={styles.expandedItemDetails}>{item.details}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.expandedDivider} />

              {/* Secure Transport info */}
              <View style={styles.secureBadgeRow}>
                <ShieldCheck size={14} color="#D4A373" style={{ marginRight: 8 }} />
                <Text style={styles.secureBadgeText}>{t('orders:status_delivered')}</Text>
              </View>

              {/* French Haute Pâtisserie Authenticity Seal */}
              <View style={styles.authenticitySealRow}>
                <View style={styles.sealTinyLine} />
                <Text style={styles.sealText}>{t('orders:status_delivered')}</Text>
                <View style={styles.sealTinyLine} />
              </View>
            </GlassBox>
          )}
        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
    position: 'relative',
  },
  glowAuraPink: {
    position: 'absolute',
    top: 50,
    left: -40,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(250, 218, 221, 0.45)',
    zIndex: -1,
  },
  glowAuraGold: {
    position: 'absolute',
    bottom: 120,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(212, 163, 115, 0.12)',
    zIndex: -1,
  },
  streetLabelText: {
    position: 'absolute',
    fontFamily: 'Cairo-Bold',
    fontSize: 6,
    color: '#8C7A77',
    opacity: 0.35,
    letterSpacing: 1.5,
  },
  mapInfoPulse: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8CB38C',
    marginRight: 5,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 18,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#2C1B18',
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  // Map and floating overlay styles
  mapAreaWrapper: {
    position: 'relative',
    marginBottom: 22,
  },
  mapContainer: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderColor: 'rgba(232, 211, 194, 0.35)',
    borderWidth: 1,
  },
  mapStreet: {
    position: 'absolute',
    backgroundColor: 'rgba(44, 27, 24, 0.04)',
  },
  routePathWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  routePathSegment: {
    position: 'absolute',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 2,
  },
  markerCircleBoutique: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderColor: '#D4A373',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  markerCircleHome: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D4A373',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  markerLabelFrame: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(232, 211, 194, 0.5)',
    borderWidth: 0.5,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 6,
    marginLeft: 5,
  },
  markerLabelTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 7,
    color: '#8C7A77',
    letterSpacing: 0.3,
  },
  ambientSparkle: {
    position: 'absolute',
    zIndex: 1,
  },
  mapInfoBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderColor: 'rgba(212, 163, 115, 0.35)',
    borderWidth: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: 0,
  },
  mapInfoText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 8,
    color: '#D4A373',
  },

  // Live animated driver van capsule styling
  animatedVanCapsule: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginLeft: -10, // Offset horizontally to center on path coordinates
    marginTop: -10,  // Offset vertically to center on path coordinates
  },
  vanInnerCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#D4A373',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2C1B18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 2,
  },
  vanPulseCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(212, 163, 115, 0.45)',
    zIndex: 1,
  },

  // Floating Estimate timing card styling
  floatingEstimateCard: {
    marginTop: -12,
    marginHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    padding: 14,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  estimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212, 163, 115, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estimateTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#8C7A77',
  },
  estimateTimeValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#2C1B18',
    marginTop: 1,
  },
  estimateRemainingText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#D4A373',
  },
  statusOnScheduleBadge: {
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    borderWidth: 0.5,
  },
  statusOnScheduleText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    color: '#D4A373',
    letterSpacing: 0.5,
  },
  estimateSeparator: {
    height: 0.5,
    backgroundColor: 'rgba(232, 211, 194, 0.35)',
    marginVertical: 10,
  },
  estimateDescText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10.5,
    color: '#8C7A77',
    lineHeight: 14.5,
  },

  // Courier Profile Card
  courierProfileCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 14,
    marginBottom: 20,
  },
  courierRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierAvatarWrapper: {
    position: 'relative',
  },
  avatarInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(44, 27, 24, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 211, 194, 0.45)',
  },
  avatarLetterText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#2C1B18',
    opacity: 0.8,
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#D4A373',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#FFFFFF',
    borderWidth: 1.5,
  },
  courierName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#2C1B18',
  },
  courierStatusLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9.5,
    color: '#8C7A77',
    marginTop: 1.5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2.5,
  },
  ratingStars: {
    fontSize: 8,
    marginRight: 6,
  },
  ratingValText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8,
    color: '#8C7A77',
    opacity: 0.8,
  },
  communicationRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  commButtonTouch: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
  },
  commButtonSecondary: {
    borderWidth: 1,
    borderColor: 'rgba(44, 27, 24, 0.15)',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commButtonTextSecondary: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#2C1B18',
  },
  commButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  commButtonTextPrimary: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#FFFFFF',
  },

  // Logistical milestones timeline
  timelineCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    padding: 14,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: 16,
  },
  timelineConnectorLine: {
    position: 'absolute',
    left: 8.5,
    top: 18,
    width: 1,
    bottom: 0,
    backgroundColor: 'rgba(212, 163, 115, 0.25)',
  },
  timelineIndicatorCheck: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D4A373',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 1,
  },
  timelineIndicatorActiveOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(212, 163, 115, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 1,
  },
  timelineIndicatorActiveInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A373',
  },
  timelineIndicatorPending: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(212, 163, 115, 0.4)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 1,
  },
  timelinePendingDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(212, 163, 115, 0.2)',
  },
  timelineDetails: {
    flex: 1,
    marginLeft: 12,
  },
  timelineLabelTitleCheck: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#8C7A77',
    opacity: 0.85,
  },
  timelineLabelTitleActive: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#2C1B18',
  },
  timelineLabelTitlePending: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
  },
  timelineLabelDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    lineHeight: 11.5,
    marginTop: 2,
  },
  timelineLabelDescActive: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#D4A373',
    lineHeight: 11.5,
    marginTop: 2,
  },

  // Collapsible summary details card
  collapsibleSummaryWrapper: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryHeaderTouch: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  summaryHeaderGlass: {
    borderRadius: 20,
    padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryHeaderTitleBlock: {
    flex: 1,
  },
  summaryHeaderTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12.5,
    color: '#2C1B18',
  },
  summaryHeaderSubtitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8.5,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 1,
  },
  summaryExpandedGlass: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1.2,
    borderTopWidth: 0,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: 14,
    marginTop: -4,
  },
  expandedInfoBlock: {
    gap: 4,
  },
  expandedBlockTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    color: '#2C1B18',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
  },
  destinationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    lineHeight: 14,
  },
  expandedDivider: {
    height: 0.5,
    backgroundColor: 'rgba(232, 211, 194, 0.35)',
    marginVertical: 12,
  },
  expandedItemsList: {
    gap: 8,
    marginTop: 4,
  },
  expandedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedItemQtyBox: {
    backgroundColor: 'rgba(212, 163, 115, 0.08)',
    borderColor: 'rgba(212, 163, 115, 0.25)',
    borderWidth: 0.5,
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedItemQtyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#D4A373',
  },
  expandedItemTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11.5,
    color: '#2C1B18',
  },
  expandedItemDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9.5,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 1,
  },
  secureBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.04)',
    borderColor: 'rgba(212, 163, 115, 0.2)',
    borderWidth: 0.5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
  secureBadgeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#D4A373',
  },
  authenticitySealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    gap: 8,
  },
  sealTinyLine: {
    width: 20,
    height: 0.5,
    backgroundColor: 'rgba(212, 163, 115, 0.35)',
  },
  sealText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 7.5,
    color: '#D4A373',
    letterSpacing: 2,
    opacity: 0.8,
  }
});
