import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Keyboard,
} from 'react-native';
import { Search, X, Filter } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface PersistentSearchBarProps {
  onSearch: (query: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
  value?: string;
  showFilter?: boolean;
}

export function PersistentSearchBar({ 
  onSearch, 
  onFilterPress, 
  placeholder = "Search Pokemon cards...",
  value = "",
  showFilter = true 
}: PersistentSearchBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  
  const focusScale = useSharedValue(1);
  const borderWidth = useSharedValue(1);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    focusScale.value = withSpring(1.02);
    borderWidth.value = withTiming(2);
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusScale.value = withSpring(1);
    borderWidth.value = withTiming(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    Keyboard.dismiss();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
    borderWidth: borderWidth.value,
  }));

  const styles = getStyles(isDark, isFocused);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.searchContainer}>
        <Search size={20} color={isDark ? '#9ca3af' : '#6b7280'} style={styles.searchIcon} />
        
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType="search"
          onSubmitEditing={() => onSearch(searchQuery)}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={18} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        )}

        {showFilter && (
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
            <Filter size={20} color={isDark ? '#9ca3af' : '#6b7280'} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean, isFocused: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderColor: isFocused 
      ? '#3b82f6' 
      : isDark ? '#374151' : '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: isDark ? '#ffffff' : '#1f2937',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
  },
});