@@ .. @@
 import { useEffect } from 'react';
 import { Stack } from 'expo-router';
 import { StatusBar } from 'expo-status-bar';
+import { StripeProvider } from '@stripe/stripe-react-native';
 import { useFrameworkReady } from '@/hooks/useFrameworkReady';
+import { useAuthStore } from '@/store/authStore';
+import { useCollectionStore } from '@/store/collectionStore';
 
 export default function RootLayout() {
   useFrameworkReady();
+  const { checkAuth, isAuthenticated } = useAuthStore();
+  const { syncCollection } = useCollectionStore();
+
+  useEffect(() => {
+    checkAuth();
+  }, []);
+
+  useEffect(() => {
+    if (isAuthenticated) {
+      syncCollection();
+    }
+  }, [isAuthenticated]);
 
   return (
-    <>
-      <Stack screenOptions={{ headerShown: false }}>
-        <Stack.Screen name="+not-found" />
-      </Stack>
-      <StatusBar style="auto" />
-    </>
+    <StripeProvider
+      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
+      merchantIdentifier="merchant.com.decklab.tcg"
+    >
+      <Stack screenOptions={{ headerShown: false }}>
+        <Stack.Screen name="+not-found" />
+      </Stack>
+      <StatusBar style="auto" />
+    </StripeProvider>
   );
 }