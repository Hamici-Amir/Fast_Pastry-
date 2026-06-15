import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Topping {
  key: string;
  label: string;
  surcharge: number;
  emoji: string;
  desc: string;
}

interface ToppingGridProps {
  toppings: Topping[];
  active: string[];
  onToggle: (key: string) => void;
  renderSurcharge?: (surcharge: number) => string;
}

export function ToppingGrid({ toppings, active, onToggle, renderSurcharge }: ToppingGridProps) {
  return (
    <View style={styles.grid}>
      {toppings.map(topping => {
        const isSelected = active.includes(topping.key);
        return (
          <TouchableOpacity key={topping.key} style={styles.touch} onPress={() => onToggle(topping.key)}>
            <View style={[styles.card, isSelected && { borderColor: '#D4A373' }]}>
              <Text style={styles.emoji}>{topping.emoji}</Text>
              <Text style={[styles.label, isSelected && { color: '#2C1B18' }]}>{topping.label}</Text>
              <Text style={styles.desc}>{topping.desc}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.price}>+DA{topping.surcharge.toFixed(2)}</Text>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <Check size={10} color="#FFF" strokeWidth={3} />}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  touch: { width: (width - 48) / 2, borderRadius: 20, overflow: 'hidden' },
  card: { borderRadius: 20, padding: 14, borderColor: 'rgba(232,211,194,0.4)', borderWidth: 1.2, backgroundColor: 'rgba(255,255,255,0.4)' },
  emoji: { fontSize: 22, marginBottom: 4 },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#8C7A77' },
  desc: { fontFamily: 'Poppins-Regular', fontSize: 10, color: '#8C7A77', opacity: 0.7, marginTop: 2, height: 28 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontFamily: 'Poppins-Bold', fontSize: 11, color: '#D4A373' },
  checkbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.2, borderColor: 'rgba(212,163,115,0.5)', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { borderColor: '#D4A373', backgroundColor: '#D4A373' },
});
