import React, { useState, useEffect } from 'react';
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
import { Plus, Grid3x3 as Grid3X3, List, Filter, Search } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { CollectionCard } from '@/components/CollectionCard';
import { CollectionStats } from '@/components/CollectionStats';
import { EmptyCollection } from '@/components/EmptyCollection';

const { width } = Dimensions.get('window');

export default function CollectionScreen() {
  const colorScheme = useColorScheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [collection, setCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      setIsLoading(true);
      // Simulate loading collection data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCollection([]);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#4f46e5', '#7c3aed']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Collection</Text>
          <Text style={styles.headerSubtitle}>Organize and track your Pokemon cards</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? 
                <List size={20} color="white" /> : 
                <Grid3X3 size={20} color="white" />
              }
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Filter size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Search size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInRight.delay(400)}>
          <CollectionStats 
            totalCards={collection.length}
            totalValue={0}
            sets={0}
            lastUpdated={new Date()}
          />
        </Animated.View>

        {collection.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(600)}>
            <EmptyCollection />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInRight.delay(600)} style={styles.collectionGrid}>
            {collection.map((card, index) => (
              <CollectionCard 
                key={card.id} 
                card={card} 
                index={index}
                viewMode={viewMode}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton}>
        <LinearGradient
          colors={['#10B981', '#059669']}
          style={styles.addButtonGradient}
        >
          <Plus size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  collectionGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  addButton: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});