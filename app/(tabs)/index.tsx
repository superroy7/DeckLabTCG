@@ .. @@
 import { LinearGradient } from 'expo-linear-gradient';
 import { TrendingUp, Star, Zap, Bot, Newspaper } from 'lucide-react-native';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
-import { searchCards, getFeaturedSets, getAdvancedSearch } from '@/services/pokemonTcgService';
-import { newsService } from '@/services/newsService';
-import { aiAssistantService } from '@/services/aiAssistantService';
-import { CardSearchResult } from '@/types/pokemon';
+import { pokemonTcgService, PokemonCard, PokemonSet } from '@/services/pokemonTcgService';
+import { useAuthStore } from '@/store/authStore';
+import { useCollectionStore } from '@/store/collectionStore';
 import { CardItem } from '@/components/CardItem';
 import { FeaturedSetCard } from '@/components/FeaturedSetCard';
 import { LoadingSpinner } from '@/components/LoadingSpinner';
 import { PersistentSearchBar } from '@/components/PersistentSearchBar';
-import { AIAssistantChat } from '@/components/AIAssistantChat';
-import { PreGradingCard } from '@/components/PreGradingCard';
-import { NewsCard } from '@/components/NewsCard';
+import { SubscriptionCard } from '@/components/SubscriptionCard';
 
 const { width } = Dimensions.get('window');
 
 export default function HomeScreen() {
   const colorScheme = useColorScheme();
+  const { user } = useAuthStore();
+  const { cards, totalValue } = useCollectionStore();
   const isDark = colorScheme === 'dark';
   const scrollViewRef = useRef<ScrollView>(null);
   
   const [searchQuery, setSearchQuery] = useState('');
-  const [searchResults, setSearchResults] = useState<CardSearchResult[]>([]);
-  const [featuredSets, setFeaturedSets] = useState([]);
-  const [latestNews, setLatestNews] = useState([]);
+  const [searchResults, setSearchResults] = useState<PokemonCard[]>([]);
+  const [featuredSets, setFeaturedSets] = useState<PokemonSet[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
-  const [showAIChat, setShowAIChat] = useState(false);
-  const [currentTheme, setCurrentTheme] = useState(aiAssistantService.getCurrentTheme());
 
   useEffect(() => {
     loadFeaturedContent();
-    loadLatestNews();
   }, []);
 
   const loadFeaturedContent = async () => {
     try {
       setIsLoading(true);
-      const sets = await getFeaturedSets();
+      const sets = await pokemonTcgService.getSets();
       setFeaturedSets(sets);
     } catch (error) {
       console.error('Error loading featured content:', error);
@@ .. @@
     }
   };
 
-  const loadLatestNews = async () => {
-    try {
-      const news = await newsService.getLatestNews(undefined, 5);
-      setLatestNews(news);
-    } catch (error) {
-      console.error('Error loading news:', error);
-    }
-  };
-
   const handleSearch = async (query: string) => {
     setSearchQuery(query);
     if (!query.trim()) {
@@ .. @@
 
     try {
       setIsLoading(true);
-      const results = await searchCards(query);
-      setSearchResults(results);
+      const response = await pokemonTcgService.searchCards(query);
+      setSearchResults(response.data);
     } catch (error) {
       console.error('Search error:', error);
     } finally {
@@ .. @@
   const onRefresh = async () => {
     setRefreshing(true);
     await loadFeaturedContent();
-    await loadLatestNews();
     setRefreshing(false);
   };
 
-  const handleThemeChange = (theme) => {
-    setCurrentTheme(theme);
-  };
-
-  const handleNewsPress = (news) => {
-    // Handle news item press - could navigate to detail view
-    console.log('News pressed:', news.title);
-  };
-
   const styles = getStyles(isDark);
 
-  if (showAIChat) {
-    return (
-      <SafeAreaView style={styles.container}>
-        <AIAssistantChat onThemeChange={handleThemeChange} />
-        <TouchableOpacity 
-          style={styles.closeAIButton}
-          onPress={() => setShowAIChat(false)}
-        >
-          <Text style={styles.closeAIText}>Close</Text>
-        </TouchableOpacity>
-      </SafeAreaView>
-    );
-  }
-
   return (
     <SafeAreaView style={styles.container}>
       <LinearGradient
-        colors={currentTheme.gradient}
+        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#4f46e5', '#7c3aed']}
         style={styles.header}
       >
         <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
           <Text style={styles.welcomeText}>Welcome to</Text>
           <Text style={styles.appTitle}>DeckLab TCG</Text>
           <Text style={styles.subtitle}>Your AI-Powered Pokemon TCG Companion</Text>
-          
-          <TouchableOpacity 
-            style={styles.aiButton}
-            onPress={() => setShowAIChat(true)}
-          >
-            <Bot size={20} color="white" />
-            <Text style={styles.aiButtonText}>Ask DexAI</Text>
-          </TouchableOpacity>
+          
+          {user && (
+            <View style={styles.userStats}>
+              <Text style={styles.statText}>{cards.length} Cards</Text>
+              <Text style={styles.statText}>${totalValue.toFixed(2)} Value</Text>
+              {user.isPro && <Text style={styles.proText}>PRO</Text>}
+            </View>
+          )}
         </Animated.View>
       </LinearGradient>
 
@@ .. @@
         showsVerticalScrollIndicator={false}
       >
-        <PreGradingCard 
-          onStartGrading={() => console.log('Start grading')}
-          onGradingComplete={(result) => console.log('Grading complete:', result)}
-        />
+        {!user?.isPro && (
+          <Animated.View entering={FadeInDown.delay(400)}>
+            <SubscriptionCard />
+          </Animated.View>
+        )}
 
         {isLoading && <LoadingSpinner />}
 
@@ .. @@
           </View>
         </Animated.View>
 
-        {latestNews.length > 0 && (
-          <Animated.View entering={FadeInRight.delay(1000)} style={styles.section}>
-            <View style={styles.sectionHeader}>
-              <Newspaper size={24} color={isDark ? '#ffffff' : '#1f2937'} />
-              <Text style={styles.sectionTitle}>Latest News</Text>
-            </View>
-            {latestNews.slice(0, 3).map((news, index) => (
-              <NewsCard 
-                key={news.id} 
-                news={news} 
-                index={index}
-                onPress={handleNewsPress}
-              />
-            ))}
-          </Animated.View>
-        )}
-
         <Animated.View entering={FadeInRight.delay(1200)} style={styles.section}>
           <Text style={styles.sectionTitle}>Market Highlights</Text>
           <View style={styles.marketHighlights}>
@@ .. @@
     textAlign: 'center',
     marginBottom: 16,
   },
-  aiButton: {
-    flexDirection: 'row',
-    alignItems: 'center',
-    paddingHorizontal: 16,
-    paddingVertical: 8,
-    backgroundColor: 'rgba(255, 255, 255, 0.2)',
-    borderRadius: 20,
-    gap: 8,
-  },
-  aiButtonText: {
-    color: 'white',
-    fontSize: 14,
-    fontWeight: '600',
+  userStats: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    gap: 16,
+    marginTop: 8,
+  },
+  statText: {
+    color: 'rgba(255, 255, 255, 0.9)',
+    fontSize: 14,
+    fontWeight: '500',
+  },
+  proText: {
+    color: '#10B981',
+    fontSize: 12,
+    fontWeight: 'bold',
+    backgroundColor: 'rgba(16, 185, 129, 0.2)',
+    paddingHorizontal: 8,
+    paddingVertical: 2,
+    borderRadius: 8,
   },
   content: {
     flex: 1,
@@ .. @@
     color: '#10B981',
     marginTop: 4,
   },
-  closeAIButton: {
-    position: 'absolute',
-    top: 60,
-    right: 20,
-    paddingHorizontal: 16,
-    paddingVertical: 8,
-    backgroundColor: 'rgba(0, 0, 0, 0.5)',
-    borderRadius: 20,
-  },
-  closeAIText: {
-    color: 'white',
-    fontSize: 14,
-    fontWeight: '600',
-  },
 });