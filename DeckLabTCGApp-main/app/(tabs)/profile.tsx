import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Trophy, Star, Bell, Palette, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { ProfileStats } from '@/components/ProfileStats';
import { ThemeSelector } from '@/components/ThemeSelector';
import { AchievementBadge } from '@/components/AchievementBadge';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('pikachu');
  
  const isDark = colorScheme === 'dark';

  const achievements = [
    { id: '1', name: 'First Collection', icon: 'star', earned: true },
    { id: '2', name: 'Pack Master', icon: 'package', earned: true },
    { id: '3', name: 'Rare Hunter', icon: 'diamond', earned: false },
    { id: '4', name: 'Trading Expert', icon: 'handshake', earned: false },
  ];

  const menuItems = [
    { icon: Settings, title: 'Settings', subtitle: 'App preferences and configuration' },
    { icon: Bell, title: 'Notifications', subtitle: 'Manage your notification preferences', hasSwitch: true },
    { icon: Palette, title: 'Theme', subtitle: 'Customize your app appearance' },
    { icon: Shield, title: 'Privacy & Security', subtitle: 'Manage your account security' },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'Get help and contact support' },
  ];

  const styles = getStyles(isDark);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Animated.View entering={FadeInDown.delay(200)} style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#FF6B6B', '#4ECDC4']}
              style={styles.avatar}
            >
              <User size={32} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.userName}>Pokemon Trainer</Text>
          <Text style={styles.userLevel}>Level 24 • Collector</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInRight.delay(400)}>
          <ProfileStats 
            cardsCollected={1247}
            setsCompleted={8}
            totalValue={15420}
            tradingRating={4.8}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsContainer}>
              {achievements.map((achievement, index) => (
                <AchievementBadge 
                  key={achievement.id}
                  achievement={achievement}
                  index={index}
                />
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(800)} style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.menuItem}
                onPress={() => {}}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <item.icon size={20} color={isDark ? '#ffffff' : '#374151'} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                {item.hasSwitch ? (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: '#767577', true: '#10B981' }}
                    thumbColor={notificationsEnabled ? '#ffffff' : '#f4f3f4'}
                  />
                ) : (
                  <View style={styles.menuArrow} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
          <TouchableOpacity style={styles.signOutButton}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
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
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLevel: {
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
  achievementsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  menuContainer: {
    marginHorizontal: 20,
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#333333' : '#f3f4f6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#333333' : '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  menuArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: isDark ? '#666666' : '#9ca3af',
    transform: [{ rotate: '45deg' }],
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: isDark ? '#1a1a1a' : 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});