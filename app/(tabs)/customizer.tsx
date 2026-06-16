import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const SIZES = [
  { k: 'single', l: '1 Tier', d: 'Petite 6"', s: 'Serves 4-6', p: 0 },
  { k: 'double', l: '2 Tiers', d: 'Signature 8"+6"', s: 'Serves 8-12', p: 35 },
  { k: 'triple', l: '3 Tiers', d: 'Grand 10"+8"+6"', s: 'Serves 15-20', p: 70 },
];
const FLAVORS = [
  { k: 'chocolate', l: 'Cacao Royale', d: 'Valrhona Dark Ganache', p: 0 },
  { k: 'raspberry', l: "L'Amour Rose", d: 'Raspberry Rosewater', p: 5 },
  { k: 'pistachio', l: 'Matcha Bliss', d: 'Matcha Mousse', p: 8 },
  { k: 'caramel', l: 'Golden Salted', d: 'Fleur-de-Sel Caramel', p: 3 },
];
const COLORS = [
  { k: 'cream', n: 'Chantilly White', h: '#FFFDF9' }, { k: 'rose', n: 'Rosy Ispahan', h: '#FCE1DC' },
  { k: 'blush', n: 'Petal Blush', h: '#FFF0ED' }, { k: 'champagne', n: 'Veuve Champagne', h: '#F7EFE3' },
  { k: 'pistachio', n: 'Uji Pistachio', h: '#EAF0DF' }, { k: 'emerald', n: 'Jardin Matcha', h: '#D8E5D3' },
  { k: 'honey', n: 'Golden Honey', h: '#F2DEC2' }, { k: 'cacao', n: 'Velvet Noir', h: '#4A2F2B' },
  { k: 'luxeGold', n: 'Imperial Gold', h: '#E8C39E' }, { k: 'lavender', n: 'Stardust Lavender', h: '#E8DFFF' },
];
const TOPPINGS = [
  { k: 'macarons', l: 'Parisian Macarons', p: 12, e: '🧁', d: 'Crispy almond shells' },
  { k: 'berries', l: 'Wild Berries', p: 10, e: '🍓', d: 'Fresh raspberries' },
  { k: 'orchids', l: 'Edible Orchids', p: 15, e: '🌸', d: 'Hand-picked blossoms' },
  { k: 'goldLeaf', l: '24k Gold Flakes', p: 20, e: '✨', d: 'Shimmering flakes' },
];
const TOPPERS = [
  { k: 'none', l: 'No Topper', e: '❌', p: 0 }, { k: 'birthday', l: 'Gold "HBD"', e: '👑', p: 8 },
  { k: 'anniversary', l: 'Crown Anniversary', e: '💍', p: 10 }, { k: 'celebrate', l: 'Sparkly "Cheers"', e: '✨', p: 8 },
];

export default function App() {
  const { t } = useTranslation();
  const [size, setSize] = useState('single');
  const [flavor, setFlavor] = useState('chocolate');
  const [color, setColor] = useState('cream');
  const [toppings, setToppings] = useState<string[]>([]);
  const [topper, setTopper] = useState('none');

  const price = useMemo(() => 60
    + (SIZES.find(s => s.k === size)?.p ?? 0)
    + (FLAVORS.find(f => f.k === flavor)?.p ?? 0)
    + toppings.reduce((s, k) => s + (TOPPINGS.find(t => t.k === k)?.p ?? 0), 0)
    + (TOPPERS.find(t => t.k === topper)?.p ?? 0),
  [size, flavor, toppings, topper]);

  const activeColor = COLORS.find(c => c.k === color)?.h ?? '#FFFDF9';
  const topperEmoji = TOPPERS.find(t => t.k === topper)?.e;

  return (
    <View style={st.c}>
      <View style={st.h}>
        <Text style={st.hl}>{t('catalogue:cus_app_title')}</Text>
        <Text style={st.hs}>{t('catalogue:cus_app_subtitle')}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={[st.cake, { backgroundColor: activeColor }]}>
            {topper !== 'none' && <Text style={{ fontSize: 40 }}>{topperEmoji}</Text>}
          </View>
        </View>

        <Text style={st.title}>{t('catalogue:cus_tiers_size')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {SIZES.map(s => (
            <TouchableOpacity key={s.k} onPress={() => setSize(s.k)} style={[st.card, size === s.k && st.sel]}>
              <Text style={[st.cl, size === s.k && { color: '#000' }]}>{s.l}</Text>
              <Text style={st.cm}>{s.d}</Text>
              <Text style={st.cm}>{s.s}</Text>
              <Text style={st.cp}>{s.p === 0 ? t('common:included') : `+DA${s.p}`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={st.title}>{t('catalogue:cus_gourmet_flavor')}</Text>
        {FLAVORS.map(f => (
          <TouchableOpacity key={f.k} onPress={() => setFlavor(f.k)} style={[st.row, flavor === f.k && st.sel]}>
            <View style={[st.radio, flavor === f.k && { borderColor: '#D4A373' }]}>
              {flavor === f.k && <View style={st.dot} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[st.cl, flavor === f.k && { color: '#000' }]}>{f.l}</Text>
              <Text style={st.cm}>{f.d}</Text>
            </View>
            <Text style={st.cp}>{f.p === 0 ? t('common:included') : `+DA${f.p}`}</Text>
          </TouchableOpacity>
        ))}

        <Text style={st.title}>{t('catalogue:cus_artisanal_hue')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {COLORS.map(c => (
              <TouchableOpacity key={c.k} onPress={() => setColor(c.k)} style={{ alignItems: 'center', width: 65 }}>
                <View style={[st.swatch, { backgroundColor: c.h }, color === c.k && st.swatchSel]}>
                  {color === c.k && <Text style={{ color: c.k === 'cream' || c.k === 'lavender' ? '#D4A373' : '#FFF', fontSize: 12 }}>✓</Text>}
                </View>
                <Text style={{ fontSize: 9, fontFamily: 'Poppins-SemiBold', color: color === c.k ? '#000' : '#8C7A77', marginTop: 4, textAlign: 'center' }}>{c.n}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={st.title}>{t('catalogue:cus_luxury_toppings')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {TOPPINGS.map(t => {
            const active = toppings.includes(t.k);
            return (
              <TouchableOpacity key={t.k} onPress={() => setToppings(p => p.includes(t.k) ? p.filter(i => i !== t.k) : [...p, t.k])} style={[st.topCard, active && st.sel]}>
                <Text style={{ fontSize: 22 }}>{t.e}</Text>
                <Text style={[st.cl, active && { color: '#000' }]}>{t.l}</Text>
                <Text style={[st.cm, { height: 24 }]}>{t.d}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                  <Text style={st.cp}>+DA{t.p}</Text>
                  <View style={[st.chk, active && st.chkActive]}>
                    {active && <Text style={{ color: '#FFF', fontSize: 9 }}>✓</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={st.title}>{t('catalogue:cus_bespoke_toppers')}</Text>
        {TOPPERS.map(t => (
          <TouchableOpacity key={t.k} onPress={() => setTopper(t.k)} style={[st.row, topper === t.k && st.sel]}>
            <Text style={{ fontSize: 20, marginRight: 12 }}>{t.e}</Text>
            <Text style={{ flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 13, color: topper === t.k ? '#000' : '#8C7A77' }}>{t.l}</Text>
            <Text style={st.cp}>{t.p === 0 ? t('common:included') : `+DA${t.p}`}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={st.f}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#8C7A77' }}>{t('catalogue:cus_custom_total')}</Text>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: '#D4A373' }}>DA{price}</Text>
          </View>
          <TouchableOpacity onPress={() => Alert.alert(t('catalogue:cus_chef_approval'), t('catalogue:cus_chef_approval_msg'))} style={{ flex: 1, height: 48, backgroundColor: '#D4A373', borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }}>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: '#FFF' }}>{t('catalogue:cus_add_creation')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#FFF8F2' },
  h: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(232,211,194,0.3)' },
  hl: { fontFamily: 'Poppins-Bold', fontSize: 22, color: '#2C1B18' },
  hs: { fontFamily: 'Poppins-Regular', fontSize: 13, color: '#8C7A77', marginTop: 2 },
  title: { fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#2C1B18', marginTop: 24, marginBottom: 12 },
  card: { flex: 1, borderRadius: 16, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(232,211,194,0.4)', backgroundColor: 'rgba(255,255,255,0.4)' },
  sel: { borderColor: '#D4A373', backgroundColor: 'rgba(212,163,115,0.08)' },
  cl: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#8C7A77' },
  cm: { fontFamily: 'Poppins-Regular', fontSize: 9, color: '#8C7A77', opacity: 0.8, marginTop: 2 },
  cp: { fontFamily: 'Poppins-Bold', fontSize: 11, color: '#D4A373', marginTop: 6 },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(232,211,194,0.4)', backgroundColor: 'rgba(255,255,255,0.45)' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: 'rgba(212,163,115,0.5)', justifyContent: 'center', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4A373' },
  f: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1.5, borderColor: 'rgba(232,211,194,0.4)', backgroundColor: 'rgba(255,255,255,0.96)', padding: 20, paddingBottom: 34, shadowColor: '#2C1B18', shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 },
  cake: { width: 160, height: 160, borderRadius: 80, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 6 },
  swatch: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  swatchSel: { borderColor: '#D4A373', borderWidth: 3 },
  topCard: { width: '48%', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: 'rgba(232,211,194,0.4)', backgroundColor: 'rgba(255,255,255,0.4)' },
  chk: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.2, borderColor: 'rgba(212,163,115,0.5)', justifyContent: 'center', alignItems: 'center' },
  chkActive: { borderColor: '#D4A373', backgroundColor: '#D4A373' },
});
