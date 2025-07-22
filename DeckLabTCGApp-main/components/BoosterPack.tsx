import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BoosterPack as BoosterPackType } from '@/types/pokemon';
import { Package, Star, DollarSign } from 'lucide-react-native';

interface BoosterPackProps {
  pack: BoosterPackType;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

export function BoosterPack({ pack, index, isSelected, onPress }: BoosterPackProps) {
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return '#FFD700';
      case 'Rare': return '#C0392B';
      default: return '#7F8C8D';
    }
  };

  const styles = getStyles(isDark, isSelected);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 150)}
      style={[styles.container, animatedStyle]}
    >
      <TouchableOpacity
        style={styles.pack}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={pack.gradient}
          style={styles.packGradient}
        >
          <View style={styles.packIcon}>
            <Package size={32} color="white" />
          </View>
          
          <View style={styles.packInfo}>
            <Text style={styles.packName}>{pack.name}</Text>
            
            <View style={styles.rarityContainer}>
              <Star size={16} color={getRarityColor(pack.rarity)} />
              <Text style={[styles.rarityText, { color: getRarityColor(pack.rarity) }]}>
                {pack.rarity}
              </Text>
            </View>
            
            <View style={styles.priceContainer}>
              <DollarSign size={16} color="white" />
              <Text style={styles.price}>${pack.price}</Text>
            </View>
          </View>
        </LinearGradient>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedText}>Selected</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean, isSelected: boolean) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  pack: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: isSelected ? 3 : 0,
    borderColor: '#10B981',
  },
  packGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  packIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  packInfo: {
    flex: 1,
  },
  packName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  rarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  selectedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});