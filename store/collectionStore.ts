import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Card, Collection } from '../types';
import { useAuthStore } from './authStore';

interface CollectionState {
  cards: Card[];
  collections: Collection[];
  isLoading: boolean;
  totalValue: number;
  addCard: (card: Omit<Card, 'id'>) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  loadCards: () => Promise<void>;
  createCollection: (name: string, description?: string) => Promise<void>;
  loadCollections: () => Promise<void>;
  syncCollection: () => Promise<void>;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  cards: [],
  collections: [],
  isLoading: false,
  totalValue: 0,

  addCard: async (cardData: Omit<Card, 'id'>) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');

      // Check collection limits for free users
      if (!user.isPro && get().cards.length >= 100) {
        throw new Error('Collection limit reached. Upgrade to Pro for unlimited cards.');
      }

      const { data, error } = await supabase
        .from('cards')
        .insert({
          user_id: user.id,
          name: cardData.name,
          image_url: cardData.imageUrl,
          game: cardData.game,
          rarity: cardData.rarity,
          set: cardData.set,
          collection_number: cardData.collectionNumber,
          value: cardData.value,
          is_holographic: cardData.isHolographic,
          is_reverse_holo: cardData.isReverseHolo,
          is_secret_rare: cardData.isSecretRare,
          acquired_date: cardData.acquiredDate.toISOString(),
          source: cardData.source,
        })
        .select()
        .single();

      if (error) throw error;

      const newCard: Card = {
        id: data.id,
        name: data.name,
        imageUrl: data.image_url,
        game: data.game as any,
        rarity: data.rarity as any,
        set: data.set,
        collectionNumber: data.collection_number,
        value: data.value,
        isHolographic: data.is_holographic,
        isReverseHolo: data.is_reverse_holo,
        isSecretRare: data.is_secret_rare,
        acquiredDate: new Date(data.acquired_date),
        source: data.source as any,
      };

      set(state => ({
        cards: [...state.cards, newCard],
        totalValue: state.totalValue + (newCard.value || 0),
      }));
    } catch (error) {
      throw error;
    }
  },

  removeCard: async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      set(state => {
        const cardToRemove = state.cards.find(c => c.id === cardId);
        return {
          cards: state.cards.filter(c => c.id !== cardId),
          totalValue: state.totalValue - (cardToRemove?.value || 0),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  updateCard: async (cardId: string, updates: Partial<Card>) => {
    try {
      const { error } = await supabase
        .from('cards')
        .update({
          name: updates.name,
          image_url: updates.imageUrl,
          value: updates.value,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cardId);

      if (error) throw error;

      set(state => ({
        cards: state.cards.map(card =>
          card.id === cardId ? { ...card, ...updates } : card
        ),
        totalValue: state.cards.reduce((total, card) => 
          total + (card.id === cardId ? (updates.value || card.value || 0) : (card.value || 0)), 0
        ),
      }));
    } catch (error) {
      throw error;
    }
  },

  loadCards: async () => {
    try {
      set({ isLoading: true });
      const { user } = useAuthStore.getState();
      if (!user) return;

      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cards: Card[] = data.map(card => ({
        id: card.id,
        name: card.name,
        imageUrl: card.image_url,
        game: card.game as any,
        rarity: card.rarity as any,
        set: card.set,
        collectionNumber: card.collection_number,
        value: card.value,
        isHolographic: card.is_holographic,
        isReverseHolo: card.is_reverse_holo,
        isSecretRare: card.is_secret_rare,
        acquiredDate: new Date(card.acquired_date),
        source: card.source as any,
      }));

      const totalValue = cards.reduce((sum, card) => sum + (card.value || 0), 0);

      set({ cards, totalValue, isLoading: false });
    } catch (error) {
      console.error('Error loading cards:', error);
      set({ isLoading: false });
    }
  },

  createCollection: async (name: string, description?: string) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('collections')
        .insert({
          user_id: user.id,
          name,
          description,
          is_public: false,
        })
        .select()
        .single();

      if (error) throw error;

      const newCollection: Collection = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description,
        cards: [],
        totalValue: 0,
        isPublic: data.is_public,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set(state => ({
        collections: [...state.collections, newCollection],
      }));
    } catch (error) {
      throw error;
    }
  },

  loadCollections: async () => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) return;

      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const collections: Collection[] = data.map(collection => ({
        id: collection.id,
        userId: collection.user_id,
        name: collection.name,
        description: collection.description,
        cards: [], // Cards would be loaded separately
        totalValue: 0,
        isPublic: collection.is_public,
        createdAt: new Date(collection.created_at),
        updatedAt: new Date(collection.updated_at),
      }));

      set({ collections });
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  },

  syncCollection: async () => {
    const { loadCards, loadCollections } = get();
    await Promise.all([loadCards(), loadCollections()]);
  },
}));