@@ .. @@
 import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
 import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 import Stripe from 'https://esm.sh/stripe@14.21.0'
 
+const corsHeaders = {
+  'Access-Control-Allow-Origin': '*',
+  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
+}
+
 serve(async (req) => {
+  if (req.method === 'OPTIONS') {
+    return new Response('ok', { headers: corsHeaders })
+  }
+
   const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
     apiVersion: '2023-10-16',
   })
@@ .. @@
     console.log('✅ Success:', event.id)
     return new Response(JSON.stringify({ received: true }), {
       status: 200,
-      headers: { 'Content-Type': 'application/json' },
+      headers: { 
+        'Content-Type': 'application/json',
+        ...corsHeaders
+      },
     })
   } catch (err) {
     console.log('❌ Error message:', err.message)
     return new Response(JSON.stringify({ error: err.message }), {
       status: 400,
-      headers: { 'Content-Type': 'application/json' },
+      headers: { 
+        'Content-Type': 'application/json',
+        ...corsHeaders
+      },
     })
   }
 })