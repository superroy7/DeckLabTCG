@@ .. @@
 import { LinearGradient } from 'expo-linear-gradient';
 import { User, Settings, Trophy, Star, Bell, Palette, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
 import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
+import { useAuthStore } from '@/store/authStore';
+import { useCollectionStore } from '@/store/collectionStore';
 import { ProfileStats } from '@/components/ProfileStats';
-import { ThemeSelector } from '@/components/ThemeSelector';
+import { SubscriptionCard } from '@/components/SubscriptionCard';
 import { AchievementBadge } from '@/components/AchievementBadge';
 
 export default function ProfileScreen() {
   const colorScheme = useColorScheme();
+  const { user, signOut } = useAuthStore();
+  const { cards, totalValue } = useCollectionStore();
   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
-  const [selectedTheme, setSelectedTheme] = useState('pikachu');
   
   const isDark = colorScheme === 'dark';
 
+  const handleSignOut = async () => {
+    try {
+      await signOut();
+    } catch (error) {
+      console.error('Sign out error:', error);
+    }
+  };
+
   const achievements = [
     { id: '1', name: 'First Collection', icon: 'star', earned: true },
     { id: '2', name: 'Pack Master', icon: 'package', earned: true },
@@ .. @@
           <View style={styles.avatarContainer}>
             <LinearGradient
               colors={['#FF6B6B', '#4ECDC4']}
               style={styles.avatar}
             >
               <User size={32} color="white" />
             </LinearGradient>
           </View>
-          <Text style={styles.userName}>Pokemon Trainer</Text>
-          <Text style={styles.userLevel}>Level 24 • Collector</Text>
+          <Text style={styles.userName}>
+            {user?.displayName || 'Pokemon Trainer'}
+          </Text>
+          <Text style={styles.userLevel}>
+            {user?.isPro ? 'Pro Member' : 'Free Member'} • Collector
+          </Text>
         </Animated.View>
       </LinearGradient>
 
       <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
         <Animated.View entering={FadeInRight.delay(400)}>
           <ProfileStats 
-            cardsCollected={1247}
-            setsCompleted={8}
-            totalValue={15420}
+            cardsCollected={cards.length}
+            setsCompleted={0} // TODO: Calculate from cards
+            totalValue={totalValue}
             tradingRating={4.8}
           />
         </Animated.View>
 
+        {!user?.isPro && (
+          <Animated.View entering={FadeInDown.delay(500)}>
+            <SubscriptionCard />
+          </Animated.View>
+        )}
+
         <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
           <Text style={styles.sectionTitle}>Recent Achievements</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
@@ .. @@
         </Animated.View>
 
         <Animated.View entering={FadeInDown.delay(1000)} style={styles.section}>
-          <TouchableOpacity style={styles.signOutButton}>
+          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
             <LogOut size={20} color="#EF4444" />
             <Text style={styles.signOutText}>Sign Out</Text>
           </TouchableOpacity>