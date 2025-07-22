import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { CollectionCard as CollectionCardType } from '@/types/pokemon';

interface CollectionCardProps {
  card: CollectionCardType;
  index: number;
  viewMode: 'grid' | 'list';
}

export function CollectionCard({ card, index, viewMode }: CollectionCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Collection Card Component</Text>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  placeholder: {
    color: isDark ? '#ffffff' : '#333333',
    textAlign: 'center',
  },
});