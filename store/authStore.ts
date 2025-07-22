import { create } from 'zustand';
import { supabase, getCurrentUser } from '../lib/supabase';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        const user: User = {
          id: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          profileImageURL: profile.profile_image_url,
          isPro: profile.is_pro,
          subscriptionStatus: profile.subscription_status,
          subscriptionId: profile.subscription_id,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
        };

        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    try {
      set({ isLoading: true });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            display_name: displayName,
            is_pro: false,
            subscription_status: 'inactive',
          });

        if (profileError) throw profileError;

        const user: User = {
          id: data.user.id,
          email,
          displayName,
          profileImageURL: null,
          isPro: false,
          subscriptionStatus: 'inactive',
          subscriptionId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set({ user, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (updates: Partial<User>) => {
    try {
      const { user } = get();
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updates.displayName,
          profile_image_url: updates.profileImageURL,
          is_pro: updates.isPro,
          subscription_status: updates.subscriptionStatus,
          subscription_id: updates.subscriptionId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      set({
        user: {
          ...user,
          ...updates,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        const user: User = {
          id: profile.id,
          email: profile.email,
          displayName: profile.display_name,
          profileImageURL: profile.profile_image_url,
          isPro: profile.is_pro,
          subscriptionStatus: profile.subscription_status,
          subscriptionId: profile.subscription_id,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
        };

        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  refreshUser: async () => {
    const { checkAuth } = get();
    await checkAuth();
  },
}));

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  } else if (event === 'SIGNED_IN' && session) {
    useAuthStore.getState().checkAuth();
  }
});