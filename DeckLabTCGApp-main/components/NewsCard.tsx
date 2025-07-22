import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, ExternalLink, TrendingUp, Trophy, Package } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NewsItem } from '@/types/pokemon';

interface NewsCardProps {
  news: NewsItem;
  index: number;
  onPress: (news: NewsItem) => void;
}

export function NewsCard({ news, index, onPress }: NewsCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'market': return TrendingUp;
      case 'competitive': return Trophy;
      case 'releases': return Package;
      default: return ExternalLink;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'market': return '#10B981';
      case 'competitive': return '#3B82F6';
      case 'releases': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const CategoryIcon = getCategoryIcon(news.category);
  const categoryColor = getCategoryColor(news.category);
  const styles = getStyles(isDark);

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity style={styles.container} onPress={() => onPress(news)}>
        <LinearGradient
          colors={isDark ? ['#1f2937', '#374151'] : ['#ffffff', '#f8fafc']}
          style={styles.card}
        >
          {news.imageUrl && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: news.imageUrl }} style={styles.image} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageOverlay}
              />
            </View>
          )}

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={[styles.categoryBadge, { backgroundColor: `${categoryColor}20` }]}>
                <CategoryIcon size={12} color={categoryColor} />
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {news.category.toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.timeContainer}>
                <Clock size={12} color={isDark ? '#9ca3af' : '#6b7280'} />
                <Text style={styles.timeText}>{formatTimeAgo(news.publishedAt)}</Text>
              </View>
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {news.title}
            </Text>

            <Text style={styles.summary} numberOfLines={3}>
              {news.summary}
            </Text>

            <View style={styles.footer}>
              <Text style={styles.source}>{news.source}</Text>
              
              <View style={styles.tags}>
                {news.tags.slice(0, 2).map((tag, tagIndex) => (
                  <View key={tagIndex} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  summary: {
    fontSize: 14,
    color: isDark ? '#d1d5db' : '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 12,
    fontWeight: '600',
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
});