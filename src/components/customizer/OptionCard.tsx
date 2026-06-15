import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GlassBox } from '../ui/GlassBox';

interface OptionCardProps<T> {
  item: T;
  isSelected: boolean;
  onSelect: (key: string) => void;
  renderContent: (item: T, isSelected: boolean) => React.ReactNode;
}

export function OptionCard<T extends { key: string }>({ item, isSelected, onSelect, renderContent }: OptionCardProps<T>) {
  return (
    <TouchableOpacity style={styles.touch} onPress={() => onSelect(item.key)}>
      <GlassBox intensity={isSelected ? 65 : 20} style={[styles.glass, isSelected && { borderColor: '#D4A373' }]}>
        {renderContent(item, isSelected)}
      </GlassBox>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: { flex: 1, borderRadius: 18, overflow: 'hidden' },
  glass: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderColor: 'rgba(232, 211, 194, 0.45)',
    borderWidth: 1.2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
});
