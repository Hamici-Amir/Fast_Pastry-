import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface RadioOption {
  key: string;
  label: string;
  surcharge: number;
  desc?: string;
  emoji?: string;
}

interface RadioOptionRowProps<T extends RadioOption> {
  items: T[];
  selected: string;
  onSelect: (key: string) => void;
  renderRight?: (item: T, isSelected: boolean) => React.ReactNode;
  children?: (item: T, isSelected: boolean) => React.ReactNode;
}

export function RadioOptionRow<T extends RadioOption>({ items, selected, onSelect, renderRight, children }: RadioOptionRowProps<T>) {
  return (
    <View style={styles.column}>
      {items.map(item => {
        const isSelected = selected === item.key;
        return (
          <TouchableOpacity key={item.key} style={styles.touch} onPress={() => onSelect(item.key)}>
            <View style={[styles.row, isSelected && { borderColor: '#D4A373' }]}>
              <View style={[styles.radioBtn, isSelected && styles.radioBtnActive]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
              {children ? (
                children(item, isSelected)
              ) : (
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.label, isSelected && { color: '#2C1B18' }]}>{item.label}</Text>
                  {item.desc ? <Text style={styles.desc}>{item.desc}</Text> : null}
                </View>
              )}
              {renderRight ? renderRight(item, isSelected) : (
                <Text style={styles.surcharge}>{item.surcharge === 0 ? 'Included' : `+DA${item.surcharge.toFixed(2)}`}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { gap: 8 },
  touch: { borderRadius: 18, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 14,
    borderColor: 'rgba(232, 211, 194, 0.4)', borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  radioBtn: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 1.5,
    borderColor: 'rgba(212, 163, 115, 0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  radioBtnActive: { borderColor: '#D4A373' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4A373' },
  label: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#8C7A77' },
  desc: { fontFamily: 'Poppins-Regular', fontSize: 11, color: '#8C7A77', opacity: 0.8, marginTop: 1 },
  surcharge: { fontFamily: 'Poppins-Bold', fontSize: 11, color: '#D4A373' },
});
