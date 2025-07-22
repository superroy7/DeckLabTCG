// Database Types for Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          profile_image_url: string | null;
          is_pro: boolean;
          subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due';
          subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          profile_image_url?: string | null;
          is_pro?: boolean;
          subscription_status?: 'active' | 'inactive' | 'canceled' | 'past_due';
          subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          profile_image_url?: string | null;
          is_pro?: boolean;
          subscription_status?: 'active' | 'inactive' | 'canceled' | 'past_due';
          subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          image_url: string | null;
          game: string;
          rarity: string;
          set: string;
          collection_number: string;
          value: number | null;
          is_holographic: boolean;
          is_reverse_holo: boolean;
          is_secret_rare: boolean;
          acquired_date: string;
          source: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          image_url?: string | null;
          game: string;
          rarity: string;
          set: string;
          collection_number: string;
          value?: number | null;
          is_holographic?: boolean;
          is_reverse_holo?: boolean;
          is_secret_rare?: boolean;
          acquired_date: string;
          source: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          image_url?: string | null;
          game?: string;
          rarity?: string;
          set?: string;
          collection_number?: string;
          value?: number | null;
          is_holographic?: boolean;
          is_reverse_holo?: boolean;
          is_secret_rare?: boolean;
          acquired_date?: string;
          source?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      card_gradings: {
        Row: {
          id: string;
          card_id: string;
          user_id: string;
          overall_grade: number;
          centering: number;
          corners: number;
          edges: number;
          surface: number;
          confidence: number;
          grading_company: string;
          verification_id: string;
          flaws: any; // JSON
          date_graded: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          card_id: string;
          user_id: string;
          overall_grade: number;
          centering: number;
          corners: number;
          edges: number;
          surface: number;
          confidence: number;
          grading_company: string;
          verification_id: string;
          flaws: any; // JSON
          date_graded: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          card_id?: string;
          user_id?: string;
          overall_grade?: number;
          centering?: number;
          corners?: number;
          edges?: number;
          surface?: number;
          confidence?: number;
          grading_company?: string;
          verification_id?: string;
          flaws?: any; // JSON
          date_graded?: string;
          created_at?: string;
        };
      };
      stripe_customers: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      stripe_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: string;
          price_id: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          status: string;
          price_id: string;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          status?: string;
          price_id?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      stripe_user_subscriptions: {
        Row: {
          user_id: string;
          subscription_id: string;
          status: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
        };
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}