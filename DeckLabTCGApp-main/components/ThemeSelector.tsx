import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';

export function ThemeSelector() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = getStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Theme Selector Component</Text>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 12,
    padding: 16,
  },
  placeholder: {
    color: isDark ? '#ffffff' : '#333333',
    textAlign: 'center',
  },
});