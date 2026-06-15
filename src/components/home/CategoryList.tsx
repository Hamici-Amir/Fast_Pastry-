import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { GlassBox } from '../ui/GlassBox';

const CATEGORIES = [
  'All', 'Signature', 'Wedding', 'Boutique', 'Vegan', 'Minimal', 'Festive'
];

export const CategoryList: React.FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState('All');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('home:categories')}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat, i) => {
          const isActive = active === cat;
          return (
            <CategoryPill 
              key={cat}
              label={cat}
              isActive={isActive}
              onPress={() => {
                setActive(cat);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const CategoryPill = ({ label, isActive, onPress }: { label: string, isActive: boolean, onPress: () => void }) => {
  const scale = useSharedValue(1);
  
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isActive ? 1.05 : 1) }]
  }));

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={onPress}
      style={styles.pillTouch}
    >
      <Animated.View style={[styles.pillContainer, animStyle]}>
        <GlassBox 
          intensity={isActive ? 85 : 20}
          style={[
            styles.glass,
            isActive && styles.activeGlass
          ]}
        >
          {isActive && (
            <View style={styles.patternOverlay}>
               <View style={styles.ornamentLine} />
            </View>
          )}
          <Text style={[
            styles.label,
            isActive && styles.activeLabel
          ]}>
            {label}
          </Text>
        </GlassBox>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  pillTouch: {
    marginRight: 4,
  },
  pillContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  glass: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderColor: 'rgba(232, 211, 194, 0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 0,
  },
  activeGlass: {
    borderColor: 'rgba(212, 163, 115, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  patternOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    alignItems: 'center',
  },
  ornamentLine: {
    width: 20,
    height: 1.5,
    backgroundColor: '#D4A373',
    borderRadius: 2,
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#2C1B18',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#8C7A77',
    letterSpacing: 0.3,
  },
  activeLabel: {
    fontFamily: 'Poppins-Bold',
    color: '#2C1B18',
  }
});
