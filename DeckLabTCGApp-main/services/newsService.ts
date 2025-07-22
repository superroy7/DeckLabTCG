import { NewsItem } from '@/types/pokemon';

// News sources integration
const NEWS_SOURCES = {
  pokebeach: 'https://www.pokebeach.com',
  pokeguardian: 'https://www.pokeguardian.com',
  bulbapedia: 'https://bulbapedia.bulbagarden.net/wiki/Pokémon_Trading_Card_Game',
  serebii: 'https://www.serebii.net',
  limitlesstcg: 'https://limitlesstcg.com',
  trainerhill: 'https://www.trainerhill.com',
  ptcgstats: 'https://www.ptcgstats.com',
};

class NewsService {
  private mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'New Pokemon TCG Set "Temporal Forces" Announced',
      summary: 'The latest expansion brings time-themed Pokemon and powerful new mechanics to the competitive scene.',
      content: 'Pokemon Company International has announced the upcoming release of Temporal Forces, featuring over 160 new cards including powerful Pokemon ex and innovative Trainer cards. The set introduces time-based mechanics that will shake up the current meta.',
      source: 'PokeBeach',
      url: 'https://www.pokebeach.com/temporal-forces-announcement',
      publishedAt: new Date('2024-01-15'),
      category: 'releases',
      imageUrl: 'https://images.pokemontcg.io/sv4/logo.png',
      tags: ['new-set', 'temporal-forces', 'pokemon-ex'],
    },
    {
      id: '2',
      title: 'Charizard ex Dominates Regional Championships',
      summary: 'The fire-type powerhouse continues to show strong performance in competitive play across multiple regions.',
      content: 'Recent regional championship results show Charizard ex decks taking top positions in 60% of tournaments. The card\'s versatility and raw power make it a consistent threat in the current Standard format.',
      source: 'Limitless TCG',
      url: 'https://limitlesstcg.com/charizard-ex-analysis',
      publishedAt: new Date('2024-01-12'),
      category: 'competitive',
      imageUrl: 'https://images.pokemontcg.io/sv3pt5/7.png',
      tags: ['charizard', 'competitive', 'regional-championships'],
    },
    {
      id: '3',
      title: 'Base Set Charizard Reaches Record High Price',
      summary: 'PSA 10 Base Set Charizard sells for $420,000 at auction, setting new market record.',
      content: 'A pristine PSA 10 Base Set Shadowless Charizard has sold for a record-breaking $420,000 at Heritage Auctions. This sale represents a 15% increase from the previous record and highlights the continued strength of vintage Pokemon card investments.',
      source: 'Pokemon Guardian',
      url: 'https://www.pokeguardian.com/charizard-record-sale',
      publishedAt: new Date('2024-01-10'),
      category: 'market',
      imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png',
      tags: ['charizard', 'base-set', 'auction', 'record-price'],
    },
    {
      id: '4',
      title: 'World Championships 2024 Format Announced',
      summary: 'Official format and banned card list revealed for the upcoming World Championships.',
      content: 'The Pokemon Company has announced the official format for the 2024 World Championships. The Standard format will include sets from Silver Tempest onward, with several key cards receiving restrictions to promote diverse gameplay.',
      source: 'Trainer Hill',
      url: 'https://www.trainerhill.com/worlds-2024-format',
      publishedAt: new Date('2024-01-08'),
      category: 'competitive',
      imageUrl: 'https://assets.pokemon.com/assets/cms2/img/trading-card-game/worlds2024.jpg',
      tags: ['worlds', 'format', 'competitive', '2024'],
    },
    {
      id: '5',
      title: 'Japanese Exclusive Cards Coming to International Markets',
      summary: 'Popular Japanese promo cards will be released internationally through special collections.',
      content: 'Pokemon Company International announced that several Japanese exclusive promotional cards will be made available to international collectors through upcoming special collection boxes and premium sets.',
      source: 'Serebii',
      url: 'https://www.serebii.net/japanese-cards-international',
      publishedAt: new Date('2024-01-05'),
      category: 'releases',
      imageUrl: 'https://images.pokemontcg.io/sv-promo/logo.png',
      tags: ['japanese-cards', 'international-release', 'promo-cards'],
    },
  ];

  async getLatestNews(category?: string, limit: number = 20): Promise<NewsItem[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredNews = this.mockNews;
    
    if (category) {
      filteredNews = this.mockNews.filter(item => item.category === category);
    }

    return filteredNews.slice(0, limit);
  }

  async getNewsById(id: string): Promise<NewsItem | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.mockNews.find(item => item.id === id) || null;
  }

  async searchNews(query: string): Promise<NewsItem[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchTerm = query.toLowerCase();
    return this.mockNews.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.summary.toLowerCase().includes(searchTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getMarketNews(): Promise<NewsItem[]> {
    return this.getLatestNews('market');
  }

  async getCompetitiveNews(): Promise<NewsItem[]> {
    return this.getLatestNews('competitive');
  }

  async getReleaseNews(): Promise<NewsItem[]> {
    return this.getLatestNews('releases');
  }

  // Aggregate news from multiple sources (mock implementation)
  async aggregateNewsFromSources(): Promise<NewsItem[]> {
    // In a real implementation, this would fetch from actual news APIs
    // For now, return mock data with source attribution
    return this.mockNews.map(item => ({
      ...item,
      source: this.getRandomSource(),
    }));
  }

  private getRandomSource(): string {
    const sources = ['PokeBeach', 'Pokemon Guardian', 'Serebii', 'Limitless TCG', 'Trainer Hill'];
    return sources[Math.floor(Math.random() * sources.length)];
  }

  // Get trending topics
  async getTrendingTopics(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      'Charizard ex',
      'Temporal Forces',
      'World Championships 2024',
      'Base Set Prices',
      'Japanese Exclusives',
      'Regional Results',
      'New Mechanics',
      'Investment Cards',
    ];
  }

  // Get personalized news feed based on user interests
  async getPersonalizedFeed(userInterests: string[]): Promise<NewsItem[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return this.mockNews.filter(item =>
      item.tags.some(tag => 
        userInterests.some(interest => 
          tag.toLowerCase().includes(interest.toLowerCase())
        )
      )
    );
  }
}

export const newsService = new NewsService();