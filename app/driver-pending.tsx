import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp, withRepeat, withTiming, useSharedValue, useAnimatedStyle, Easing, withSequence, withDelay } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassBox } from '../src/components/ui/GlassBox';
import { useRouter } from 'expo-router';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  Car, 
  Shield, 
  HeadphonesIcon, 
  LogOut,
  Edit3
} from 'lucide-react-native';

import { AppHeader } from '../src/components/common/AppHeader';

const { width } = Dimensions.get('window');

const DOCUMENTS = [
  { id: 1, title: 'Identity Card', icon: CreditCard, status: 'verified', color: '#4ADE80' },
  { id: 2, title: 'Driving License', icon: FileText, status: 'verified', color: '#4ADE80' },
  { id: 3, title: 'Vehicle Reg.', icon: Car, status: 'reviewing', color: '#FBBF24' },
  { id: 4, title: 'Insurance Proof', icon: Shield, status: 'reviewing', color: '#FBBF24' },
];

export default function DriverPendingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Floating animation for the hero shield
  const floatY = useSharedValue(0);
  
  // Pulse animation for the glowing ring
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    pulseScale.value = withRepeat(
      withTiming(1.4, { duration: 2500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const animatedFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }]
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject} className="bg-background" />
      
      {/* Premium Cinematic Glow */}
      <View pointerEvents="none" style={[styles.ambientGlow, { top: -50, left: width / 2 - 200, backgroundColor: 'rgba(212, 163, 115, 0.15)' }]} />

      <AppHeader 
        title="Fleet Onboarding" 
        subtitle="Verification Phase" 
        showBell 
      />

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.heroSection}>
          <View style={styles.shieldWrapper}>
            <Animated.View style={[styles.pulseRing, animatedPulseStyle]} />
            <Animated.View style={[styles.shieldInner, animatedFloatStyle]}>
              <LinearGradient colors={['rgba(212, 163, 115, 0.2)', 'rgba(212, 163, 115, 0.05)']} style={styles.shieldGradient}>
                <ShieldCheck size={48} color="#D4A373" strokeWidth={1.5} />
              </LinearGradient>
            </Animated.View>
          </View>
          
          <Text style={styles.heroTitle}>Application Submitted</Text>
          <Text style={styles.heroSubtitle}>
            Welcome to the elite fleet. Our review team is currently verifying your exclusive profile.
          </Text>
        </Animated.View>

        {/* PROGRESS TRACKER */}
        <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.trackerSection}>
          <Text style={styles.sectionHeader}>VERIFICATION STATUS</Text>
          <GlassBox intensity={20} tint="dark" style={styles.trackerCard}>
            
            <View style={styles.trackStep}>
              <View style={styles.trackIconBoxDone}>
                <CheckCircle2 size={16} color="#4ADE80" />
              </View>
              <View style={styles.trackLineDone} />
              <View style={styles.trackContent}>
                <Text style={styles.trackTitleDone}>Application Received</Text>
                <Text style={styles.trackDesc}>All forms successfully submitted.</Text>
              </View>
            </View>

            <View style={styles.trackStep}>
              <View style={styles.trackIconBoxActive}>
                <Clock size={16} color="#D4A373" />
              </View>
              <View style={styles.trackLinePending} />
              <View style={styles.trackContent}>
                <Text style={styles.trackTitleActive}>Document Review</Text>
                <Text style={styles.trackDescActive}>Verifying your logistics credentials.</Text>
              </View>
            </View>

            <View style={[styles.trackStep, { marginBottom: 0 }]}>
              <View style={styles.trackIconBoxPending}>
                <Shield size={16} color="#8E99A8" />
              </View>
              <View style={styles.trackContent}>
                <Text style={styles.trackTitlePending}>Final Approval</Text>
                <Text style={styles.trackDesc}>HQ activating your driver profile.</Text>
              </View>
            </View>

          </GlassBox>
        </Animated.View>

        {/* DOCUMENTS SECTION */}
        <Animated.View entering={FadeInDown.duration(800).delay(400)} style={styles.docsSection}>
          <View style={styles.docsHeaderRow}>
            <Text style={styles.sectionHeader}>UPLOADED DOCUMENTS</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Edit3 size={12} color="#D4A373" />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.docsGrid}>
            {DOCUMENTS.map((doc, index) => (
              <GlassBox key={doc.id} intensity={15} tint="dark" style={styles.docCard}>
                <View style={styles.docIconWrap}>
                  <doc.icon size={24} color="#FFFFFF" strokeWidth={1.5} />
                  {doc.status === 'verified' ? (
                    <View style={styles.docBadgeSuccess}>
                      <CheckCircle2 size={12} color="#FFFFFF" />
                    </View>
                  ) : (
                    <View style={styles.docBadgePending}>
                      <Clock size={12} color="#18181A" />
                    </View>
                  )}
                </View>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={[styles.docStatus, { color: doc.color }]}>
                  {doc.status === 'verified' ? 'Verified' : 'In Review'}
                </Text>
              </GlassBox>
            ))}
          </View>
        </Animated.View>

        {/* ESTIMATED TIME */}
        <Animated.View entering={FadeInDown.duration(800).delay(600)} style={styles.estimateSection}>
          <LinearGradient colors={['rgba(212, 163, 115, 0.1)', 'transparent']} style={styles.estimateCard}>
            <View style={styles.estimateIconRow}>
              <Clock size={20} color="#D4A373" />
              <Text style={styles.estimateTitle}>Estimated Approval Time</Text>
            </View>
            <Text style={styles.estimateValue}>24 - 48 Hours</Text>
            <Text style={styles.estimateDesc}>
              We prioritize premium fleet members. You will receive an SMS and Email the moment your account goes live.
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* QUICK ACTIONS */}
        <Animated.View entering={FadeInUp.duration(800).delay(800)} style={styles.actionsSection}>
          <TouchableOpacity style={styles.supportBtn} activeOpacity={0.8}>
            <LinearGradient colors={['#D4A373', '#B8860B']} style={styles.supportGradient}>
              <HeadphonesIcon size={20} color="#1C1C1E" style={{ marginRight: 8 }} />
              <Text style={styles.supportBtnText}>CONTACT FLEET SUPPORT</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
            <LogOut size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.logoutBtnText}>Sign Out Safely</Text>
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
  ambientGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  shieldWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(212, 163, 115, 0.4)',
  },
  shieldInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF8F2',
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    overflow: 'hidden',
  },
  shieldGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: '#2C1B18',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontFamily: 'Cairo-Regular',
    fontSize: 14,
    color: '#8C7A77',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  sectionHeader: {
    fontFamily: 'Cairo-Bold',
    fontSize: 12,
    color: '#D4A373',
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  trackerSection: {
    marginBottom: 32,
  },
  trackerCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  trackStep: {
    flexDirection: 'row',
    marginBottom: 32,
    position: 'relative',
  },
  trackIconBoxDone: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    marginRight: 16,
    zIndex: 2,
  },
  trackIconBoxActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 163, 115, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4A373',
    marginRight: 16,
    zIndex: 2,
  },
  trackIconBoxPending: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    marginRight: 16,
    zIndex: 2,
  },
  trackLineDone: {
    position: 'absolute',
    top: 32,
    left: 15,
    width: 2,
    height: 48,
    backgroundColor: '#4ADE80',
    zIndex: 1,
  },
  trackLinePending: {
    position: 'absolute',
    top: 32,
    left: 15,
    width: 2,
    height: 48,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    zIndex: 1,
  },
  trackContent: {
    flex: 1,
    justifyContent: 'center',
  },
  trackTitleDone: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#2C1B18',
    marginBottom: 2,
  },
  trackTitleActive: {
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
    color: '#D4A373',
    marginBottom: 2,
  },
  trackTitlePending: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: '#8C7A77',
    marginBottom: 2,
  },
  trackDesc: {
    fontFamily: 'Cairo-Regular',
    fontSize: 13,
    color: '#8C7A77',
  },
  trackDescActive: {
    fontFamily: 'Cairo-Medium',
    fontSize: 13,
    color: '#2C1B18',
  },
  docsSection: {
    marginBottom: 32,
  },
  docsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.3)',
  },
  editBtnText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
    color: '#D4A373',
    marginLeft: 4,
  },
  docsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  docCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  docIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(212, 163, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.2)',
    position: 'relative',
  },
  docBadgeSuccess: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#4ADE80',
    borderRadius: 8,
    padding: 2,
    borderWidth: 2,
    borderColor: '#FFF8F2',
  },
  docBadgePending: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FBBF24',
    borderRadius: 8,
    padding: 2,
    borderWidth: 2,
    borderColor: '#FFF8F2',
  },
  docTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
    color: '#2C1B18',
    marginBottom: 4,
  },
  docStatus: {
    fontFamily: 'Cairo-Bold',
    fontSize: 11,
  },
  estimateSection: {
    marginBottom: 40,
  },
  estimateCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 163, 115, 0.2)',
  },
  estimateIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  estimateTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#D4A373',
    marginLeft: 8,
  },
  estimateValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#2C1B18',
    marginBottom: 8,
  },
  estimateDesc: {
    fontFamily: 'Cairo-Regular',
    fontSize: 13,
    color: '#8C7A77',
    lineHeight: 20,
  },
  actionsSection: {
    gap: 16,
  },
  supportBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  supportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  supportBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutBtnText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#EF4444',
  }
});
