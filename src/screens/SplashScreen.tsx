import React, { useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Image, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Heart } from 'lucide-react-native';
import { GlassBox } from '../components/ui/GlassBox';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

// Import the generated hyper-realistic luxury cake image
const luxuryCakeImg = require('../../assets/images/luxury_cake.png');

// Gold Dust / Floating Sparkle Particle Component using Native Animated
const GoldDustParticle = ({ delay, startX, startY }: { delay: number, startX: number, startY: number }) => {
  const animatedY = useRef(new Animated.Value(0)).current;
  const animatedX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = Math.random() * 0.4 + 0.3;

  useEffect(() => {
    // Upward motion loop
    Animated.loop(
      Animated.timing(animatedY, {
        toValue: -height * 0.8,
        duration: 6000 + Math.random() * 3000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay,
      })
    ).start();

    // Side-to-side sway loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedX, {
          toValue: 30,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedX, {
          toValue: -30,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Fade in and out loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 4500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.goldParticleDot,
        {
          position: 'absolute',
          left: startX,
          top: startY,
          transform: [
            { translateX: animatedX },
            { translateY: animatedY },
            { scale }
          ],
          opacity: opacity,
        }
      ]} 
    />
  );
};

export const SplashScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Animation controller values using refs
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const auraScale = useRef(new Animated.Value(0.8)).current;
  const auraOpacity = useRef(new Animated.Value(0.15)).current;
  
  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardTranslateY = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardFloatY = useRef(new Animated.Value(0)).current;
  
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(15)).current;
  
  const goldProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Background Cinematic Fade-in
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // 2. Ambient Glow Pulse Loop
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(auraScale, {
            toValue: 1.15,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(auraScale, {
            toValue: 0.9,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(auraOpacity, {
            toValue: 0.3,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(auraOpacity, {
            toValue: 0.15,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ])
    ).start();

    // 3. Central Premium Pastry Card Appearance
    Animated.parallel([
      Animated.timing(cardScale, {
        toValue: 1,
        duration: 1400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
        delay: 300,
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 1400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
        delay: 300,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        delay: 300,
      })
    ]).start(() => {
      // 4. Start Idle Breathing Float on Card
      Animated.loop(
        Animated.sequence([
          Animated.timing(cardFloatY, {
            toValue: -8,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(cardFloatY, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    });

    // 5. Luxury Typography Sequential Reveal
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        delay: 1000,
      }),
      Animated.timing(textTranslateY, {
        toValue: 0,
        duration: 1200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay: 1000,
      })
    ]).start();

    // 6. Sleek Gold Progress Bar Loader
    Animated.timing(goldProgress, {
      toValue: 1,
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // width/percentage layouts don't support native driver
    }).start();

    // 7. Finish Callback with smooth screen exit fade
    if (onFinish) {
      const timer = setTimeout(() => {
        // Smoothly fade everything out before transitioning
        Animated.parallel([
          Animated.timing(bgOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(cardOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          Animated.timing(textOpacity, { toValue: 0, duration: 400, useNativeDriver: true })
        ]).start(() => {
          onFinish();
        });
      }, 4800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Map progress bar scale width
  const progressWidth = goldProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill, 
        styles.mainContainer, 
        { opacity: bgOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }
      ]}
    >
      {/* Luxury Layered Gradients */}
      <LinearGradient
        colors={['#FFF8F2', '#FFF0EA', '#FADADD', '#FFF8F2']}
        locations={[0, 0.4, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Ambient Radial Soft Glowing Circles */}
      <Animated.View 
        style={[
          styles.glowAuraPink, 
          { transform: [{ scale: auraScale }], opacity: auraOpacity }
        ]} 
      />
      <Animated.View 
        style={[
          styles.glowAuraGold, 
          { 
            transform: [
              { scale: Animated.multiply(auraScale, 0.8) }, 
              { rotate: '45deg' }
            ], 
            opacity: Animated.multiply(auraOpacity, 0.8) 
          }
        ]} 
      />

      {/* Floating Gold Dust Particles */}
      {[...Array(12)].map((_, i) => (
        <GoldDustParticle 
          key={i} 
          delay={i * 300} 
          startX={Math.random() * width} 
          startY={height * 0.8 + Math.random() * 100} 
        />
      ))}

      {/* Main Structural Wrapper with Dynamic Notch Safe Inset */}
      <View 
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: Math.max(insets.top + 10, 30),
          paddingBottom: Math.max(insets.bottom + 15, 30),
          paddingHorizontal: 40,
          width: '100%',
          height: '100%',
        }}
      >
        
        {/* Top Header Badge */}
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderTagline}>
            HAUTE PÂTISSERIE
          </Text>
        </View>

        {/* Central Luxury Pastry Card */}
        <Animated.View 
          style={[
            styles.cardContainer, 
            { 
              opacity: cardOpacity,
              transform: [
                { scale: cardScale },
                { translateY: Animated.add(cardTranslateY, cardFloatY) }
              ]
            }
          ]}
        >
          <View style={styles.cardGlowContainer}>
            <GlassBox intensity={35} style={styles.premiumCardWrapper} tint="light">
              <View style={styles.innerGlassFrame}>
                <Image 
                  source={luxuryCakeImg} 
                  style={styles.pastryImage} 
                  resizeMode="contain" 
                />
              </View>
            </GlassBox>
            
            {/* Soft Sparkle Overlay */}
            <View style={styles.sparkleBadge}>
              <Sparkles size={18} color="#D4A373" strokeWidth={1.5} />
            </View>
          </View>
        </Animated.View>

        {/* Elegant Bottom Section: Brand Identity & Loader */}
        <Animated.View 
          style={[
            styles.bottomContainer, 
            { 
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }]
            }
          ]}
        >
          {/* Main Brand Title with hyphenated Poppins font */}
          <Text style={styles.brandTitle}>
            FAST PASTRY
          </Text>
          
          {/* Brand Slogan */}
          <Text style={styles.brandSlogan}>
            {t('common:tagline')}
          </Text>

          {/* Premium Gold Visual Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerHeart}>
              <Heart size={8} color="#D4A373" fill="#D4A373" />
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* Progress Loader Area */}
          <View style={styles.loaderContainer}>
            {/* Ultra Thin Golden Progress Bar - Sizing strictly locked down */}
            <View style={styles.progressTrack}>
              <Animated.View 
                style={[styles.progressBarFill, { width: progressWidth }]} 
              />
            </View>
            
            <Text style={styles.loaderText}>
              {t('common:loading')}
            </Text>
          </View>

        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#FFF8F2',
  },
  topHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topHeaderTagline: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: '#D4A373',
    letterSpacing: 6,
    textAlign: 'center',
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  bottomContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  brandTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 32,
    color: '#2C1B18',
    letterSpacing: 14,
    textAlign: 'center',
    marginLeft: 14, // Perfect optical centering to account for letter spacing
  },
  brandSlogan: {
    fontFamily: 'Cairo-Medium',
    fontSize: 11,
    color: '#8C7A77',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    justifyContent: 'center',
    width: '100%',
  },
  dividerLine: {
    height: 0.5,
    width: 45,
    backgroundColor: 'rgba(212, 163, 115, 0.4)',
  },
  dividerHeart: {
    marginHorizontal: 12,
    opacity: 0.8,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  progressTrack: {
    height: 2,
    width: 200, // Strictly locked down width
    backgroundColor: 'rgba(232, 211, 194, 0.4)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#D4A373',
  },
  loaderText: {
    marginTop: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(140, 122, 119, 0.6)',
    letterSpacing: 3,
    fontSize: 8,
    textAlign: 'center',
  },
  glowAuraPink: {
    position: 'absolute',
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: (width * 1.1) / 2,
    backgroundColor: '#FADADD',
    top: height * 0.15,
    left: -width * 0.1,
    shadowColor: '#F8B6C8',
    shadowRadius: 100,
    shadowOpacity: 0.4,
    elevation: 5,
  },
  glowAuraGold: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: '#FFF0EA',
    bottom: height * 0.1,
    right: -width * 0.15,
    shadowColor: '#D4A373',
    shadowRadius: 120,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  goldParticleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D4A373',
  },
  cardGlowContainer: {
    shadowColor: '#D4A373',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 15,
  },
  premiumCardWrapper: {
    width: 190,
    height: 190,
    borderRadius: 95,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(212, 163, 115, 0.25)',
    borderWidth: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  innerGlassFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 95,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  pastryImage: {
    width: '88%',
    height: '88%',
  },
  sparkleBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 20,
    borderColor: 'rgba(212, 163, 115, 0.3)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
