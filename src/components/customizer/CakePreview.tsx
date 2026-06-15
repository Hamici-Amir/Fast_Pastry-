import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CakePreviewProps {
  hex: string;
  topperEmoji?: string;
  showTopper?: boolean;
  toppingsList?: string[];
}

export function CakePreview({ hex, topperEmoji, showTopper, toppingsList }: CakePreviewProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: hex }]}>
        {showTopper && topperEmoji ? <Text style={styles.emoji}>{topperEmoji}</Text> : null}
      </View>
      {toppingsList && toppingsList.length > 0 && (
        <Text style={styles.toppingsText}>{toppingsList.join(' • ')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 24 },
  circle: {
    width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#2C1B18', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
  },
  emoji: { fontSize: 48 },
  toppingsText: { fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#8C7A77', marginTop: 12, textAlign: 'center' },
});
