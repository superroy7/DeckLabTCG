// App Constants
export const APP_CONFIG = {
  name: 'DeckLab TCG',
  version: '1.0.0',
  description: 'The ultimate Pokemon TCG companion app',
  website: 'https://decklab.app',
  supportEmail: 'support@decklab.app',
  privacyPolicy: 'https://decklab.app/privacy',
  termsOfService: 'https://decklab.app/terms',
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'Basic features for casual collectors',
    price: 0,
    currency: 'USD',
    interval: 'month' as const,
    features: [
      'Basic card scanning',
      'Collection tracking (up to 100 cards)',
      'Basic market data',
      'Community access'
    ],
    stripePriceId: '',
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan',
    description: 'for monthly subscribers to access all pro features',
    price: 4.99,
    currency: 'USD',
    interval: 'month' as const,
    features: [
      'Unlimited card scanning',
      'AI-powered grading (CertiGrade)',
      'Advanced market analytics',
      'Virtual vault pack opening',
      'Priority customer support',
      'Export collection data',
      'Advanced search filters',
      'Price alerts and notifications'
    ],
    stripePriceId: 'price_1RnkyKAzeNVyZRkgsRCY4Ykl',
    isPopular: true,
  }
} as const;

export const FEATURE_FLAGS = {
  AI_GRADING: true,
  VIRTUAL_VAULT: true,
  SOCIAL_FEATURES: true,
  MARKETPLACE: false, // Coming soon
  AR_FEATURES: false, // Coming soon
} as const;

export const API_ENDPOINTS = {
  POKEMON_TCG: 'https://api.pokemontcg.io/v2',
  SUPABASE_FUNCTIONS: process.env.EXPO_PUBLIC_SUPABASE_URL + '/functions/v1',
} as const;

export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME_SELECTION: 'theme_selection',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  LAST_SYNC: 'last_sync',
} as const;

export const LIMITS = {
  FREE_COLLECTION_SIZE: 100,
  PRO_COLLECTION_SIZE: 10000,
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGES_PER_CARD: 5,
} as const;

export const GRADING_SCALE = {
  PERFECT: 10,
  MINT: 9,
  NEAR_MINT: 8,
  EXCELLENT: 7,
  VERY_GOOD: 6,
  GOOD: 5,
  FAIR: 4,
  POOR: 3,
  DAMAGED: 2,
  HEAVILY_DAMAGED: 1,
} as const;

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic',
  'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export const CARD_RARITIES = [
  'common', 'uncommon', 'rare', 'holographicRare', 'ultraRare',
  'secretRare', 'doubleRare', 'illustrationRare', 
  'specialIllustrationRare', 'hyperRare'
] as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please sign in to continue.',
  SUBSCRIPTION_REQUIRED: 'This feature requires a Pro subscription.',
  COLLECTION_LIMIT_REACHED: 'Collection limit reached. Upgrade to Pro for unlimited cards.',
  INVALID_CARD_IMAGE: 'Please provide a valid card image.',
  GRADING_FAILED: 'Card grading failed. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

export const SUCCESS_MESSAGES = {
  CARD_ADDED: 'Card added to collection successfully!',
  CARD_GRADED: 'Card graded successfully!',
  SUBSCRIPTION_ACTIVATED: 'Pro subscription activated!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  COLLECTION_SYNCED: 'Collection synced successfully!',
} as const;