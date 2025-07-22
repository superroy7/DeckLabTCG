import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Gift, Sparkles, Trophy } from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from 'react-native-reanimated';
import { BoosterPack } from '@/components/BoosterPack';
import { VaultStats } from '@/components/VaultStats';
import { RecentPulls } from '@/components/RecentPulls';

const { width } = Dimensions.get('window');

export default function VaultScreen() {
  const colorScheme = useColorScheme();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  
  const isDark = colorScheme === 'dark';
  const animationValue = useSharedValue(0);

  const boosterPacks = [
    {
      id: 'base-set',
      name: 'Base Set',
      price: 599,
      rarity: 'Legendary',
      image: 'https://images.pokemontcg.io/base1/logo.png',
      gradient: ['#FF6B6B', '#4ECDC4'],
    },
    {
      id: 'jungle',
      name: 'Jungle',
      price: 399,
      rarity: 'Rare',
      image: 'https://images.pokemontcg.io/base2/logo.png',
      gradient: ['#A8E6CF', '#88D8A3'],
    },
    {
      id: 'fossil',
      name: 'Fossil',
      price: 349,
      rarity: 'Rare',
      image: 'https://images.pokemontcg.io/base3/logo.png',
      gradient: ['#FFD93D', '#6BCF7F'],
    },
  ];

  const handlePackPress = (packId: string) => {
    setSelectedPack(packId);
    animationValue.value = withSpring(1);
  };

  const openPack = async () => {
    setIsOpening(true);
    // Simulate pack opening animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOpening(false);
    setSelectedPack(null);
    animationValue.value = withSpring(0);
  };

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
          <Package size={32} color="white" />
          <Text style={styles.headerTitle}>Virtual Vault</Text>
          <Text style={styles.headerSubtitle}>Experience the thrill of pack opening</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInRight.delay(400)}>
          <VaultStats 
            packsOpened={127}
            rareCards={23}
            totalValue={4850}
            achievements={['First Pull', 'Holographic Hunter', 'Set Master']}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Pack</Text>
          <View style={styles.packGrid}>
            {boosterPacks.map((pack, index) => (
              <BoosterPack
                key={pack.id}
                pack={pack}
                index={index}
                isSelected={selectedPack === pack.id}
                onPress={() => handlePackPress(pack.id)}
              />
            ))}
          </View>
        </Animated.View>

        {selectedPack && (
          <Animated.View entering={FadeInDown.delay(800)} style={styles.openSection}>
            <TouchableOpacity 
              style={styles.openButton}
              onPress={openPack}
              disabled={isOpening}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.openButtonGradient}
              >
                <Gift size={24} color="white" />
                <Text style={styles.openButtonText}>
                  {isOpening ? 'Opening...' : 'Open Pack'}
                </Text>
                <Sparkles size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View entering={FadeInRight.delay(1000)}>
          <RecentPulls />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000000' : '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
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
  packGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  openSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  openButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  openButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  openButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});