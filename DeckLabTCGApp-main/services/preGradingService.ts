import { PreGradingResult, Flaw, CardSearchResult } from '@/types/pokemon';

class PreGradingService {
  // Simulate AI-powered pre-grading analysis
  async analyzeCardCondition(
    cardId: string,
    imageData: string[] // Multiple images for comprehensive analysis
  ): Promise<PreGradingResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock AI analysis results
    const centering = this.generateGradeScore(7, 10);
    const corners = this.generateGradeScore(6, 10);
    const edges = this.generateGradeScore(7, 10);
    const surface = this.generateGradeScore(8, 10);

    const overallGrade = this.calculateOverallGrade(centering, corners, edges, surface);
    const confidence = this.calculateConfidence(overallGrade);

    const flaws = this.generateFlaws(centering, corners, edges, surface);
    const estimatedValue = this.estimateValue(cardId, overallGrade);
    const gradingRecommendation = this.generateRecommendation(overallGrade, estimatedValue);

    return {
      id: `pre-grade-${Date.now()}`,
      cardId,
      overallGrade,
      subGrades: {
        centering,
        corners,
        edges,
        surface,
      },
      confidence,
      flaws,
      estimatedValue,
      gradingRecommendation,
      timestamp: new Date(),
    };
  }

  private generateGradeScore(min: number, max: number): number {
    return Math.round((Math.random() * (max - min) + min) * 10) / 10;
  }

  private calculateOverallGrade(centering: number, corners: number, edges: number, surface: number): number {
    // Weighted average with surface being most important
    const weights = { centering: 0.2, corners: 0.25, edges: 0.25, surface: 0.3 };
    const weightedSum = 
      centering * weights.centering +
      corners * weights.corners +
      edges * weights.edges +
      surface * weights.surface;
    
    return Math.round(weightedSum * 10) / 10;
  }

  private calculateConfidence(grade: number): number {
    // Higher grades have lower confidence due to stricter standards
    if (grade >= 9.5) return 0.75 + Math.random() * 0.15;
    if (grade >= 8.5) return 0.80 + Math.random() * 0.15;
    if (grade >= 7.0) return 0.85 + Math.random() * 0.10;
    return 0.90 + Math.random() * 0.08;
  }

  private generateFlaws(centering: number, corners: number, edges: number, surface: number): Flaw[] {
    const flaws: Flaw[] = [];

    if (centering < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-1`,
        type: 'centering',
        severity: centering < 6.0 ? 'severe' : centering < 7.0 ? 'moderate' : 'minor',
        description: 'Card is off-center, affecting the border symmetry',
        location: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
      });
    }

    if (corners < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-2`,
        type: 'corners',
        severity: corners < 6.0 ? 'severe' : corners < 7.0 ? 'moderate' : 'minor',
        description: 'Corner wear detected, may affect grading',
        location: { x: 0.85, y: 0.85, width: 0.1, height: 0.1 },
      });
    }

    if (edges < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-3`,
        type: 'edges',
        severity: edges < 6.0 ? 'severe' : edges < 7.0 ? 'moderate' : 'minor',
        description: 'Edge wear or roughness detected',
        location: { x: 0.0, y: 0.4, width: 1.0, height: 0.2 },
      });
    }

    if (surface < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-4`,
        type: 'surface',
        severity: surface < 6.0 ? 'severe' : surface < 7.0 ? 'moderate' : 'minor',
        description: 'Surface imperfections detected',
        location: { x: 0.3, y: 0.3, width: 0.4, height: 0.4 },
      });
    }

    return flaws;
  }

  private estimateValue(cardId: string, grade: number): number {
    // Mock value estimation based on grade
    const baseValue = Math.random() * 200 + 50; // Random base value
    const gradeMultiplier = this.getGradeMultiplier(grade);
    return Math.round(baseValue * gradeMultiplier * 100) / 100;
  }

  private getGradeMultiplier(grade: number): number {
    if (grade >= 10.0) return 5.0;
    if (grade >= 9.5) return 3.5;
    if (grade >= 9.0) return 2.5;
    if (grade >= 8.5) return 2.0;
    if (grade >= 8.0) return 1.5;
    if (grade >= 7.0) return 1.2;
    return 1.0;
  }

  private generateRecommendation(grade: number, estimatedValue: number): string {
    if (grade >= 9.5) {
      return `Excellent condition! This card is a strong candidate for professional grading. Expected grade: PSA ${Math.floor(grade)}. Estimated value after grading: $${estimatedValue.toFixed(2)}`;
    } else if (grade >= 8.5) {
      return `Very good condition with minor flaws. Consider professional grading if the card has significant value. Expected grade: PSA ${Math.floor(grade)}. Estimated value: $${estimatedValue.toFixed(2)}`;
    } else if (grade >= 7.0) {
      return `Good condition but with noticeable flaws. Professional grading may not be cost-effective unless it's a high-value card. Expected grade: PSA ${Math.floor(grade)}. Estimated value: $${estimatedValue.toFixed(2)}`;
    } else {
      return `Card shows significant wear. Professional grading is not recommended unless for authentication purposes. Expected grade: PSA ${Math.floor(grade)} or lower. Estimated value: $${estimatedValue.toFixed(2)}`;
    }
  }

  // Get grading cost estimate
  async getGradingCostEstimate(serviceType: 'economy' | 'regular' | 'express'): Promise<{
    cost: number;
    turnaroundTime: string;
    description: string;
  }> {
    const costs = {
      economy: { cost: 20, turnaroundTime: '45-60 business days', description: 'Best value for cards under $499' },
      regular: { cost: 50, turnaroundTime: '20-25 business days', description: 'Standard service for most cards' },
      express: { cost: 150, turnaroundTime: '5-7 business days', description: 'Fast service for urgent needs' },
    };

    return costs[serviceType];
  }

  // Compare different grading services
  async compareGradingServices(): Promise<Array<{
    name: string;
    reputation: number;
    averageCost: number;
    turnaroundTime: string;
    specialties: string[];
  }>> {
    return [
      {
        name: 'PSA',
        reputation: 9.5,
        averageCost: 50,
        turnaroundTime: '20-25 business days',
        specialties: ['Pokemon', 'Sports Cards', 'High-Value Cards'],
      },
      {
        name: 'BGS/Beckett',
        reputation: 9.2,
        averageCost: 45,
        turnaroundTime: '15-20 business days',
        specialties: ['Subgrades', 'Modern Cards', 'Autographs'],
      },
      {
        name: 'CGC',
        reputation: 8.8,
        averageCost: 35,
        turnaroundTime: '10-15 business days',
        specialties: ['Fast Service', 'Competitive Pricing', 'Comics & Cards'],
      },
    ];
  }

  // Track grading submission
  async trackGradingSubmission(submissionId: string): Promise<{
    status: 'received' | 'in-progress' | 'graded' | 'shipped';
    estimatedCompletion: Date;
    currentStep: string;
  }> {
    // Mock tracking data
    const statuses = ['received', 'in-progress', 'graded', 'shipped'] as const;
    const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: currentStatus,
      estimatedCompletion: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      currentStep: this.getStepDescription(currentStatus),
    };
  }

  private getStepDescription(status: string): string {
    switch (status) {
      case 'received': return 'Your submission has been received and logged';
      case 'in-progress': return 'Cards are currently being graded by our experts';
      case 'graded': return 'Grading complete, preparing for shipment';
      case 'shipped': return 'Your graded cards are on their way back to you';
      default: return 'Status unknown';
    }
  }
}

export const preGradingService = new PreGradingService();