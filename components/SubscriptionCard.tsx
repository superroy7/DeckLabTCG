@@ .. @@
 import React from 'react';
 import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   useColorScheme,
+  Alert,
 } from 'react-native';
 import { LinearGradient } from 'expo-linear-gradient';
-import { Crown, Check } from 'lucide-react-native';
+import { Crown, Check, Loader } from 'lucide-react-native';
 import Animated, { FadeInDown } from 'react-native-reanimated';
+import { useAuthStore } from '../store/authStore';
+import { stripeService } from '../services/stripeService';
+import { SUBSCRIPTION_PLANS } from '../lib/constants';
 
-interface SubscriptionCardProps {
-  onUpgrade: () => void;
-}
+export function SubscriptionCard() {
+  const { user } = useAuthStore();
+  const [isLoading, setIsLoading] = React.useState(false);
+  const colorScheme = useColorScheme();
+  const isDark = colorScheme === 'dark';
 
-export function SubscriptionCard({ onUpgrade }: SubscriptionCardProps) {
-  const colorScheme = useColorScheme();
-  const isDark = colorScheme === 'dark';
+  const handleUpgrade = async () => {
+    if (!user) {
+      Alert.alert('Authentication Required', 'Please sign in to upgrade to Pro.');
+      return;
+    }
+
+    try {
+      setIsLoading(true);
+      await stripeService.createCheckoutSession(SUBSCRIPTION_PLANS.PRO.stripePriceId);
+    } catch (error) {
+      console.error('Upgrade error:', error);
+      Alert.alert('Upgrade Error', 'Failed to start upgrade process. Please try again.');
+    } finally {
+      setIsLoading(false);
+    }
+  };
+
+  if (user?.isPro) {
+    return (
+      <Animated.View entering={FadeInDown.delay(200)} style={styles.container}>
+        <LinearGradient
+          colors={isDark ? ['#1f2937', '#374151'] : ['#ffffff', '#f8fafc']}
+          style={styles.card}
+        >
+          <View style={styles.header}>
+            <Crown size={24} color="#10B981" />
+            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#1f2937' }]}>
+              Pro Member
+            </Text>
+          </View>
+          
+          <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
+            You have access to all Pro features!
+          </Text>
+          
+          <View style={styles.features}>
+            {SUBSCRIPTION_PLANS.PRO.features.slice(0, 3).map((feature, index) => (
+              <View key={index} style={styles.feature}>
+                <Check size={16} color="#10B981" />
+                <Text style={[styles.featureText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
+                  {feature}
+                </Text>
+              </View>
+            ))}
+          </View>
+        </LinearGradient>
+      </Animated.View>
+    );
+  }
 
   const styles = getStyles(isDark);
 
   return (
     <Animated.View entering={FadeInDown.delay(200)} style={styles.container}>
       <LinearGradient
         colors={isDark ? ['#1f2937', '#374151'] : ['#ffffff', '#f8fafc']}
         style={styles.card}
       >
         <View style={styles.header}>
           <Crown size={24} color="#F59E0B" />
-          <Text style={styles.title}>Upgrade to Pro</Text>
+          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#1f2937' }]}>
+            Upgrade to Pro
+          </Text>
         </View>
         
-        <Text style={styles.description}>
-          Unlock advanced features and unlimited collection management
+        <Text style={[styles.description, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
+          {SUBSCRIPTION_PLANS.PRO.description}
         </Text>
         
+        <View style={styles.pricing}>
+          <Text style={[styles.price, { color: isDark ? '#ffffff' : '#1f2937' }]}>
+            ${SUBSCRIPTION_PLANS.PRO.price}
+          </Text>
+          <Text style={[styles.period, { color: isDark ? '#9ca3af' : '#6b7280' }]}>
+            /month
+          </Text>
+        </View>
+        
         <View style={styles.features}>
-          <View style={styles.feature}>
-            <Check size={16} color="#10B981" />
-            <Text style={styles.featureText}>Unlimited card scanning</Text>
-          </View>
-          <View style={styles.feature}>
-            <Check size={16} color="#10B981" />
-            <Text style={styles.featureText}>AI-powered grading</Text>
-          </View>
-          <View style={styles.feature}>
-            <Check size={16} color="#10B981" />
-            <Text style={styles.featureText}>Advanced market analytics</Text>
-          </View>
+          {SUBSCRIPTION_PLANS.PRO.features.slice(0, 4).map((feature, index) => (
+            <View key={index} style={styles.feature}>
+              <Check size={16} color="#10B981" />
+              <Text style={[styles.featureText, { color: isDark ? '#d1d5db' : '#4b5563' }]}>
+                {feature}
+              </Text>
+            </View>
+          ))}
         </View>
         
-        <TouchableOpacity style={styles.upgradeButton} onPress={onUpgrade}>
+        <TouchableOpacity 
+          style={[styles.upgradeButton, isLoading && styles.upgradeButtonDisabled]} 
+          onPress={handleUpgrade}
+          disabled={isLoading}
+        >
           <LinearGradient
-            colors={['#F59E0B', '#D97706']}
+            colors={isLoading ? ['#6b7280', '#9ca3af'] : ['#F59E0B', '#D97706']}
             style={styles.upgradeButtonGradient}
           >
-            <Crown size={20} color="white" />
-            <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
+            {isLoading ? (
+              <Loader size={20} color="white" />
+            ) : (
+              <Crown size={20} color="white" />
+            )}
+            <Text style={styles.upgradeButtonText}>
+              {isLoading ? 'Processing...' : 'Upgrade Now'}
+            </Text>
           </LinearGradient>
         </TouchableOpacity>
       </LinearGradient>
@@ .. @@
     marginBottom: 20,
   },
   title: {
     fontSize: 20,
     fontWeight: 'bold',
-    color: isDark ? '#ffffff' : '#1f2937',
     marginLeft: 8,
   },
   description: {
     fontSize: 14,
-    color: isDark ? '#d1d5db' : '#4b5563',
     marginBottom: 16,
     lineHeight: 20,
   },
+  pricing: {
+    flexDirection: 'row',
+    alignItems: 'baseline',
+    marginBottom: 16,
+  },
+  price: {
+    fontSize: 28,
+    fontWeight: 'bold',
+  },
+  period: {
+    fontSize: 16,
+    marginLeft: 4,
+  },
   features: {
     marginBottom: 20,
     gap: 8,
@@ .. @@
   },
   featureText: {
     fontSize: 14,
-    color: isDark ? '#d1d5db' : '#4b5563',
     marginLeft: 8,
     flex: 1,
   },
   upgradeButton: {
     borderRadius: 12,
     overflow: 'hidden',
   },
+  upgradeButtonDisabled: {
+    opacity: 0.6,
+  },
   upgradeButtonGradient: {
     flexDirection: 'row',
     alignItems: 'center',