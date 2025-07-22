// Core Types for DeckLab TCG App
export interface User {
  id: string;
  email: string;
  displayName?: string;
  profileImageURL?: string;
  isPro: boolean;
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'past_due';
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Card {
  id: string;
  name: string;
  imageUrl?: string;
  game: CardGame;
  rarity: CardRarity;
  set: string;
  collectionNumber: string;
  grading?: CardGrading;
  value?: number;
  isHolographic: boolean;
  isReverseHolo: boolean;
  isSecretRare: boolean;
  acquiredDate: Date;
  source: CardSource;
}

export enum CardGame {
  POKEMON = 'pokemon',
  MAGIC = 'magicTheGathering',
  YUGIOH = 'yugioh',
  DIGIMON = 'digimon',
  CUSTOM = 'custom'
}

export enum CardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  HOLO_RARE = 'holographicRare',
  ULTRA_RARE = 'ultraRare',
  SECRET_RARE = 'secretRare',
  DOUBLE_RARE = 'doubleRare',
  ILLUSTRATION_RARE = 'illustrationRare',
  SPECIAL_ILLUSTRATION_RARE = 'specialIllustrationRare',
  HYPER_RARE = 'hyperRare'
}

export enum CardSource {
  VIRTUAL_VAULT_PACK = 'virtualVaultPack',
  TRADE = 'trade',
  MARKET_PURCHASE = 'marketPurchase',
  GIFT = 'gift',
  INITIAL_COLLECTION = 'initialCollection'
}

export interface CardGrading {
  id: string;
  overallGrade: number;
  centering: number;
  corners: number;
  edges: number;
  surface: number;
  confidence: number;
  gradingCompany: GradingCompany;
  verificationID: string;
  flaws: Flaw[];
  dateGraded: Date;
}

export enum GradingCompany {
  PSA = 'PSA',
  BECKETT = 'Beckett',
  CGC = 'CGC',
  DECKLAB_AI = 'DeckLab AI',
  OTHER = 'Other'
}

export interface Flaw {
  id: string;
  type: FlawType;
  severity: FlawSeverity;
  description: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export enum FlawType {
  CENTERING = 'centering',
  CORNERS = 'corners',
  EDGES = 'edges',
  SURFACE = 'surface',
  PRINT_DEFECT = 'printDefect',
  OTHER = 'other'
}

export enum FlawSeverity {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SEVERE = 'severe'
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  cards: Card[];
  totalValue: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketData {
  cardId: string;
  currentPrice: number;
  priceHistory: PricePoint[];
  marketTrend: 'up' | 'down' | 'stable';
  volume24h: number;
  lastUpdated: Date;
  sources: MarketSource[];
}

export interface PricePoint {
  date: Date;
  price: number;
  volume: number;
}

export interface MarketSource {
  name: string;
  price: number;
  url: string;
  lastUpdated: Date;
}

export interface BoosterPack {
  id: string;
  setId: string;
  name: string;
  price: number;
  rarity: 'Common' | 'Rare' | 'Legendary';
  image: string;
  gradient: string[];
  odds: {
    common: number;
    uncommon: number;
    rare: number;
    holo: number;
    ultraRare: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
  progress?: number;
  maxProgress?: number;
  category: 'collection' | 'grading' | 'trading' | 'social' | 'vault';
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
  category: 'market' | 'competitive' | 'news' | 'releases';
  imageUrl?: string;
  tags: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  isPopular?: boolean;
}

// API Response Types
export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Theme Types
export interface PokemonTheme {
  id: string;
  name: string;
  pokemon: string;
  type: PokemonType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  gradient: string[];
}

export enum PokemonType {
  NORMAL = 'normal',
  FIRE = 'fire',
  WATER = 'water',
  ELECTRIC = 'electric',
  GRASS = 'grass',
  ICE = 'ice',
  FIGHTING = 'fighting',
  POISON = 'poison',
  GROUND = 'ground',
  FLYING = 'flying',
  PSYCHIC = 'psychic',
  BUG = 'bug',
  ROCK = 'rock',
  GHOST = 'ghost',
  DRAGON = 'dragon',
  DARK = 'dark',
  STEEL = 'steel',
  FAIRY = 'fairy'
}