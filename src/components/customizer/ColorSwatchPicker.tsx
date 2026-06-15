import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

interface ColorSwatch {
  key: string;
  name: string;
  hex: string;
}

interface ColorSwatchPickerProps {
  colors: ColorSwatch[];
  selected: string;
  onSelect: (key: string) => void;
}

export function ColorSwatchPicker({ colors, selected, onSelect }: ColorSwatchPickerProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {colors.map(color => {
        const isSelected = selected === color.key;
        return (
          <TouchableOpacity key={color.key} onPress={() => onSelect(color.key)} style={styles.item}>
            <View style={[styles.circle, { backgroundColor: color.hex }, isSelected && styles.circleSelected]}>
              {isSelected && <Check size={14} color={color.key === 'cream' || color.key === 'lavender' ? '#D4A373' : '#FFF'} strokeWidth={3} />}
            </View>
            <Text style={[styles.label, isSelected && { color: '#2C1B18' }]} numberOfLines={1}>{color.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  item: { alignItems: 'center', width: 72 },
  circle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(44,27,24,0.1)' },
  circleSelected: { borderColor: '#D4A373', borderWidth: 3 },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#8C7A77', marginTop: 6, textAlign: 'center' },
});
