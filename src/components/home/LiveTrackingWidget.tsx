import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Truck, ChevronRight, Thermometer } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { theme } from '../../theme';
import { GlassBox } from '../ui/GlassBox';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export const LiveTrackingWidget: React.FC = () => {
  const router = useRouter();

  // Shared animation values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  const progressPercent = useSharedValue(0);

  useEffect(() => {
    // Pulsing live track light
    pulseScale.value = withRepeat(
      withTiming(1.6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Progress bar loop
    progressPercent.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressPercent.value * 100}%`,
  }));

  const animatedVanStyle = useAnimatedStyle(() => ({
    left: `${progressPercent.value * 100}%`,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/tracking' as any);
  };

  return (
    <TouchableOpacity 
      style={styles.outerWrapper}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {/* Subtle Ambient Glow */}
      <View style={styles.ambientGlow} />

      <GlassBox intensity={95} style={styles.glassContainer}>
        {/* Header Block: Title + Pulse + Sleek Arrow */}
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <View style={styles.truckIconWrapper}>
              <Truck size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.titleText}>White-Glove Dispatch</Text>
          </View>
          
          <View style={styles.rightHeaderBlock}>
            <View style={styles.livePulseContainer}>
              <Animated.View style={[styles.livePulseRing, animatedPulseStyle]} />
              <View style={styles.livePulseDot} />
              <Text style={styles.livePulseText}>LIVE</Text>
            </View>
            <ChevronRight size={14} color="#8C7A77" style={{ marginLeft: 6 }} />
          </View>
        </View>

        {/* Narrative Description (Compact Single-line style) */}
        <View style={styles.infoRow}>
          <Text style={styles.narrativeText}>
            <Text style={styles.boldCourierName}>Jean-Pierre D.</Text> is en route with your custom orders.
          </Text>
          
          <View style={styles.tempBadge}>
            <Thermometer size={10} color="#D4A373" style={{ marginRight: 2 }} />
            <Text style={styles.tempText}>3.6°C</Text>
          </View>
        </View>

        {/* Compact Miniature Progress Road */}
        <View style={styles.trackerRoad}>
          <View style={styles.roadLineBackground} />
          <Animated.View style={[styles.roadLineActive, animatedProgressStyle]} />
          
          {/* Miniature Floating Van */}
          <Animated.View style={[styles.miniVanCapsule, animatedVanStyle]}>
            <View style={styles.vanIconCircle}>
              <Truck size={6} color="#FFFFFF" />
            </View>
            <View style={styles.vanPulseIndicator} />
          </Animated.View>

          {/* Boutique Start & Home End Icons */}
          <View style={[styles.endpointCircle, { left: 0 }]}>
            <Text style={styles.endpointEmoji}>⚜️</Text>
          </View>
          <View style={[styles.endpointCircle, { right: 0 }]}>
            <Text style={styles.endpointEmoji}>📍</Text>
          </View>
        </View>
      </GlassBox>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    marginHorizontal: 20,
    marginVertical: 8,
    position: 'relative',
  },
  ambientGlow: {
    position: 'absolute',
    top: '15%',
    left: '15%',
    width: '70%',
    height: '70%',
    borderRadius: 20,
    backgroundColor: '#FADADD',
    opacity: 0.25,
    filter: 'blur(15px)',
    zIndex: -1,
  },
  glassContainer: {
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: 'rgba(232, 211, 194, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  truckIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#D4A373',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11.5,
    color: '#2C1B18',
  },
  rightHeaderBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  livePulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(224, 109, 109, 0.08)',
    borderColor: 'rgba(224, 109, 109, 0.25)',
    borderWidth: 0.5,
    paddingVertical: 1.5,
    paddingHorizontal: 5,
    borderRadius: 6,
    position: 'relative',
  },
  livePulseRing: {
    position: 'absolute',
    left: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E06D6D',
  },
  livePulseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E06D6D',
    marginRight: 4,
    marginLeft: 1,
  },
  livePulseText: {
    fontFamily: 'Cairo-Bold',
    fontSize: 7,
    color: '#E06D6D',
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  narrativeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#8C7A77',
    flex: 1,
    paddingRight: 6,
  },
  boldCourierName: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2C1B18',
  },
  tempBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 163, 115, 0.06)',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderColor: 'rgba(212, 163, 115, 0.2)',
    borderWidth: 0.5,
  },
  tempText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 8.5,
    color: '#D4A373',
  },
  trackerRoad: {
    position: 'relative',
    height: 14,
    width: '100%',
    justifyContent: 'center',
  },
  roadLineBackground: {
    position: 'absolute',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: 'rgba(44, 27, 24, 0.04)',
    borderRadius: 1,
  },
  roadLineActive: {
    position: 'absolute',
    left: 8,
    height: 2,
    backgroundColor: 'rgba(212, 163, 115, 0.25)',
    borderRadius: 1,
  },
  miniVanCapsule: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    marginLeft: -5,
  },
  vanIconCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4A373',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  vanPulseIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 5,
    backgroundColor: 'rgba(212, 163, 115, 0.4)',
    zIndex: 1,
  },
  endpointCircle: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(232, 211, 194, 0.4)',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endpointEmoji: {
    fontSize: 7.5,
  },
});
