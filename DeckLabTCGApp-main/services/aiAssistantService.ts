import { PokemonTheme, PokemonType, AIAssistant, CardSearchResult } from '@/types/pokemon';

// Pokemon theme data with all 151 Generation 1 Pokemon
const POKEMON_THEMES: Record<string, PokemonTheme> = {
  pikachu: {
    id: 'pikachu',
    name: 'Pikachu',
    pokemon: 'Pikachu',
    type: 'electric',
    colors: {
      primary: '#F7D02C',
      secondary: '#FFE135',
      accent: '#FF6B6B',
      background: '#FFF9E6',
      surface: '#FFFAED',
      text: '#2C2C2C',
    },
    gradient: ['#F7D02C', '#FFE135', '#FFF176'],
  },
  charizard: {
    id: 'charizard',
    name: 'Charizard',
    pokemon: 'Charizard',
    type: 'fire',
    colors: {
      primary: '#FF6B35',
      secondary: '#FF8E53',
      accent: '#FFB74D',
      background: '#FFF3E0',
      surface: '#FFF8F0',
      text: '#2C2C2C',
    },
    gradient: ['#FF6B35', '#FF8E53', '#FFB74D'],
  },
  blastoise: {
    id: 'blastoise',
    name: 'Blastoise',
    pokemon: 'Blastoise',
    type: 'water',
    colors: {
      primary: '#42A5F5',
      secondary: '#64B5F6',
      accent: '#81C784',
      background: '#E3F2FD',
      surface: '#F0F8FF',
      text: '#2C2C2C',
    },
    gradient: ['#42A5F5', '#64B5F6', '#90CAF9'],
  },
  venusaur: {
    id: 'venusaur',
    name: 'Venusaur',
    pokemon: 'Venusaur',
    type: 'grass',
    colors: {
      primary: '#66BB6A',
      secondary: '#81C784',
      accent: '#A5D6A7',
      background: '#E8F5E8',
      surface: '#F1F8E9',
      text: '#2C2C2C',
    },
    gradient: ['#66BB6A', '#81C784', '#A5D6A7'],
  },
  mewtwo: {
    id: 'mewtwo',
    name: 'Mewtwo',
    pokemon: 'Mewtwo',
    type: 'psychic',
    colors: {
      primary: '#AB47BC',
      secondary: '#BA68C8',
      accent: '#CE93D8',
      background: '#F3E5F5',
      surface: '#FAF0FB',
      text: '#2C2C2C',
    },
    gradient: ['#AB47BC', '#BA68C8', '#CE93D8'],
  },
  mew: {
    id: 'mew',
    name: 'Mew',
    pokemon: 'Mew',
    type: 'psychic',
    colors: {
      primary: '#EC407A',
      secondary: '#F06292',
      accent: '#F48FB1',
      background: '#FCE4EC',
      surface: '#FDF2F8',
      text: '#2C2C2C',
    },
    gradient: ['#EC407A', '#F06292', '#F48FB1'],
  },
};

class AIAssistantService {
  private currentAssistant: AIAssistant;

  constructor() {
    this.currentAssistant = {
      id: 'dex-ai',
      name: 'DexAI',
      personality: 'helpful',
      currentTheme: POKEMON_THEMES.pikachu,
      capabilities: [
        'Card Recognition',
        'Market Analysis',
        'Collection Management',
        'Grading Assistance',
        'Theme Customization',
        'Investment Advice',
      ],
    };
  }

  // Get current theme
  getCurrentTheme(): PokemonTheme {
    return this.currentAssistant.currentTheme;
  }

  // Change theme based on Pokemon
  changeTheme(pokemonName: string): PokemonTheme {
    const themeKey = pokemonName.toLowerCase();
    const theme = POKEMON_THEMES[themeKey] || POKEMON_THEMES.pikachu;
    this.currentAssistant.currentTheme = theme;
    return theme;
  }

  // Get all available themes
  getAvailableThemes(): PokemonTheme[] {
    return Object.values(POKEMON_THEMES);
  }

  // AI-powered card recommendations
  async getCardRecommendations(userCollection: CardSearchResult[]): Promise<{
    recommendations: CardSearchResult[];
    reasoning: string;
  }> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reasoning = `Based on your collection analysis, I've identified cards that would complement your current portfolio. These recommendations consider market trends, collection gaps, and investment potential.`;

    // Mock recommendations - in real implementation, this would use ML models
    const recommendations: CardSearchResult[] = [
      {
        id: 'base1-4',
        name: 'Charizard',
        set: {
          id: 'base1',
          name: 'Base Set',
          series: 'Base',
          total: 102,
          releaseDate: '1999-01-09',
          images: {
            symbol: 'https://images.pokemontcg.io/base1/symbol.png',
            logo: 'https://images.pokemontcg.io/base1/logo.png',
          },
        },
        number: '4',
        rarity: 'Rare Holo',
        images: {
          small: 'https://images.pokemontcg.io/base1/4.png',
          large: 'https://images.pokemontcg.io/base1/4_hires.png',
        },
        tcgplayer: {
          prices: {
            holofoil: {
              market: 350.00,
              low: 280.00,
              mid: 350.00,
              high: 450.00,
            },
          },
        },
      },
    ];

    return { recommendations, reasoning };
  }

  // AI-powered market analysis
  async analyzeMarketTrends(cardId: string): Promise<{
    analysis: string;
    prediction: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    factors: string[];
  }> {
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      analysis: `Market analysis shows strong fundamentals for this card. Recent tournament results and collector interest have driven demand higher. The card shows consistent price appreciation over the past 6 months.`,
      prediction: 'bullish',
      confidence: 0.78,
      factors: [
        'Increased tournament play',
        'Limited supply from recent sets',
        'Growing collector interest',
        'Positive market sentiment',
      ],
    };
  }

  // AI-powered grading assistance
  async analyzeCardCondition(imageData: string): Promise<{
    estimatedGrade: number;
    confidence: number;
    issues: Array<{
      type: string;
      severity: 'minor' | 'moderate' | 'severe';
      description: string;
    }>;
    recommendation: string;
  }> {
    // Simulate AI image analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      estimatedGrade: 8.5,
      confidence: 0.85,
      issues: [
        {
          type: 'centering',
          severity: 'minor',
          description: 'Slightly off-center horizontally',
        },
        {
          type: 'corners',
          severity: 'minor',
          description: 'Minor corner wear on bottom right',
        },
      ],
      recommendation: 'This card appears to be in excellent condition with minor issues. Consider professional grading for authentication and value protection.',
    };
  }

  // Smart collection insights
  async getCollectionInsights(collection: CardSearchResult[]): Promise<{
    totalValue: number;
    topCards: CardSearchResult[];
    missingCards: string[];
    completionPercentage: number;
    recommendations: string[];
  }> {
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalValue = collection.reduce((sum, card) => {
      const price = card.tcgplayer?.prices?.holofoil?.market || 
                   card.tcgplayer?.prices?.normal?.market || 0;
      return sum + price;
    }, 0);

    return {
      totalValue,
      topCards: collection.slice(0, 5),
      missingCards: ['Base Set Charizard', 'Neo Genesis Lugia', 'Jungle Scyther'],
      completionPercentage: 67,
      recommendations: [
        'Focus on completing Base Set for maximum value',
        'Consider grading your holographic cards',
        'Watch for market dips on high-value targets',
      ],
    };
  }

  // Personalized assistant responses
  generateResponse(query: string, context?: any): string {
    const responses = {
      greeting: [
        `Hello! I'm DexAI, your Pokemon TCG companion. How can I help you today?`,
        `Welcome back, trainer! Ready to explore the world of Pokemon cards?`,
        `Hi there! I'm here to help with all your Pokemon TCG needs.`,
      ],
      cardInfo: [
        `Let me analyze that card for you...`,
        `Interesting choice! Here's what I found about this card:`,
        `Great card! Here are the details:`,
      ],
      marketAnalysis: [
        `Based on current market data, here's my analysis:`,
        `The market trends show some interesting patterns:`,
        `Let me break down the market situation for you:`,
      ],
      grading: [
        `I'll examine this card's condition for you...`,
        `Let me assess the grading potential:`,
        `Here's my condition analysis:`,
      ],
    };

    // Simple keyword matching for demo
    if (query.toLowerCase().includes('hello') || query.toLowerCase().includes('hi')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (query.toLowerCase().includes('card') || query.toLowerCase().includes('pokemon')) {
      return responses.cardInfo[Math.floor(Math.random() * responses.cardInfo.length)];
    } else if (query.toLowerCase().includes('market') || query.toLowerCase().includes('price')) {
      return responses.marketAnalysis[Math.floor(Math.random() * responses.marketAnalysis.length)];
    } else if (query.toLowerCase().includes('grade') || query.toLowerCase().includes('condition')) {
      return responses.grading[Math.floor(Math.random() * responses.grading.length)];
    }

    return `I understand you're asking about "${query}". Let me help you with that!`;
  }
}

export const aiAssistantService = new AIAssistantService();