import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingBag, Clock } from 'lucide-react-native';
import { Button } from '../ui/Button';

interface PriceFooterProps {
  price: number;
  loading: boolean;
  onOrder: () => void;
  deliveryLabel: string;
  totalLabel: string;
  ctaLabel: string;
  loadingLabel: string;
  currency: string;
}

export function PriceFooter({ price, loading, onOrder, deliveryLabel, totalLabel, ctaLabel, loadingLabel, currency }: PriceFooterProps) {
  return (
    <View style={styles.deck}>
      <View style={styles.badgeRow}>
        <Clock size={12} color="#D4A373" style={{ marginRight: 6 }} />
        <Text style={styles.badgeText}>{deliveryLabel}</Text>
      </View>
      <View style={styles.btnRow}>
        <View style={styles.pricingBlock}>
          <Text style={styles.totalLabel}>{totalLabel}</Text>
          <Text style={styles.priceValue}>{currency}{price.toFixed(2)}</Text>
        </View>
        <Button
          title={loading ? loadingLabel : ctaLabel}
          leftIcon={<ShoppingBag size={18} color="#FFF" strokeWidth={2} />}
          loading={loading}
          onPress={onOrder}
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  deck: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    borderWidth: 1.5, borderColor: 'rgba(232,211,194,0.4)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 34,
    shadowColor: '#2C1B18', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center' },
  badgeText: { fontFamily: 'Poppins-Regular', fontSize: 11, color: '#D4A373' },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  pricingBlock: { flexDirection: 'column' },
  totalLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#8C7A77' },
  priceValue: { fontFamily: 'Poppins-Bold', fontSize: 22, color: '#D4A373' },
  btn: { flex: 1, height: 48 },
});
