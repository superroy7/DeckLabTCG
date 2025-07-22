@@ .. @@
 import { createClient } from '@supabase/supabase-js';
+import { Database } from '../types/database';
 
 const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
 const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
 
-export const supabase = createClient(supabaseUrl, supabaseAnonKey);
+export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
+  auth: {
+    autoRefreshToken: true,
+    persistSession: true,
+    detectSessionInUrl: false,
+  },
+});
+
+// Helper function to handle Supabase errors
+export const handleSupabaseError = (error: any) => {
+  console.error('Supabase error:', error);
+  
+  if (error?.message) {
+    return error.message;
+  }
+  
+  if (error?.error_description) {
+    return error.error_description;
+  }
+  
+  return 'An unexpected error occurred';
+};
+
+// Helper function to check if user is authenticated
+export const isAuthenticated = async () => {
+  const { data: { session } } = await supabase.auth.getSession();
+  return !!session;
+};
+
+// Helper function to get current user
+export const getCurrentUser = async () => {
+  const { data: { user } } = await supabase.auth.getUser();
+  return user;
+};
+
+// Helper function to sign out
+export const signOut = async () => {
+  const { error } = await supabase.auth.signOut();
+  if (error) throw error;
+};