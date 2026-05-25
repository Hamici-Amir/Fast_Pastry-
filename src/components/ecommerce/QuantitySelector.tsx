import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { theme } from '../../theme';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDecrease} style={styles.button} disabled={quantity <= 1}>
        <Minus size={16} color={quantity <= 1 ? theme.colors.border : theme.colors.text} />
      </TouchableOpacity>
      <Text style={[theme.typography.h4 as any, styles.text]}>{quantity}</Text>
      <TouchableOpacity onPress={onIncrease} style={styles.button}>
        <Plus size={16} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  button: {
    padding: theme.spacing.xs,
  },
  text: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text,
  }
});
