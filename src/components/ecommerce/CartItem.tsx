import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { theme } from '../../theme';
import { QuantitySelector } from './QuantitySelector';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  name,
  price,
  quantity,
  imageUrl,
  onIncrease,
  onDecrease
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.details}>
        <Text style={[theme.typography.h4 as any, styles.name]} numberOfLines={1}>{name}</Text>
        <Text style={[theme.typography.body1 as any, styles.price]}>${price.toFixed(2)}</Text>
      </View>
      <QuantitySelector quantity={quantity} onIncrease={onIncrease} onDecrease={onDecrease} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
  },
  details: {
    flex: 1,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  name: {
    color: theme.colors.text,
    marginBottom: 4,
  },
  price: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  }
});
