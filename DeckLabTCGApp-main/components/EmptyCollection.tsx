import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Plus, Search } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function EmptyCollection() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = getStyles(isDark);

  return (
    <Animated.View entering={FadeInDown.delay(400)} style={styles.container}>
      <View style={styles.iconContainer}>
        <Package size={64} color={isDark ? '#666666' : '#9ca3af'} />
      </View>
      
      <Text style={styles.title}>Start Your Collection</Text>
      <Text style={styles.subtitle}>
        Begin your Pokemon TCG journey by adding your first cards to the collection
      </Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.primaryButton}>
          <LinearGradient
            colors={['#3B82F6', '#1D4ED8']}
            style={styles.buttonGradient}
          >
            <Search size={20} color="white" />
            <Text style={styles.primaryButtonText}>Search Cards</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.secondaryButton}>
          <Plus size={20} color={isDark ? '#ffffff' : '#374151'} />
          <Text style={styles.secondaryButtonText}>Add Manually</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: isDark ? '#1a1a1a' : '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#e5e7eb',
    gap: 8,
  },
  secondaryButtonText: {
    color: isDark ? '#ffffff' : '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});