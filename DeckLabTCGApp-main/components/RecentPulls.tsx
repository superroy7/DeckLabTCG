import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Star } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';

export function RecentPulls() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Mock recent pulls data
  const recentPulls = [
    {
      id: '1',
      cardName: 'Charizard',
      set: 'Base Set',
      rarity: 'Rare Holo',
      image: 'https://images.pokemontcg.io/base1/4_hires.png',
      pulledAt: '2 hours ago',
    },
    {
      id: '2',
      cardName: 'Pikachu',
      set: 'Base Set',
      rarity: 'Common',
      image: 'https://images.pokemontcg.io/base1/58_hires.png',
      pulledAt: '1 day ago',
    },
    {
      id: '3',
      cardName: 'Blastoise',
      set: 'Base Set',
      rarity: 'Rare Holo',
      image: 'https://images.pokemontcg.io/base1/2_hires.png',
      pulledAt: '3 days ago',
    },
  ];

  const styles = getStyles(isDark);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Pulls</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.pullsContainer}>
          {recentPulls.map((pull, index) => (
            <Animated.View
              key={pull.id}
              entering={FadeInRight.delay(index * 150)}
              style={styles.pullCard}
            >
              <LinearGradient
                colors={isDark ? ['#1a1a1a', '#2a2a2a'] : ['#ffffff', '#f8fafc']}
                style={styles.pullCardGradient}
              >
                <View style={styles.pullImageContainer}>
                  <Image
                    source={{ uri: pull.image }}
                    style={styles.pullImage}
                    resizeMode="contain"
                  />
                </View>
                
                <View style={styles.pullInfo}>
                  <Text style={styles.pullCardName} numberOfLines={1}>
                    {pull.cardName}
                  </Text>
                  <Text style={styles.pullSet}>{pull.set}</Text>
                  
                  <View style={styles.pullRarity}>
                    <Star size={12} color="#FFD700" />
                    <Text style={styles.pullRarityText}>{pull.rarity}</Text>
                  </View>
                  
                  <View style={styles.pullTime}>
                    <Clock size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
                    <Text style={styles.pullTimeText}>{pull.pulledAt}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  pullsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  pullCard: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pullCardGradient: {
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pullImageContainer: {
    height: 120,
    backgroundColor: isDark ? '#2a2a2a' : '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pullImage: {
    width: '100%',
    height: '100%',
  },
  pullInfo: {
    gap: 4,
  },
  pullCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  pullSet: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  pullRarity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pullRarityText: {
    fontSize: 11,
    color: '#FFD700',
    fontWeight: '600',
  },
  pullTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pullTimeText: {
    fontSize: 11,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
});