export interface CardSearchResult {
  id: string;
  name: string;
  set: {
    id: string;
    name: string;
    series: string;
    total: number;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  rarity: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    prices?: {
      holofoil?: {
        market: number;
        low: number;
        mid: number;
        high: number;
      };
      normal?: {
        market: number;
        low: number;
        mid: number;
        high: number;
      };
      reverseHolofoil?: {
        market: number;
        low: number;
        mid: number;
        high: number;
      };
    };
  };
  types?: string[];
  hp?: string;
  attacks?: Array<{
    name: string;
    cost: string[];
    damage: string;
    text: string;
  }>;
  weaknesses?: Array<{
    type: string;
    value: string;
  }>;
  resistances?: Array<{
    type: string;
    value: string;
  }>;
  retreatCost?: string[];
  artist?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
}

export interface PokemonSet {
  id: string;
  name: string;
  series: string;
  total: number;
  releaseDate: string;
  images: {
    symbol: string;
    logo: string;
  };
  legalities?: {
    standard?: string;
    expanded?: string;
    unlimited?: string;
  };
}

export interface UserCollection {
  id: string;
  userId: string;
  cards: CollectionCard[];
  totalValue: number;
  lastUpdated: Date;
}

export interface CollectionCard {
  id: string;
  cardId: string;
  condition: CardCondition;
  quantity: number;
  acquiredDate: Date;
  acquiredPrice?: number;
  currentValue?: number;
  graded?: {
    company: string;
    grade: number;
    certNumber: string;
  };
  preGrading?: PreGradingResult;
}

export interface PreGradingResult {
  id: string;
  cardId: string;
  overallGrade: number;
  subGrades: {
    centering: number;
    corners: number;
    edges: number;
    surface: number;
  };
  confidence: number;
  flaws: Flaw[];
  estimatedValue: number;
  gradingRecommendation: string;
  timestamp: Date;
}

export interface Flaw {
  id: string;
  type: 'centering' | 'corners' | 'edges' | 'surface' | 'print' | 'other';
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type CardCondition = 
  | 'mint' 
  | 'near-mint' 
  | 'lightly-played' 
  | 'moderately-played' 
  | 'heavily-played' 
  | 'damaged';

export interface BoosterPack {
  id: string;
  name: string;
  setId: string;
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

export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' 
  | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface AIAssistant {
  id: string;
  name: string;
  personality: 'helpful' | 'expert' | 'friendly' | 'professional';
  currentTheme: PokemonTheme;
  capabilities: string[];
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

export interface DeckList {
  id: string;
  name: string;
  format: 'standard' | 'expanded' | 'unlimited';
  cards: DeckCard[];
  totalCards: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  description?: string;
  tags: string[];
}

export interface DeckCard {
  cardId: string;
  quantity: number;
  category: 'pokemon' | 'trainer' | 'energy';
}