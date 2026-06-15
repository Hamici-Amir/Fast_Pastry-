import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChefHat } from 'lucide-react-native';
import { AppHeader } from '../../src/components/common/AppHeader';
import { CakePreview } from '../../src/components/customizer/CakePreview';
import { OptionCard } from '../../src/components/customizer/OptionCard';
import { RadioOptionRow } from '../../src/components/customizer/RadioOptionRow';
import { ColorSwatchPicker } from '../../src/components/customizer/ColorSwatchPicker';
import { ToppingGrid } from '../../src/components/customizer/ToppingGrid';
import { PriceFooter } from '../../src/components/customizer/PriceFooter';
import api from '../../src/config/api';
import {
  DEFAULT_SIZES, DEFAULT_FLAVORS, DEFAULT_FROSTING_COLORS,
  DEFAULT_TOPPINGS, DEFAULT_TOPPERS,
  CustomizerSize, CustomizerFlavor, FrostingColor, Topping, Topper
} from '../../src/data/customizerDefaults';

export default function CustomizerScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [sizes, setSizes] = useState<CustomizerSize[]>(DEFAULT_SIZES);
  const [flavors, setFlavors] = useState<CustomizerFlavor[]>(DEFAULT_FLAVORS);
  const [frostingColors, setFrostingColors] = useState<FrostingColor[]>(DEFAULT_FROSTING_COLORS);
  const [toppings, setToppings] = useState<Topping[]>(DEFAULT_TOPPINGS);
  const [toppers, setToppers] = useState<Topper[]>(DEFAULT_TOPPERS);
  const [selectedSize, setSelectedSize] = useState<string>('single');
  const [selectedFlavor, setSelectedFlavor] = useState<string>('chocolate');
  const [selectedColor, setSelectedColor] = useState<string>('cream');
  const [activeToppings, setActiveToppings] = useState<string[]>([]);
  const [selectedTopper, setSelectedTopper] = useState<string>('none');
  const [computedPrice, setComputedPrice] = useState(60.00);
  const [orderingInProgress, setOrderingInProgress] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await api.get('/catalog/config');
        const data = response.data.data || {};
        if (data.sizes) setSizes(data.sizes);
        if (data.flavors) setFlavors(data.flavors);
        if (data.frostingColors) setFrostingColors(data.frostingColors);
        if (data.toppings) setToppings(data.toppings);
        if (data.toppers) setToppers(data.toppers);
      } catch {}
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const config = { size: selectedSize, flavor: selectedFlavor, toppings: activeToppings, topper: selectedTopper };
        const response = await api.post('/catalog/compute-price', config);
        setComputedPrice(response.data?.price ?? response.data?.data?.price ?? 60.00);
      } catch {
        let base = 60.00;
        const sizeObj = sizes.find(s => s.key === selectedSize);
        if (sizeObj) base += sizeObj.surcharge;
        const flavorObj = flavors.find(f => f.key === selectedFlavor);
        if (flavorObj) base += flavorObj.surcharge;
        activeToppings.forEach(k => { const t = toppings.find(t => t.key === k); if (t) base += t.surcharge; });
        const topperObj = toppers.find(t => t.key === selectedTopper);
        if (topperObj) base += topperObj.surcharge;
        setComputedPrice(base);
      }
    };
    fetchPrice();
  }, [selectedSize, selectedFlavor, activeToppings, selectedTopper]);

  const handleOrderSubmit = async () => {
    setOrderingInProgress(true);
    try {
      await api.post('/client/cart', { itemConfig: { size: selectedSize, flavor: selectedFlavor, toppings: activeToppings, topper: selectedTopper, color: selectedColor }, quantity: 1 });
      Alert.alert(t('catalogue:cus_chef_approval'), t('catalogue:cus_chef_approval_msg'), [{ text: t('catalogue:cus_view_boutique'), onPress: () => router.push('/(tabs)/catalogue') }]);
    } catch {
      Alert.alert(t('common:error'), t('catalogue:cus_add_to_cart_error'));
    } finally {
      setOrderingInProgress(false);
    }
  };

  const activeColor = frostingColors.find(c => c.key === selectedColor) || frostingColors[0];
  const selectedTopperData = toppers.find(t => t.key === selectedTopper);
  const toppingLabels = activeToppings.map(k => toppings.find(t => t.key === k)?.label).filter((x): x is string => Boolean(x));

  return (
    <View style={styles.container}>
      <AppHeader title={t('catalogue:cus_app_title')} subtitle={t('catalogue:cus_app_subtitle')} rightContent={
        <View className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm mr-3">
          <ChefHat size={20} color="#D4A373" />
        </View>
      } />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <CakePreview hex={activeColor.hex} topperEmoji={selectedTopperData?.emoji} showTopper={selectedTopper !== 'none'} toppingsList={toppingLabels} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_tiers_size')}</Text>
        <View style={styles.optionRow}>
          {sizes.map(size => (
            <OptionCard key={size.key} item={size} isSelected={selectedSize === size.key} onSelect={setSelectedSize} renderContent={(item) => (
              <><Text style={[styles.cardLabel, selectedSize === item.key && { color: '#2C1B18' }]}>{item.label}</Text><Text style={styles.cardMeta}>{item.detail}</Text><Text style={styles.cardMeta}>{item.servings}</Text><Text style={styles.cardPrice}>{item.surcharge === 0 ? t('catalogue:included') : `+${t('common:currency')}${item.surcharge.toFixed(2)}`}</Text></>
            )} />
          ))}
        </View>
        <Text style={styles.sectionTitle}>{t('catalogue:cus_gourmet_flavor')}</Text>
        <RadioOptionRow items={flavors} selected={selectedFlavor} onSelect={setSelectedFlavor} renderRight={(item) => (
          <Text style={styles.surchargeText}>{item.surcharge === 0 ? t('catalogue:included') : `+${t('common:currency')}${item.surcharge.toFixed(2)}`}</Text>
        )} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_artisanal_hue')}</Text>
        <ColorSwatchPicker colors={frostingColors} selected={selectedColor} onSelect={setSelectedColor} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_luxury_toppings')}</Text>
        <ToppingGrid toppings={toppings} active={activeToppings} onToggle={(key) => setActiveToppings(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key])} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_bespoke_toppers')}</Text>
        <RadioOptionRow items={toppers} selected={selectedTopper} onSelect={setSelectedTopper} renderRight={(item) => (
          <Text style={styles.surchargeText}>{item.surcharge === 0 ? t('catalogue:included') : `+${t('common:currency')}${item.surcharge.toFixed(2)}`}</Text>
        )} />
      </ScrollView>
      <PriceFooter price={computedPrice} loading={orderingInProgress} onOrder={handleOrderSubmit} deliveryLabel={t('catalogue:cus_delivery_estimate')} totalLabel={t('catalogue:cus_custom_total')} ctaLabel={t('catalogue:cus_add_creation')} loadingLabel={t('catalogue:cus_designing')} currency={t('common:currency')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F2' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 200 },
  sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#2C1B18', marginTop: 24, marginBottom: 12 },
  optionRow: { flexDirection: 'row', gap: 8 },
  cardLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#8C7A77' },
  cardMeta: { fontFamily: 'Poppins-Regular', fontSize: 9, color: '#8C7A77', opacity: 0.8, marginTop: 2 },
  cardPrice: { fontFamily: 'Poppins-Bold', fontSize: 10, color: '#D4A373', marginTop: 8 },
  surchargeText: { fontFamily: 'Poppins-Bold', fontSize: 11, color: '#D4A373' },
});
