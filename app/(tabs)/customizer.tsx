import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ChefHat, ShoppingBag } from 'lucide-react-native';
import { AppHeader } from '../../src/components/common/AppHeader';
import { Button } from '../../src/components/ui/Button';
import { CakePreview } from '../../src/components/customizer/CakePreview';
import { OptionCard } from '../../src/components/customizer/OptionCard';
import { RadioOptionRow } from '../../src/components/customizer/RadioOptionRow';
import { ColorSwatchPicker } from '../../src/components/customizer/ColorSwatchPicker';
import { ToppingGrid } from '../../src/components/customizer/ToppingGrid';

const SIZES = [
  { key: 'single', label: '1 Tier', detail: 'Petite 6"', servings: 'Serves 4-6', surcharge: 0 },
  { key: 'double', label: '2 Tiers', detail: '8"+6"', servings: 'Serves 8-12', surcharge: 35 },
  { key: 'triple', label: '3 Tiers', detail: '10"+8"+6"', servings: 'Serves 15-20', surcharge: 70 },
];

const FLAVORS = [
  { key: 'chocolate', label: 'Cacao Royale', desc: 'Valrhona Dark Ganache, Praline Crunch', surcharge: 0 },
  { key: 'raspberry', label: "L'Amour Rose", desc: 'Raspberry Rosewater, White Chocolate Mousse', surcharge: 5 },
  { key: 'pistachio', label: 'Matcha Bliss', desc: 'Ceremonial Matcha Mousse, Pistachio Cremeux', surcharge: 8 },
  { key: 'caramel', label: 'Golden Salted', desc: 'Fleur-de-Sel Caramel, Roasted Pecan', surcharge: 3 },
];

const COLORS = [
  { key: 'cream', name: 'Chantilly White', hex: '#FFFDF9' },
  { key: 'rose', name: 'Rosy Ispahan', hex: '#FCE1DC' },
  { key: 'blush', name: 'Petal Blush', hex: '#FFF0ED' },
  { key: 'champagne', name: 'Veuve Champagne', hex: '#F7EFE3' },
  { key: 'pistachio', name: 'Uji Pistachio', hex: '#EAF0DF' },
  { key: 'emerald', name: 'Jardin Matcha', hex: '#D8E5D3' },
  { key: 'honey', name: 'Golden Honey', hex: '#F2DEC2' },
  { key: 'cacao', name: 'Velvet Noir', hex: '#4A2F2B' },
  { key: 'luxeGold', name: 'Imperial Gold', hex: '#E8C39E' },
  { key: 'lavender', name: 'Stardust Lavender', hex: '#E8DFFF' },
];

const TOPPINGS = [
  { key: 'macarons', label: 'Parisian Macarons', surcharge: 12, emoji: '🧁', desc: 'Crispy pastel almond shells' },
  { key: 'berries', label: 'Wild Berries', surcharge: 10, emoji: '🍓', desc: 'Fresh raspberries & blueberries' },
  { key: 'orchids', label: 'Edible Orchids', surcharge: 15, emoji: '🌸', desc: 'Hand-picked blossoms' },
  { key: 'goldLeaf', label: '24k Gold Flakes', surcharge: 20, emoji: '✨', desc: 'Shimmering metallic flakes' },
];

const TOPPERS = [
  { key: 'none', label: 'No Topper', emoji: '❌', surcharge: 0 },
  { key: 'birthday', label: 'Gold "HBD"', emoji: '👑', surcharge: 8 },
  { key: 'anniversary', label: 'Crown Anniversary', emoji: '💍', surcharge: 10 },
  { key: 'celebrate', label: 'Sparkly "Cheers"', emoji: '✨', surcharge: 8 },
];

const SECTIONS = [
  { key: 'size', titleKey: 'cus_tiers_size', data: SIZES },
  { key: 'flavor', titleKey: 'cus_gourmet_flavor', data: FLAVORS },
  { key: 'color', titleKey: 'cus_artisanal_hue', data: COLORS },
  { key: 'toppings', titleKey: 'cus_luxury_toppings', data: TOPPINGS },
  { key: 'toppers', titleKey: 'cus_bespoke_toppers', data: TOPPERS },
];

const BASE_PRICE = 60;

export default function CustomizerScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [size, setSize] = useState('single');
  const [flavor, setFlavor] = useState('chocolate');
  const [color, setColor] = useState('cream');
  const [toppings, setToppings] = useState<string[]>([]);
  const [topper, setTopper] = useState('none');
  const [ordering, setOrdering] = useState(false);

  const price = useMemo(() => {
    const sizeCost = SIZES.find(s => s.key === size)?.surcharge ?? 0;
    const flavorCost = FLAVORS.find(f => f.key === flavor)?.surcharge ?? 0;
    const toppingsCost = toppings.reduce((sum, k) => sum + (TOPPINGS.find(t => t.key === k)?.surcharge ?? 0), 0);
    const topperCost = TOPPERS.find(t => t.key === topper)?.surcharge ?? 0;
    return BASE_PRICE + sizeCost + flavorCost + toppingsCost + topperCost;
  }, [size, flavor, toppings, topper]);

  const handleOrder = async () => {
    setOrdering(true);
    setTimeout(() => {
      setOrdering(false);
      Alert.alert(t('catalogue:cus_chef_approval'), t('catalogue:cus_chef_approval_msg'), [
        { text: t('catalogue:cus_view_boutique'), onPress: () => router.push('/(tabs)/catalogue') },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title={t('catalogue:cus_app_title')}
        subtitle={t('catalogue:cus_app_subtitle')}
        rightContent={
          <View className="w-11 h-11 items-center justify-center rounded-2xl bg-white/80 border border-[#D4A373]/20 shadow-sm mr-3">
            <ChefHat size={20} color="#D4A373" />
          </View>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <CakePreview
          hex={COLORS.find(c => c.key === color)?.hex ?? '#FFFDF9'}
          topperEmoji={TOPPERS.find(t => t.key === topper)?.emoji}
          showTopper={topper !== 'none'}
          toppingsList={toppings.map(k => TOPPINGS.find(t => t.key === k)?.label).filter((x): x is string => Boolean(x))}
        />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_tiers_size')}</Text>
        <View style={styles.row}>
          {SIZES.map(s => (
            <OptionCard key={s.key} item={s} isSelected={size === s.key} onSelect={setSize} renderContent={item => (
              <><Text style={[styles.cardLabel, size === item.key && { color: '#2C1B18' }]}>{item.label}</Text><Text style={styles.cardMeta}>{item.detail}</Text><Text style={styles.cardMeta}>{item.servings}</Text><Text style={styles.cardPrice}>{item.surcharge === 0 ? t('common:included') : `+DA${item.surcharge}`}</Text></>
            )} />
          ))}
        </View>
        <Text style={styles.sectionTitle}>{t('catalogue:cus_gourmet_flavor')}</Text>
        <RadioOptionRow items={FLAVORS as any} selected={flavor} onSelect={setFlavor} renderRight={item => (
          <Text style={styles.price}>{item.surcharge === 0 ? t('common:included') : `+DA${item.surcharge}`}</Text>
        )} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_artisanal_hue')}</Text>
        <ColorSwatchPicker colors={COLORS as any} selected={color} onSelect={setColor} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_luxury_toppings')}</Text>
        <ToppingGrid toppings={TOPPINGS as any} active={toppings} onToggle={key => setToppings(p => p.includes(key) ? p.filter(i => i !== key) : [...p, key])} />
        <Text style={styles.sectionTitle}>{t('catalogue:cus_bespoke_toppers')}</Text>
        <RadioOptionRow items={TOPPERS as any} selected={topper} onSelect={setTopper} renderRight={item => (
          <Text style={styles.price}>{item.surcharge === 0 ? t('common:included') : `+DA${item.surcharge}`}</Text>
        )} />
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.bar}>
          <View>
            <Text style={styles.totalLabel}>{t('catalogue:cus_custom_total')}</Text>
            <Text style={styles.totalPrice}>DA{price}</Text>
          </View>
          <Button title={ordering ? t('catalogue:cus_designing') : t('catalogue:cus_add_creation')} leftIcon={<ShoppingBag size={18} color="#FFF" strokeWidth={2} />} loading={ordering} onPress={handleOrder} style={{ flex: 1, height: 48 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F2' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 200 },
  sectionTitle: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#2C1B18', marginTop: 24, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 8 },
  cardLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#8C7A77' },
  cardMeta: { fontFamily: 'Poppins-Regular', fontSize: 9, color: '#8C7A77', opacity: 0.8, marginTop: 2 },
  cardPrice: { fontFamily: 'Poppins-Bold', fontSize: 10, color: '#D4A373', marginTop: 8 },
  price: { fontFamily: 'Poppins-Bold', fontSize: 11, color: '#D4A373' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1.5, borderColor: 'rgba(232,211,194,0.4)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34,
    shadowColor: '#2C1B18', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10,
  },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  totalLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#8C7A77' },
  totalPrice: { fontFamily: 'Poppins-Bold', fontSize: 22, color: '#D4A373' },
});
