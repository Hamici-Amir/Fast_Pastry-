import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { GlassBox } from '../src/components/ui/GlassBox';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  PhoneCall, 
  MessageCircle, 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  FileText,
  HelpCircle,
  CheckCircle
} from 'lucide-react-native';
import { DriverTabBar } from '../src/components/navigation/DriverTabBar';
import { AppHeader } from '../src/components/common/AppHeader';

const { width } = Dimensions.get('window');

// MOCK DATA
const DELIVERY = {
  id: '#5092',
  status: 'IN TRANSIT',
  cake: {
    name: 'Three-Tier Vanilla Rose',
    customization: 'Extra gold flakes, handwritten "Happy Anniversary" card.',
    quantity: 1,
    value: '$340.00',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop'
  },
  customer: {
    name: 'Jessica Thompson',
    phone: '+1 (555) 019-2834',
    initials: 'JT'
  },
  destination: {
    address: '4200 Luxury Avenue, Suite 14B',
    city: 'Beverly Hills, CA 90210',
    coordinates: '34.0736° N, 118.4004° W',
    distance: '2.4 miles remaining'
  },
  notes: 'Gate code is 4921. Please leave with the concierge at the front desk.',
  handling: 'EXTREMELY FRAGILE. Do not tilt. Keep vehicle AC on maximum cold.'
};

export default function DriverDeliveryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject} className="bg-background" />
      
      {/* CAKE PREVIEW BACKGROUND */}
      <View style={styles.heroBackground}>
        <Image source={{ uri: DELIVERY.cake.image }} style={styles.heroImage} blurRadius={8} />
        <LinearGradient 
          colors={['rgba(255, 248, 242, 0.2)', 'rgba(255, 248, 242, 0.85)', '#FFF8F2']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader 
          title={DELIVERY.id}
          subtitle={DELIVERY.status}
          showBack
          onBackPress={() => router.back()}
          showBell
        />

        {/* CAKE DETAILS */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.cakeSection}>
          <Image source={{ uri: DELIVERY.cake.image }} style={styles.cakeImageMain} />
          <View style={styles.cakeInfoBox}>
            <View style={styles.cakeTitleRow}>
              <Text style={styles.cakeName}>{DELIVERY.cake.name}</Text>
              <Text style={styles.cakeValue}>{DELIVERY.cake.value}</Text>
            </View>
            <Text style={styles.cakeQty}>{t('cart:quantity')}: {DELIVERY.cake.quantity}</Text>
            <View style={styles.customizationBox}>
              <Text style={styles.customText}>"{DELIVERY.cake.customization}"</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.contentPadding}>
          {/* CUSTOMER SECTION */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)}>
            <GlassBox intensity={20} tint="dark" style={styles.customerCard}>
              <View style={styles.customerLeft}>
                <View style={styles.avatarWrap}>
                  <Text style={styles.avatarText}>{DELIVERY.customer.initials}</Text>
                </View>
                <View>
                  <Text style={styles.customerName}>{DELIVERY.customer.name}</Text>
                  <Text style={styles.customerPhone}>{DELIVERY.customer.phone}</Text>
                </View>
              </View>
              <View style={styles.customerActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <MessageCircle size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnGold}>
                  <PhoneCall size={20} color="#18181A" />
                </TouchableOpacity>
              </View>
            </GlassBox>
          </Animated.View>

          {/* DESTINATION SECTION */}
          <Animated.View entering={FadeInDown.duration(600).delay(300)}>
            <Text style={styles.sectionTitle}>{t('orders:delivery_address').toUpperCase()}</Text>
            <GlassBox intensity={20} tint="dark" style={styles.addressCard}>
              <View style={styles.mapPreview}>
                {/* Simulated Map Background */}
                <LinearGradient colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.mapRouteLine} />
                <View style={styles.mapPinBox}>
                  <MapPin size={24} color="#EF4444" />
                </View>
              </View>
              
              <View style={styles.addressInfoBox}>
                <Text style={styles.addressPrimary}>{DELIVERY.destination.address}</Text>
                <Text style={styles.addressSecondary}>{DELIVERY.destination.city}</Text>
                <Text style={styles.coordinates}>{DELIVERY.destination.coordinates}</Text>
              </View>

              <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient colors={['rgba(212, 163, 115, 0.15)', 'rgba(212, 163, 115, 0.05)']} style={styles.navOutlineBtn}>
                  <Navigation size={18} color="#D4A373" style={{ marginRight: 8 }} />
                  <Text style={styles.navOutlineText}>{t('driver:navigate').toUpperCase()} ({DELIVERY.destination.distance})</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GlassBox>
          </Animated.View>

          {/* NOTES SECTION */}
          <Animated.View entering={FadeInDown.duration(600).delay(400)}>
            <Text style={styles.sectionTitle}>{t('driver:notes').toUpperCase()}</Text>
            <GlassBox intensity={15} tint="dark" style={styles.notesCard}>
              <View style={styles.noteRow}>
                <FileText size={20} color="#60A5FA" style={{ marginTop: 2 }} />
                <View style={styles.noteContent}>
                  <Text style={styles.noteLabel}>{t('driver:customer')} Note</Text>
                  <Text style={styles.noteText}>{DELIVERY.notes}</Text>
                </View>
              </View>

              <View style={styles.noteDivider} />

              <View style={styles.noteRow}>
                <AlertTriangle size={20} color="#FBBF24" style={{ marginTop: 2 }} />
                <View style={styles.noteContent}>
                  <Text style={styles.noteLabelWarn}>Handling Warnings</Text>
                  <Text style={styles.noteTextWarn}>{DELIVERY.handling}</Text>
                </View>
              </View>
            </GlassBox>
          </Animated.View>

          {/* ARRIVAL ACTION */}
          <Animated.View entering={FadeInDown.duration(600).delay(500)} style={styles.arrivalSection}>
            <TouchableOpacity activeOpacity={0.9} style={styles.arriveBtnWrap}>
              <LinearGradient colors={['#D4A373', '#B8860B']} style={styles.arriveBtn}>
                <CheckCircle size={24} color="#18181A" style={{ marginRight: 12 }} />
                <Text style={styles.arriveText}>{t('driver:mark_delivered').toUpperCase()}</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.reportBtn}>
              <Text style={styles.reportText}>{t('common:error')}</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>

      {/* FLOATING TAB BAR */}
      <DriverTabBar activeTab={activeTab} onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'orders') router.back();
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 400,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerCenter: {
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    marginBottom: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 10,
    color: '#4ADE80',
    letterSpacing: 1,
  },
  orderId: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  helpBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cakeSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  cakeImageMain: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  cakeInfoBox: {
    paddingHorizontal: 8,
  },
  cakeTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cakeName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    color: '#2C1B18',
    flex: 1,
  },
  cakeValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#D4A373',
  },
  cakeQty: {
    fontFamily: 'Cairo-SemiBold',
    fontSize: 13,
    color: '#8C7A77',
    marginBottom: 12,
  },
  customizationBox: {
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4A373',
  },
  customText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 13,
    color: '#2C1B18',
    fontStyle: 'italic',
  },
  contentPadding: {
    paddingHorizontal: 20,
  },
  customerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
  },
  customerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  avatarText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#D4A373',
  },
  customerName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#2C1B18',
    marginBottom: 2,
  },
  customerPhone: {
    fontFamily: 'Cairo-Regular',
    fontSize: 13,
    color: '#8C7A77',
  },
  customerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.2)',
  },
  actionBtnGold: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4A373',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    color: '#D4A373',
    letterSpacing: 2,
    marginBottom: 12,
    marginLeft: 4,
  },
  addressCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 32,
    overflow: 'hidden',
  },
  mapPreview: {
    height: 120,
    backgroundColor: 'rgba(212, 163, 115, 0.06)',
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.1)',
  },
  mapRouteLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(212, 163, 115, 0.3)',
    top: '50%',
    transform: [{ rotate: '15deg' }],
  },
  mapPinBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  addressInfoBox: {
    marginBottom: 16,
  },
  addressPrimary: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#2C1B18',
    marginBottom: 4,
  },
  addressSecondary: {
    fontFamily: 'Cairo-Medium',
    fontSize: 14,
    color: '#8C7A77',
    marginBottom: 6,
  },
  coordinates: {
    fontFamily: 'Cairo-Medium',
    fontSize: 11,
    color: '#D4A373',
  },
  navOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  navOutlineText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
    color: '#D4A373',
    letterSpacing: 1,
  },
  notesCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 40,
  },
  noteRow: {
    flexDirection: 'row',
  },
  noteContent: {
    flex: 1,
    marginLeft: 16,
  },
  noteLabel: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#60A5FA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  noteText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 14,
    color: '#2C1B18',
    lineHeight: 22,
  },
  noteDivider: {
    height: 1,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    marginVertical: 16,
  },
  noteLabelWarn: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#FBBF24',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  noteTextWarn: {
    fontFamily: 'Cairo-Medium',
    fontSize: 14,
    color: '#FBBF24',
    lineHeight: 22,
  },
  arrivalSection: {
    marginBottom: 20,
  },
  arriveBtnWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  arriveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  arriveText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#18181A',
    letterSpacing: 1.5,
  },
  reportBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  reportText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#8C7A77',
    textDecorationLine: 'underline',
  }
});
