import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, X, TrendingUp, Clock, Star } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { searchCards, getAdvancedSearch, getFeaturedSets } from '@/services/pokemonTcgService';
import { CardSearchResult, PokemonSet } from '@/types/pokemon';
import { CardItem } from '@/components/CardItem';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PersistentSearchBar } from '@/components/PersistentSearchBar';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState([
    'Charizard', 'Pikachu', 'Base Set', 'Shadowless', 'First Edition',
    'Lugia', 'Mewtwo', 'Blastoise', 'Venusaur', 'Neo Genesis'
  ]);
  const [featuredSets, setFeaturedSets] = useState<PokemonSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    set: '',
    type: '',
    rarity: '',
    hp: { min: '', max: '' },
  });

  useEffect(() => {
    loadFeaturedSets();
  }, []);

  const loadFeaturedSets = async () => {
    try {
      const sets = await getFeaturedSets();
      setFeaturedSets(sets.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured sets:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      
      // Add to recent searches
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev.slice(0, 9)]);
      }

      const results = await searchCards(query, {
        set: filters.set || undefined,
        type: filters.type || undefined,
        rarity: filters.rarity || undefined,
      });
      
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendingSearch = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  const clearFilters = () => {
    setFilters({
      set: '',
      type: '',
      rarity: '',
      hp: { min: '', max: '' },
    });
  };

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#4f46e5', '#7c3aed']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
          <Text style={styles.headerTitle}>Search Cards</Text>
          <Text style={styles.headerSubtitle}>Find any Pokemon card instantly</Text>
        </Animated.View>
      </LinearGradient>

      <PersistentSearchBar
        onSearch={handleSearch}
        value={searchQuery}
        placeholder="Search Pokemon cards..."
        onFilterPress={() => setShowFilters(true)}
        showFilter={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchResults.length > 0 ? (
          <Animated.View entering={FadeInRight.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchResults.length})
            </Text>
            <View style={styles.resultsGrid}>
              {searchResults.map((card, index) => (
                <View key={card.id} style={styles.cardContainer}>
                  <CardItem card={card} index={index} />
                </View>
              ))}
            </View>
          </Animated.View>
        ) : (
          <>
            {recentSearches.length > 0 && (
              <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={isDark ? '#ffffff' : '#1f2937'} />
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.tagsContainer}>
                    {recentSearches.map((search, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.tag}
                        onPress={() => handleTrendingSearch(search)}
                      >
                        <Text style={styles.tagText}>{search}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </Animated.View>
            )}

            <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={isDark ? '#ffffff' : '#1f2937'} />
                <Text style={styles.sectionTitle}>Trending Searches</Text>
              </View>
              <View style={styles.trendingGrid}>
                {trendingSearches.map((term, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.trendingItem}
                    onPress={() => handleTrendingSearch(term)}
                  >
                    <Text style={styles.trendingText}>{term}</Text>
                    <TrendingUp size={16} color="#10B981" />
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Star size={20} color={isDark ? '#ffffff' : '#1f2937'} />
                <Text style={styles.sectionTitle}>Browse by Set</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.setsContainer}>
                  {featuredSets.map((set, index) => (
                    <TouchableOpacity
                      key={set.id}
                      style={styles.setCard}
                      onPress={() => handleTrendingSearch(`set:${set.id}`)}
                    >
                      <Text style={styles.setName}>{set.name}</Text>
                      <Text style={styles.setInfo}>{set.total} cards</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </Animated.View>
          </>
        )}

        {isLoading && <LoadingSpinner />}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Search Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <X size={24} color={isDark ? '#ffffff' : '#1f2937'} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.filterLabel}>Set</Text>
            <View style={styles.filterOptions}>
              {['base1', 'jungle', 'fossil', 'base2'].map((set) => (
                <TouchableOpacity
                  key={set}
                  style={[
                    styles.filterOption,
                    filters.set === set && styles.filterOptionActive,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, set: prev.set === set ? '' : set }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.set === set && styles.filterOptionTextActive,
                  ]}>
                    {set.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.filterOptions}>
              {['Fire', 'Water', 'Grass', 'Electric', 'Psychic'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filters.type === type && styles.filterOptionActive,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, type: prev.type === type ? '' : type }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.type === type && styles.filterOptionTextActive,
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterLabel}>Rarity</Text>
            <View style={styles.filterOptions}>
              {['Common', 'Uncommon', 'Rare', 'Rare Holo'].map((rarity) => (
                <TouchableOpacity
                  key={rarity}
                  style={[
                    styles.filterOption,
                    filters.rarity === rarity && styles.filterOptionActive,
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, rarity: prev.rarity === rarity ? '' : rarity }))}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filters.rarity === rarity && styles.filterOptionTextActive,
                  ]}>
                    {rarity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={() => {
                setShowFilters(false);
                if (searchQuery) handleSearch(searchQuery);
              }}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  resultsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardContainer: {
    width: '47%',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    color: isDark ? '#d1d5db' : '#4b5563',
    fontWeight: '500',
  },
  trendingGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingText: {
    fontSize: 14,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  setsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  setCard: {
    width: 120,
    padding: 16,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  setName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  setInfo: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? '#000000' : '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 12,
    marginTop: 20,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: isDark ? '#d1d5db' : '#4b5563',
  },
  filterOptionTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#d1d5db' : '#4b5563',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});