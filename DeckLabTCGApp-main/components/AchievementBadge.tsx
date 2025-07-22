import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Package, Handshake } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Achievement } from '@/types/pokemon';

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
}

export function AchievementBadge({ achievement, index }: AchievementBadgeProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return Star;
      case 'package': return Package;
      case 'handshake': return Handshake;
      default: return Trophy;
    }
  };

  const Icon = getIcon(achievement.icon);

  const styles = getStyles(isDark, achievement.earned);

  return (
    <Animated.View 
      entering={FadeInRight.delay(index * 100)}
      style={styles.container}
    >
      <LinearGradient
        colors={achievement.earned 
          ? ['#10B981', '#059669'] 
          : isDark ? ['#374151', '#4B5563'] : ['#E5E7EB', '#F3F4F6']
        }
        style={styles.badge}
      >
        <Icon 
          size={24} 
          color={achievement.earned ? 'white' : isDark ? '#9CA3AF' : '#6B7280'} 
        />
      </LinearGradient>
      <Text style={styles.name} numberOfLines={2}>
        {achievement.name}
      </Text>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean, earned: boolean) => StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: earned ? 0.2 : 0.1,
    shadowRadius: 4,
    elevation: earned ? 4 : 2,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: earned 
      ? (isDark ? '#ffffff' : '#1f2937')
      : (isDark ? '#9ca3af' : '#6b7280'),
    textAlign: 'center',
    lineHeight: 16,
  },
});