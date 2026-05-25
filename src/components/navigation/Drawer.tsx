import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';
import { Image } from 'expo-image';

export const Drawer: React.FC<any> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' }} 
          style={styles.avatar} 
        />
        <Text style={[theme.typography.h3 as any, styles.name]}>Elena Morgan</Text>
        <Text style={[theme.typography.body2 as any, styles.email]}>elena@fastpastry.app</Text>
      </View>
      
      <View style={styles.drawerItems}>
        {state?.routes?.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
             navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.item, isFocused && styles.itemFocused]}
              onPress={onPress}
            >
              {options.drawerIcon && options.drawerIcon({ focused: isFocused, color: isFocused ? theme.colors.primary : theme.colors.textMuted, size: 24 })}
              <Text style={[styles.label, isFocused && styles.labelFocused]}>
                {options.drawerLabel !== undefined
                  ? options.drawerLabel.toString()
                  : options.title !== undefined
                  ? options.title
                  : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: theme.radius.circle,
    marginBottom: theme.spacing.md,
  },
  name: {
    color: theme.colors.text,
  },
  email: {
    color: theme.colors.textMuted,
  },
  drawerItems: {
    padding: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.sm,
  },
  itemFocused: {
    backgroundColor: theme.colors.primaryLight,
  },
  label: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  labelFocused: {
    color: theme.colors.primary,
    ...theme.typography.h4,
  }
});
