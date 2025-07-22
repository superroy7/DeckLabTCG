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
   try {
     const supabaseClient = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
@@ .. @@
     return new Response(
       JSON.stringify({ url: session.url }),
       { 
         headers: { 
-          'Content-Type': 'application/json' 
+          'Content-Type': 'application/json',
+          ...corsHeaders
         },
         status: 200 
       }
@@ .. @@
     return new Response(
       JSON.stringify({ error: error.message }),
       { 
         headers: { 
-          'Content-Type': 'application/json' 
+          'Content-Type': 'application/json',
+          ...corsHeaders
         },
         status: 400 
       }