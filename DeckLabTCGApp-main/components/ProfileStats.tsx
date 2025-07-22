import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Trophy, DollarSign, Star } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ProfileStatsProps {
  cardsCollected: number;
  setsCompleted: number;
  totalValue: number;
  tradingRating: number;
}

export function ProfileStats({ cardsCollected, setsCompleted, totalValue, tradingRating }: ProfileStatsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      icon: Package,
      label: 'Cards Collected',
      value: cardsCollected.toLocaleString(),
      color: '#3B82F6',
    },
    {
      icon: Trophy,
      label: 'Sets Completed',
      value: setsCompleted.toString(),
      color: '#F59E0B',
    },
    {
      icon: DollarSign,
      label: 'Collection Value',
      value: formatValue(totalValue),
      color: '#10B981',
    },
    {
      icon: Star,
      label: 'Trading Rating',
      value: `${tradingRating}/5.0`,
      color: '#8B5CF6',
    },
  ];

  const styles = getStyles(isDark);

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#2a2a2a'] : ['#ffffff', '#f8fafc']}
        style={styles.card}
      >
        <Text style={styles.title}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[styles.iconContainer, { backgroundColor: `${stat.color}20` }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    textAlign: 'center',
  },
});