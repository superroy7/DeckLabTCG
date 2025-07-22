import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Star, Zap, Bot, Newspaper } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { searchCards, getFeaturedSets, getAdvancedSearch } from '@/services/pokemonTcgService';
import { newsService } from '@/services/newsService';
import { aiAssistantService } from '@/services/aiAssistantService';
import { CardSearchResult } from '@/types/pokemon';
import { CardItem } from '@/components/CardItem';
import { FeaturedSetCard } from '@/components/FeaturedSetCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PersistentSearchBar } from '@/components/PersistentSearchBar';
import { AIAssistantChat } from '@/components/AIAssistantChat';
import { PreGradingCard } from '@/components/PreGradingCard';
import { NewsCard } from '@/components/NewsCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
  const [featuredSets, setFeaturedSets] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(aiAssistantService.getCurrentTheme());

  const isDark = colorScheme === 'dark';

  useEffect(() => {
    loadFeaturedContent();
    loadLatestNews();
  }, []);

  const loadFeaturedContent = async () => {
    try {
      setIsLoading(true);
      const sets = await getFeaturedSets();
      setFeaturedSets(sets);
    } catch (error) {
      console.error('Error loading featured content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLatestNews = async () => {
    try {
      const news = await newsService.getLatestNews(undefined, 5);
      setLatestNews(news);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchCards(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedContent();
    await loadLatestNews();
    setRefreshing(false);
  };

  const handleThemeChange = (theme) => {
    setCurrentTheme(theme);
  };

  const handleNewsPress = (news) => {
    // Handle news item press - could navigate to detail view
    console.log('News pressed:', news.title);
  };

  const styles = getStyles(isDark);

  if (showAIChat) {
    return (
      <SafeAreaView style={styles.container}>
        <AIAssistantChat onThemeChange={handleThemeChange} />
        <TouchableOpacity 
          style={styles.closeAIButton}
          onPress={() => setShowAIChat(false)}
        >
          <Text style={styles.closeAIText}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={currentTheme.gradient}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>DeckLab TCG</Text>
          <Text style={styles.subtitle}>Your AI-Powered Pokemon TCG Companion</Text>
          
          <TouchableOpacity 
            style={styles.aiButton}
            onPress={() => setShowAIChat(true)}
          >
            <Bot size={20} color="white" />
            <Text style={styles.aiButtonText}>Ask DexAI</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>

      <PersistentSearchBar
        onSearch={handleSearch}
        value={searchQuery}
        placeholder="Search Pokemon cards..."
        onFilterPress={() => console.log('Filter pressed')}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <PreGradingCard 
          onStartGrading={() => console.log('Start grading')}
          onGradingComplete={(result) => console.log('Grading complete:', result)}
        />

        {isLoading && <LoadingSpinner />}

        {searchResults.length > 0 && (
          <Animated.View entering={FadeInRight.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {searchResults.map((card, index) => (
                <CardItem key={card.id} card={card} index={index} />
              ))}
            </ScrollView>
          </Animated.View>
        )}

        <Animated.View entering={FadeInRight.delay(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Sets</Text>
          <View style={styles.featuredGrid}>
            {featuredSets.map((set, index) => (
              <FeaturedSetCard key={set.id} set={set} index={index} />
            ))}
          </View>
        </Animated.View>

        {latestNews.length > 0 && (
          <Animated.View entering={FadeInRight.delay(1000)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Newspaper size={24} color={isDark ? '#ffffff' : '#1f2937'} />
              <Text style={styles.sectionTitle}>Latest News</Text>
            </View>
            {latestNews.slice(0, 3).map((news, index) => (
              <NewsCard 
                key={news.id} 
                news={news} 
                index={index}
                onPress={handleNewsPress}
              />
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeInRight.delay(1200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Market Highlights</Text>
          <View style={styles.marketHighlights}>
            <TouchableOpacity style={styles.marketCard}>
              <TrendingUp size={24} color="#10B981" />
              <Text style={styles.marketTitle}>Trending Up</Text>
              <Text style={styles.marketSubtitle}>Base Set Charizard</Text>
              <Text style={styles.marketPrice}>$12,450</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.marketCard}>
              <Star size={24} color="#F59E0B" />
              <Text style={styles.marketTitle}>Most Watched</Text>
              <Text style={styles.marketSubtitle}>Pikachu Illustrator</Text>
              <Text style={styles.marketPrice}>$85,000</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.marketCard}>
              <Zap size={24} color="#8B5CF6" />
              <Text style={styles.marketTitle}>Hot Deal</Text>
              <Text style={styles.marketSubtitle}>Neo Genesis Box</Text>
              <Text style={styles.marketPrice}>$2,399</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  appTitle: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 16,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    gap: 8,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  featuredGrid: {
    paddingHorizontal: 20,
  },
  marketHighlights: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  marketCard: {
    flex: 1,
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  marketTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: isDark ? '#cccccc' : '#6b7280',
    marginTop: 8,
  },
  marketSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginTop: 4,
    textAlign: 'center',
  },
  marketPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 4,
  },
  closeAIButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  closeAIText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});