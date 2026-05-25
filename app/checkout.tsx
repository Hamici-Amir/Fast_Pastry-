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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Award, 
  ShieldCheck, 
  Check, 
  X, 
  Sparkles,
  ChevronRight,
  Info,
  Apple
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay, 
  Easing 
} from 'react-native-reanimated';
import { theme } from '../src/theme';
import { GlassBox } from '../src/components/ui/GlassBox';
import { Button } from '../src/components/ui/Button';
import { AppHeader } from '../src/components/common/AppHeader';

const { width, height } = Dimensions.get('window');

// 20 Floating Gold Dust Particles for Order Confirmation Overlay
const GOLD_DUST_COUNT = 18;

function FloatingGoldDustFlake({ index }: { index: number }) {
  const translateY = useSharedValue(height + 100);
  const translateX = useSharedValue(Math.random() * width);
  const opacity = useSharedValue(0.2 + Math.random() * 0.6);
  const scale = useSharedValue(0.4 + Math.random() * 0.8);

  useEffect(() => {
    const delay = index * 240;
    const duration = 4000 + Math.random() * 3000;
    
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-50, { 
          duration, 
          easing: Easing.out(Easing.quad) 
        }),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(translateX.value + (Math.random() * 80 - 40), {
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.sin)
        }),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4A373',
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  }));

  return <Animated.View style={animStyle} />;
}

// Interactive Simulated Map Vector Route Preview
const SimulatedRouteMap = () => {
  return (
    <View style={styles.mapContainer}>
      <LinearGradient 
        colors={['#FAF5EE', '#F5EBE0']} 
        style={StyleSheet.absoluteFillObject}
      />
      {/* Abstract Streets Lines Grid */}
      <View style={[styles.mapStreet, { top: 30, left: 10, width: '90%', height: 1.5 }]} />
      <View style={[styles.mapStreet, { top: 75, left: 20, width: '70%', height: 1.5 }]} />
      <View style={[styles.mapStreet, { top: 120, left: 10, width: '90%', height: 1.5 }]} />
      <View style={[styles.mapStreet, { top: 10, left: 50, width: 1.5, height: '80%' }]} />
      <View style={[styles.mapStreet, { top: 20, left: 140, width: 1.5, height: '80%' }]} />
      <View style={[styles.mapStreet, { top: 10, left: 230, width: 1.5, height: '80%' }]} />

      {/* S-Shaped Golden Dotted Route Path */}
      <View style={styles.routePathWrapper}>
        <View style={[styles.routePathSegment, { top: 40, left: 60, width: 90, height: 2, borderStyle: 'dotted', borderTopWidth: 2, borderColor: '#D4A373' }]} />
        <View style={[styles.routePathSegment, { top: 40, left: 148, width: 2, height: 80, borderStyle: 'dotted', borderLeftWidth: 2, borderColor: '#D4A373' }]} />
        <View style={[styles.routePathSegment, { top: 118, left: 150, width: 90, height: 2, borderStyle: 'dotted', borderTopWidth: 2, borderColor: '#D4A373' }]} />
      </View>

      {/* Boutique Marker */}
      <View style={[styles.mapMarker, { top: 26, left: 40 }]}>
        <View style={styles.markerCircleBoutique}>
          <Text style={{ fontSize: 10 }}>⚜️</Text>
        </View>
        <View style={styles.markerLabelFrame}>
          <Text style={styles.markerLabelTitle}>Rue Royale Boutique</Text>
        </View>
      </View>

      {/* Destination Marker */}
      <View style={[styles.mapMarker, { top: 102, left: 220 }]}>
        <View style={styles.markerCircleHome}>
          <MapPin size={10} color="#FFFFFF" />
        </View>
        <View style={styles.markerLabelFrame}>
          <Text style={styles.markerLabelTitle}>Cooper Residence</Text>
        </View>
      </View>

      {/* Shipping Details Overlay */}
      <GlassBox intensity={85} style={styles.mapInfoBadge}>
        <Sparkles size={11} color="#D4A373" style={{ marginRight: 6 }} />
        <Text style={styles.mapInfoText}>Refrigerated Courier departed at 3:00 PM</Text>
      </GlassBox>
    </View>
  );
};

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Extract parameters sent from Cart Screen
  const params = useLocalSearchParams<{ 
    deliveryMode?: string; 
    appliedPromo?: string; 
    discountPercent?: string;
  }>();

  const isPickup = params.deliveryMode === 'pickup';
  const discountPercent = parseFloat(params.discountPercent || '0');
  const promoCodeApplied = params.appliedPromo || '';

  // Order item details (Coordinated with basket details in Cart)
  const cartItems = [
    {
      id: '1',
      title: 'Imperial Gold Opulence Cake ⚜️',
      price: 168.00,
      quantity: 1,
      tiers: '3 Tiers',
      flavor: 'Cacao Royale',
      details: 'Spatula finish, Gold Shells border, Macarons, Gold Cheers Topper'
    },
    {
      id: '2',
      title: 'Rosy Ispahan Secret Garden 🌸',
      price: 95.00,
      quantity: 2,
      tiers: '1 Tier',
      flavor: "L'Amour Rose",
      details: 'Matte velvet, Pearls border, Berries, Birthday Topper, Gift Dome active'
    }
  ];

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = isPickup ? 0.00 : 15.00;
  const discountAmount = subtotal * discountPercent;
  const grandTotal = subtotal + deliveryFee - discountAmount;

  // Local state managers
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('afternoon');
  const [processingOrder, setProcessingOrder] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [orderReferenceCode, setOrderReferenceCode] = useState('');

  // Auto-generate next 5 delivery days dynamically starting Tomorrow (Takes 24 hrs preparation)
  const nextDays = React.useMemo(() => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 5; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + i);
      
      days.push({
        dayName: dayNames[targetDate.getDay()],
        dayNum: targetDate.getDate(),
        monthName: monthNames[targetDate.getMonth()],
        fullLabel: `${dayNames[targetDate.getDay()]} ${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`,
        isTomorrow: i === 1
      });
    }
    return days;
  }, []);

  // Set default selected date to tomorrow
  useEffect(() => {
    if (nextDays.length > 0) {
      setSelectedDate(nextDays[0].fullLabel);
    }
  }, [nextDays]);

  // Handle Gourmet Order Placement
  const handlePlaceOrder = () => {
    setProcessingOrder(true);
    
    // Simulate high-security boutique transmission
    setTimeout(() => {
      const code = `FP-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderReferenceCode(code);
      setProcessingOrder(false);
      setShowSuccessOverlay(true);
    }, 2000);
  };

  const handleConfirmOrderFinal = () => {
    setShowSuccessOverlay(false);
    router.replace('/catalogue' as any);
  };

  const handleTrackOrderFinal = () => {
    setShowSuccessOverlay(false);
    router.replace('/tracking' as any);
  };

  return (
    <View style={styles.container}>
      
      {/* Universal Modern Header */}
      <AppHeader 
        title="Checkout Studio"
        subtitle="Secure Haute Gateway"
        leftContent={
          <TouchableOpacity 
            className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm ml-3"
            onPress={() => router.back()}
          >
            <X size={20} color="#D4A373" />
          </TouchableOpacity>
        }
      />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      >
        {/* SECTION 1: DELIVERY ADDRESS */}
        <Text style={styles.sectionTitle}>Delivery Destination</Text>
        <GlassBox intensity={80} style={styles.addressCard}>
          <View style={styles.addressRow}>
            <View style={styles.addressIconCircle}>
              <MapPin size={18} color="#D4A373" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.addressNameLabel}>Cooper Residence</Text>
              <Text style={styles.addressValueLabel}>72 Rue Royale, Paris, 75008</Text>
              <Text style={styles.addressSubLabel}>Contact: Jane Cooper • +33 6 55 92 11</Text>
            </View>
            <TouchableOpacity 
              style={styles.addressEditBtn}
              onPress={() => Alert.alert("Edit Address", "Addresses within Paris District 1-8 are locked for active courier routing.", [{ text: "Understood" }])}
            >
              <Text style={styles.addressEditText}>Change</Text>
            </TouchableOpacity>
          </View>
        </GlassBox>

        {/* SECTION 2: MAP PREVIEW */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Boutique Logistics Map</Text>
        <SimulatedRouteMap />

        {/* SECTION 3: DELIVERY DATE SELECTOR */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Select Date (Craftsmanship requires 24h)</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.dateCarouselContainer}
          style={{ marginBottom: 4 }}
        >
          {nextDays.map((day, idx) => {
            const isSelected = selectedDate === day.fullLabel;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.dateCardTouch}
                onPress={() => setSelectedDate(day.fullLabel)}
              >
                <GlassBox 
                  intensity={isSelected ? 65 : 20}
                  style={[
                    styles.dateCardGlass,
                    isSelected && styles.dateCardActive
                  ]}
                >
                  {day.isTomorrow && (
                    <View style={styles.tomorrowBadge}>
                      <Text style={styles.tomorrowBadgeText}>Chef Pick</Text>
                    </View>
                  )}
                  <Text style={[styles.dateDayName, isSelected && styles.dateDayActiveText]}>{day.dayName}</Text>
                  <Text style={[styles.dateDayNum, isSelected && styles.dateDayActiveText]}>{day.dayNum}</Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateDayActiveText]}>{day.monthName}</Text>
                </GlassBox>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECTION 4: DELIVERY TIME SELECTOR */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Select Courier Arrival Interval</Text>
        <View style={styles.timeSlotsRow}>
          {[
            { key: 'morning', label: 'Morning', hours: '09:00 - 12:00' },
            { key: 'afternoon', label: 'Afternoon', hours: '14:00 - 17:00' },
            { key: 'evening', label: 'Evening', hours: '18:00 - 21:00' }
          ].map(slot => {
            const isSelected = selectedTimeSlot === slot.key;
            return (
              <TouchableOpacity
                key={slot.key}
                style={styles.timeSlotTouch}
                onPress={() => setSelectedTimeSlot(slot.key)}
              >
                <GlassBox 
                  intensity={isSelected ? 60 : 15}
                  style={[
                    styles.timeSlotGlass,
                    isSelected && styles.timeSlotActive
                  ]}
                >
                  <Text style={[styles.timeSlotLabel, isSelected && styles.timeSlotActiveText]}>{slot.label}</Text>
                  <Text style={[styles.timeSlotHours, isSelected && styles.timeSlotActiveText]}>{slot.hours}</Text>
                </GlassBox>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SECTION 5: CASH ON DELIVERY INFO */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Secured Settlement Mode</Text>
        <GlassBox intensity={45} style={styles.paymentCard}>
          <View style={styles.paymentHeaderRow}>
            <View style={styles.paymentIconCircle}>
              <CreditCard size={18} color="#D4A373" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.paymentTitleLabel}>Luxury Cash / Card on Arrival</Text>
              <Text style={styles.paymentSubtitleLabel}>Zero prepayment required • Refrigerated transport</Text>
            </View>
            <View style={styles.paymentCheckCircle}>
              <Check size={10} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>
          
          <Text style={styles.paymentIntroText}>
            Our refrigerated delivery couriers carry mobile POS systems. You may settle securely via **Apple Pay**, **Visa**, **Mastercard**, or **Cash** upon physical arrival and unboxing check.
          </Text>

          <View style={styles.cardLogoContainerRow}>
            <View style={styles.cardLogoBadge}><Text style={styles.cardLogoBadgeText}>VISA</Text></View>
            <View style={styles.cardLogoBadge}><Text style={styles.cardLogoBadgeText}>MC</Text></View>
            <View style={styles.cardLogoBadge}>
              <Apple size={10} color="#8C7A77" style={{ marginRight: 2 }} />
              <Text style={styles.cardLogoBadgeText}>Pay</Text>
            </View>
            <View style={styles.cardLogoBadge}><Text style={styles.cardLogoBadgeText}>CASH</Text></View>
          </View>
        </GlassBox>

        {/* SECTION 6: ORDER SUMMARY */}
        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>Review Custom Recipes</Text>
        <GlassBox intensity={30} style={styles.summaryContainer}>
          {cartItems.map((item, idx) => (
            <View key={item.id}>
              {idx > 0 && <View style={styles.summaryDivider} />}
              <View style={styles.summaryItemRow}>
                <View style={styles.summaryItemTitleBlock}>
                  <Text style={styles.summaryItemTitle}>{item.title}</Text>
                  <Text style={styles.summaryItemMeta}>{item.tiers} • {item.flavor}</Text>
                  <Text style={styles.summaryItemDetails} numberOfLines={2}>{item.details}</Text>
                </View>
                <View style={styles.summaryItemRightBlock}>
                  <Text style={styles.summaryItemQty}>Qty: {item.quantity}</Text>
                  <Text style={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </GlassBox>

      </ScrollView>

      {/* Pricing Summary Sticky Panel */}
      <View style={styles.pricingSummaryStickyPanel}>
        <View style={styles.breakdownList}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>White-Glove Refrigerated Courier</Text>
            <Text style={styles.breakdownValue}>
              {isPickup ? 'Free' : `$${deliveryFee.toFixed(2)}`}
            </Text>
          </View>

          {discountPercent > 0 && (
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: '#E06D6D' }]}>Voucher Discount ({promoCodeApplied})</Text>
              <Text style={[styles.breakdownValue, { color: '#E06D6D' }]}>-${discountAmount.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.breakdownRow, { marginTop: 4 }]}>
            <Text style={styles.grandTotalLabel}>Grand Sum Total</Text>
            <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <Button 
          title={processingOrder ? "Transmitting..." : "Place Gourmet Order"}
          leftIcon={<Award size={18} color="#FFFFFF" strokeWidth={2} />}
          loading={processingOrder}
          onPress={handlePlaceOrder}
          style={styles.placeOrderBtn}
        />
      </View>

      {/* FULLSCREEN ORDER CONFIRMED CELEBRATION OVERLAY */}
      {showSuccessOverlay && (
        <View style={styles.successFullOverlay}>
          {/* Drifting Gold Dust particles */}
          {Array.from({ length: GOLD_DUST_COUNT }).map((_, i) => (
            <FloatingGoldDustFlake key={i} index={i} />
          ))}

          {/* Invitation Envelope Glass Panel */}
          <View style={styles.envelopeWrapper}>
            <GlassBox intensity={98} style={styles.envelopeGlassInner}>
              
              {/* Gold Ribbon Label */}
              <View style={styles.goldWaxRibbonBlock}>
                <View style={styles.ribbonBandLeft} />
                <View style={styles.ribbonBandRight} />
                
                {/* Golden Wax Seal Stamp */}
                <View style={styles.waxSealStampBorder}>
                  <LinearGradient
                    colors={['#C59567', '#D4A373', '#E8C39E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.waxSealStampGradient}
                  >
                    <Award size={38} color="#FFFFFF" strokeWidth={1.8} />
                  </LinearGradient>
                </View>
              </View>

              <Text style={styles.successMainTitle}>Gourmet Order Sealed</Text>
              <Text style={styles.successSubtitle}>
                Your pastry recipe has been transmitted to Chef Jean-Luc's workshop at Rue Royale, Paris.
              </Text>

              {/* Order reference code */}
              <View style={styles.refCodeContainer}>
                <Text style={styles.refCodeLabel}>TRANSMISSION CODE</Text>
                <Text style={styles.refCodeValue}>{orderReferenceCode}</Text>
              </View>

              {/* Delivery Timeline Progress Card */}
              <Text style={styles.timelineTitle}>Boutique Preparation Milestones</Text>
              <View style={styles.timelineDeck}>
                
                {/* Step 1 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineConnectorLine} />
                  <View style={styles.timelineStepIndicatorActive}>
                    <Check size={10} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <View style={styles.timelineDetailsBlock}>
                    <Text style={styles.timelineStepTitleActive}>Order Authenticated & Sealed</Text>
                    <Text style={styles.timelineStepDesc}>Recipe logged and ingredients selected.</Text>
                  </View>
                </View>

                {/* Step 2 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineConnectorLine} />
                  <View style={styles.timelineStepIndicator}>
                    <View style={styles.timelineStepDotInner} />
                  </View>
                  <View style={styles.timelineDetailsBlock}>
                    <Text style={styles.timelineStepTitle}>Parisian Kitchen Baking</Text>
                    <Text style={styles.timelineStepDesc}>Sponges, ganaches & borders crafted at 2:00 AM.</Text>
                  </View>
                </View>

                {/* Step 3 */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineConnectorLine} />
                  <View style={styles.timelineStepIndicator}>
                    <View style={styles.timelineStepDotInner} />
                  </View>
                  <View style={styles.timelineDetailsBlock}>
                    <Text style={styles.timelineStepTitle}>Refrigerated Transport Dispatch</Text>
                    <Text style={styles.timelineStepDesc}>Departure from Rue Royale showroom scheduled.</Text>
                  </View>
                </View>

                {/* Step 4 */}
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineStepIndicator, { marginBottom: 0 }]}>
                    <View style={styles.timelineStepDotInner} />
                  </View>
                  <View style={styles.timelineDetailsBlock}>
                    <Text style={styles.timelineStepTitle}>Unboxing & Handover</Text>
                    <Text style={styles.timelineStepDesc}>Expected arrival: {selectedDate} ({selectedTimeSlot === 'morning' ? '09:00 - 12:00' : selectedTimeSlot === 'afternoon' ? '14:00 - 17:00' : '18:00 - 21:00'}).</Text>
                  </View>
                </View>

              </View>

              {/* Safe Reassurance Info Bar */}
              <View style={styles.successReassuranceBar}>
                <ShieldCheck size={14} color="#D4A373" style={{ marginRight: 8 }} />
                <Text style={styles.successReassuranceText}>Settle securely on delivery unboxing check.</Text>
              </View>

              {/* Track Live Delivery or Back to Boutique */}
              <View style={{ width: '100%', gap: 10 }}>
                <Button 
                  title="Track Live Delivery 🚚"
                  onPress={handleTrackOrderFinal}
                  style={styles.successTrackBtn}
                />
                <TouchableOpacity 
                  style={styles.successSecondaryBtn}
                  onPress={handleConfirmOrderFinal}
                >
                  <Text style={styles.successSecondaryBtnText}>Return to Pastry Boutique</Text>
                </TouchableOpacity>
              </View>

            </GlassBox>
          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
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
  
  // Destination card style
  addressCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 14,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressNameLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#2C1B18',
  },
  addressValueLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
    marginTop: 1.5,
  },
  addressSubLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9.5,
    color: '#8C7A77',
    opacity: 0.7,
    marginTop: 2,
  },
  addressEditBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.25)',
    backgroundColor: '#FFFFFF',
  },
  addressEditText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10,
    color: '#D4A373',
  },

  // Map graphics styles
  mapContainer: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderColor: 'rgba(232, 211, 194, 0.3)',
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
  },
  markerCircleBoutique: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderColor: '#D4A373',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  markerCircleHome: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D4A373',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  markerLabelFrame: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(232, 211, 194, 0.5)',
    borderWidth: 0.5,
    paddingVertical: 2.5,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  markerLabelTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 7.5,
    color: '#8C7A77',
    letterSpacing: 0.3,
  },
  mapInfoBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'rgba(212, 163, 115, 0.4)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 0,
  },
  mapInfoText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 9,
    color: '#D4A373',
  },

  // Date picker style
  dateCarouselContainer: {
    gap: 8,
    paddingRight: 28,
  },
  dateCardTouch: {
    width: 66,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dateCardGlass: {
    borderRadius: 16,
    paddingVertical: 10,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  dateCardActive: {
    borderColor: '#D4A373',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  tomorrowBadge: {
    position: 'absolute',
    top: 4,
    backgroundColor: '#D4A373',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  tomorrowBadgeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 6,
    color: '#FFFFFF',
  },
  dateDayName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#8C7A77',
  },
  dateDayNum: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#2C1B18',
    marginVertical: 1,
  },
  dateMonth: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9,
    color: '#8C7A77',
  },
  dateDayActiveText: {
    color: '#D4A373',
  },

  // Time Slot Selection
  timeSlotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timeSlotTouch: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  timeSlotGlass: {
    borderRadius: 14,
    paddingVertical: 10,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
  },
  timeSlotActive: {
    borderColor: '#D4A373',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  timeSlotLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#8C7A77',
  },
  timeSlotHours: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.8,
    marginTop: 2,
  },
  timeSlotActiveText: {
    color: '#D4A373',
  },

  // Cash on Delivery Card
  paymentCard: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 14,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentTitleLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#2C1B18',
  },
  paymentSubtitleLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#8C7A77',
    marginTop: 1,
  },
  paymentCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D4A373',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentIntroText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    lineHeight: 15,
    marginTop: 12,
  },
  cardLogoContainerRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  cardLogoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 0.5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cardLogoBadgeText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 8.5,
    color: '#8C7A77',
  },

  // Order summary cards style
  summaryContainer: {
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: 14,
  },
  summaryDivider: {
    height: 0.5,
    backgroundColor: 'rgba(232, 211, 194, 0.3)',
    marginVertical: 12,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItemTitleBlock: {
    flex: 1,
  },
  summaryItemTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12.5,
    color: '#2C1B18',
  },
  summaryItemMeta: {
    fontFamily: 'Poppins-Medium',
    fontSize: 10.5,
    color: '#8C7A77',
    marginTop: 1,
  },
  summaryItemDetails: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9.5,
    color: '#8C7A77',
    opacity: 0.75,
    marginTop: 2,
  },
  summaryItemRightBlock: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  summaryItemQty: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
  },
  summaryItemPrice: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12.5,
    color: '#D4A373',
    marginTop: 2,
  },

  // Sticky footer summary details
  pricingSummaryStickyPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(232, 211, 194, 0.35)',
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 18,
  },
  breakdownList: {
    gap: 4,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
  },
  breakdownValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#2C1B18',
  },
  grandTotalLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#2C1B18',
  },
  grandTotalValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#D4A373',
  },
  placeOrderBtn: {
    width: '100%',
    height: 48,
  },

  // Success Confirmation Modal Overlay Styling
  successFullOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(61, 44, 41, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  envelopeWrapper: {
    width: width * 0.9,
    maxHeight: height * 0.84,
    borderRadius: 32,
    overflow: 'hidden',
  },
  envelopeGlassInner: {
    borderWidth: 0,
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    alignItems: 'center',
  },
  goldWaxRibbonBlock: {
    alignItems: 'center',
    position: 'relative',
    height: 94,
    width: 140,
    justifyContent: 'center',
    marginBottom: 10,
  },
  ribbonBandLeft: {
    position: 'absolute',
    left: '20%',
    width: 14,
    height: '100%',
    backgroundColor: 'rgba(212, 163, 115, 0.25)',
    transform: [{ rotate: '-12deg' }],
  },
  ribbonBandRight: {
    position: 'absolute',
    right: '20%',
    width: 14,
    height: '100%',
    backgroundColor: 'rgba(212, 163, 115, 0.25)',
    transform: [{ rotate: '12deg' }],
  },
  waxSealStampBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderColor: 'rgba(212, 163, 115, 0.25)',
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 2,
  },
  waxSealStampGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMainTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#2C1B18',
    textAlign: 'center',
    marginTop: 4,
  },
  successSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    color: '#8C7A77',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 6,
    paddingHorizontal: 10,
  },
  refCodeContainer: {
    alignItems: 'center',
    marginVertical: 14,
    paddingVertical: 6,
    paddingHorizontal: 22,
    borderWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(212, 163, 115, 0.45)',
    borderRadius: 14,
    backgroundColor: 'rgba(212, 163, 115, 0.03)',
  },
  refCodeLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 8,
    color: '#8C7A77',
    opacity: 0.7,
    letterSpacing: 1,
  },
  refCodeValue: {
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#C59567',
    letterSpacing: 1.5,
    marginTop: 1,
  },
  timelineTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    color: '#2C1B18',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  timelineDeck: {
    width: '100%',
    paddingLeft: 6,
    marginBottom: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    paddingBottom: 14,
  },
  timelineConnectorLine: {
    position: 'absolute',
    left: 7.5,
    top: 14,
    width: 1,
    bottom: 0,
    backgroundColor: 'rgba(212, 163, 115, 0.25)',
  },
  timelineStepIndicatorActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4A373',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 1.5,
  },
  timelineStepIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(212, 163, 115, 0.5)',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 1.5,
  },
  timelineStepDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(212, 163, 115, 0.4)',
  },
  timelineDetailsBlock: {
    flex: 1,
    marginLeft: 12,
  },
  timelineStepTitleActive: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
    color: '#2C1B18',
  },
  timelineStepTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 11,
    color: '#8C7A77',
  },
  timelineStepDesc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 9,
    color: '#8C7A77',
    opacity: 0.85,
    lineHeight: 11,
    marginTop: 1.5,
  },
  successReassuranceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.05)',
    borderColor: 'rgba(212, 163, 115, 0.25)',
    borderWidth: 0.5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignSelf: 'center',
  },
  successReassuranceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 9.5,
    color: '#D4A373',
  },
  successReturnBtn: {
    width: '100%',
    height: 44,
  },
  successTrackBtn: {
    width: '100%',
    height: 44,
  },
  successSecondaryBtn: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(44, 27, 24, 0.15)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successSecondaryBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    color: '#2C1B18',
  }
});
