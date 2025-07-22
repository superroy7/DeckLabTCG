import { API_ENDPOINTS } from '../lib/constants';

export interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
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
  artist?: string;
  rarity?: string;
  nationalPokedexNumbers?: number[];
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: {
      [key: string]: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
      };
    };
  };
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
}

class PokemonTCGService {
  private baseUrl = API_ENDPOINTS.POKEMON_TCG;
  private apiKey = process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY;

  private async makeRequest<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      throw new Error(`Pokemon TCG API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async searchCards(query: string, page = 1, pageSize = 20): Promise<{ data: PokemonCard[]; totalCount: number }> {
    try {
      const response = await this.makeRequest<{ data: PokemonCard[]; totalCount: number }>('/cards', {
        q: `name:${query}*`,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      return response;
    } catch (error) {
      console.error('Error searching cards:', error);
      throw error;
    }
  }

  async getCardById(cardId: string): Promise<PokemonCard> {
    try {
      const response = await this.makeRequest<{ data: PokemonCard }>(`/cards/${cardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching card:', error);
      throw error;
    }
  }

  async getSets(): Promise<PokemonSet[]> {
    try {
      const response = await this.makeRequest<{ data: PokemonSet[] }>('/sets', {
        orderBy: '-releaseDate',
        pageSize: '50',
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw error;
    }
  }

  async getSetCards(setId: string): Promise<PokemonCard[]> {
    try {
      const response = await this.makeRequest<{ data: PokemonCard[] }>('/cards', {
        q: `set.id:${setId}`,
        pageSize: '250',
        orderBy: 'number',
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching set cards:', error);
      throw error;
    }
  }

  async getCardsByType(type: string): Promise<PokemonCard[]> {
    try {
      const response = await this.makeRequest<{ data: PokemonCard[] }>('/cards', {
        q: `types:${type}`,
        pageSize: '50',
        orderBy: 'name',
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching cards by type:', error);
      throw error;
    }
  }

  async getRandomCards(count = 10): Promise<PokemonCard[]> {
    try {
      // Get a random page to simulate randomness
      const randomPage = Math.floor(Math.random() * 10) + 1;
      
      const response = await this.makeRequest<{ data: PokemonCard[] }>('/cards', {
        page: randomPage.toString(),
        pageSize: count.toString(),
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching random cards:', error);
      throw error;
    }
  }
}

export const pokemonTcgService = new PokemonTCGService();