import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PokemonSet } from '@/types/pokemon';
import { Calendar, Package } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface FeaturedSetCardProps {
  set: PokemonSet;
  index: number;
}

export function FeaturedSetCard({ set, index }: FeaturedSetCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const styles = getStyles(isDark);

  return (
    <Animated.View entering={FadeInDown.delay(index * 150)}>
      <TouchableOpacity style={styles.container}>
        <LinearGradient
          colors={isDark ? ['#1a1a1a', '#2a2a2a'] : ['#ffffff', '#f8fafc']}
          style={styles.card}
        >
          <View style={styles.imageContainer}>
            {set.images?.logo ? (
              <Image 
                source={{ uri: set.images.logo }} 
                style={styles.setLogo}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderLogo}>
                <Package size={32} color={isDark ? '#666' : '#999'} />
              </View>
            )}
          </View>
          
          <View style={styles.setInfo}>
            <Text style={styles.setName} numberOfLines={2}>
              {set.name}
            </Text>
            <Text style={styles.setSeries}>
              {set.series}
            </Text>
            
            <View style={styles.setDetails}>
              <View style={styles.detailItem}>
                <Package size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={styles.detailText}>{set.total} cards</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={14} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={styles.detailText}>{formatDate(set.releaseDate)}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.exploreButton}>
            <Text style={styles.exploreText}>Explore</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: isDark ? '#333333' : '#e5e7eb',
  },
  imageContainer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  setLogo: {
    width: '100%',
    height: '100%',
  },
  placeholderLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: isDark ? '#333333' : '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setInfo: {
    marginBottom: 16,
  },
  setName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 4,
  },
  setSeries: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 12,
  },
  setDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  exploreButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exploreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});