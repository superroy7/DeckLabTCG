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
import Animated, { 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import { CardSearchResult } from '@/types/pokemon';
import { Star, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

interface CardItemProps {
  card: CardSearchResult;
  index: number;
}

export function CardItem({ card, index }: CardItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getPrice = () => {
    const prices = card.tcgplayer?.prices;
    if (prices?.holofoil?.market) return prices.holofoil.market;
    if (prices?.normal?.market) return prices.normal.market;
    return null;
  };

  const price = getPrice();
  const styles = getStyles(isDark);

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100)}
      style={[styles.container, animatedStyle]}
    >
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: card.images.small }} 
            style={styles.cardImage}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          
          {card.rarity && (
            <View style={styles.rarityBadge}>
              <Star size={12} color="#FFD700" />
              <Text style={styles.rarityText}>{card.rarity}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={2}>
            {card.name}
          </Text>
          <Text style={styles.setName} numberOfLines={1}>
            {card.set.name}
          </Text>
          <Text style={styles.cardNumber}>
            #{card.number}/{card.set.total}
          </Text>
          
          {price && (
            <View style={styles.priceContainer}>
              <TrendingUp size={14} color="#10B981" />
              <Text style={styles.price}>${price.toFixed(2)}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    marginRight: 16,
    width: CARD_WIDTH,
  },
  card: {
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: isDark ? '#2a2a2a' : '#f8fafc',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 2,
  },
  rarityText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 4,
  },
  setName: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 11,
    color: isDark ? '#6b7280' : '#9ca3af',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
});