import { CardSearchResult, PokemonSet, MarketData } from '@/types/pokemon';

const POKEMON_TCG_API_BASE = 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY;

// Enhanced API service with comprehensive data fetching
export const searchCards = async (query: string, filters?: {
  set?: string;
  type?: string;
  rarity?: string;
  hp?: string;
}): Promise<CardSearchResult[]> => {
  try {
    let searchQuery = `name:${query}*`;
    
    if (filters?.set) searchQuery += ` set.id:${filters.set}`;
    if (filters?.type) searchQuery += ` types:${filters.type}`;
    if (filters?.rarity) searchQuery += ` rarity:${filters.rarity}`;
    if (filters?.hp) searchQuery += ` hp:${filters.hp}`;

    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `${POKEMON_TCG_API_BASE}/cards?q=${encodedQuery}&pageSize=50&orderBy=name`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['X-Api-Key'] = API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching cards:', error);
    return [];
  }
};

export const getCardById = async (cardId: string): Promise<CardSearchResult | null> => {
  try {
    const url = `${POKEMON_TCG_API_BASE}/cards/${cardId}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['X-Api-Key'] = API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching card details:', error);
    return null;
  }
};

export const getFeaturedSets = async (): Promise<PokemonSet[]> => {
  try {
    const url = `${POKEMON_TCG_API_BASE}/sets?orderBy=-releaseDate&pageSize=12`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['X-Api-Key'] = API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching sets:', error);
    return [];
  }
};

export const getSetCards = async (setId: string): Promise<CardSearchResult[]> => {
  try {
    const url = `${POKEMON_TCG_API_BASE}/cards?q=set.id:${setId}&pageSize=250&orderBy=number`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['X-Api-Key'] = API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching set cards:', error);
    return [];
  }
};

export const getMarketData = async (cardId: string): Promise<MarketData | null> => {
  try {
    // This would integrate with multiple market data sources
    // For now, we'll simulate market data
    const mockMarketData: MarketData = {
      cardId,
      currentPrice: Math.random() * 100 + 10,
      priceHistory: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
        price: Math.random() * 100 + 10,
        volume: Math.floor(Math.random() * 1000),
      })),
      marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      volume24h: Math.floor(Math.random() * 10000),
      lastUpdated: new Date(),
      sources: [
        {
          name: 'TCGPlayer',
          price: Math.random() * 100 + 10,
          url: 'https://tcgplayer.com',
          lastUpdated: new Date(),
        },
        {
          name: 'eBay',
          price: Math.random() * 100 + 10,
          url: 'https://ebay.com',
          lastUpdated: new Date(),
        },
      ],
    };
    
    return mockMarketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return null;
  }
};

export const getAdvancedSearch = async (params: {
  name?: string;
  set?: string;
  type?: string;
  rarity?: string;
  hp?: { min?: number; max?: number };
  attackDamage?: { min?: number; max?: number };
  retreatCost?: number;
  artist?: string;
}): Promise<CardSearchResult[]> => {
  try {
    let queryParts: string[] = [];
    
    if (params.name) queryParts.push(`name:${params.name}*`);
    if (params.set) queryParts.push(`set.id:${params.set}`);
    if (params.type) queryParts.push(`types:${params.type}`);
    if (params.rarity) queryParts.push(`rarity:${params.rarity}`);
    if (params.hp?.min) queryParts.push(`hp:[${params.hp.min} TO *]`);
    if (params.hp?.max) queryParts.push(`hp:[* TO ${params.hp.max}]`);
    if (params.artist) queryParts.push(`artist:${params.artist}`);
    if (params.retreatCost !== undefined) queryParts.push(`convertedRetreatCost:${params.retreatCost}`);
    
    const searchQuery = queryParts.join(' ');
    const encodedQuery = encodeURIComponent(searchQuery);
    const url = `${POKEMON_TCG_API_BASE}/cards?q=${encodedQuery}&pageSize=100&orderBy=name`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers['X-Api-Key'] = API_KEY;
    }
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error in advanced search:', error);
    return [];
  }
};