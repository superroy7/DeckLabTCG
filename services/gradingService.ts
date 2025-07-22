import { supabase } from '../lib/supabase';
import { CardGrading, Flaw, FlawType, FlawSeverity, GradingCompany } from '../types';

export interface GradingAnalysis {
  overallGrade: number;
  centering: number;
  corners: number;
  edges: number;
  surface: number;
  confidence: number;
  flaws: Flaw[];
  estimatedValue: number;
  recommendation: string;
}

class GradingService {
  async analyzeCard(cardId: string, imageUris: string[]): Promise<GradingAnalysis> {
    try {
      // Simulate AI analysis - in production, this would call actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

      // Mock analysis results
      const centering = this.generateGradeScore(7, 10);
      const corners = this.generateGradeScore(6, 10);
      const edges = this.generateGradeScore(7, 10);
      const surface = this.generateGradeScore(8, 10);

      const overallGrade = this.calculateOverallGrade(centering, corners, edges, surface);
      const confidence = this.calculateConfidence(overallGrade);
      const flaws = this.generateFlaws(centering, corners, edges, surface);
      const estimatedValue = this.estimateValue(cardId, overallGrade);
      const recommendation = this.generateRecommendation(overallGrade, estimatedValue);

      return {
        overallGrade,
        centering,
        corners,
        edges,
        surface,
        confidence,
        flaws,
        estimatedValue,
        recommendation,
      };
    } catch (error) {
      console.error('Error analyzing card:', error);
      throw error;
    }
  }

  async saveGrading(cardId: string, userId: string, analysis: GradingAnalysis): Promise<CardGrading> {
    try {
      const verificationId = this.generateVerificationId();

      const { data, error } = await supabase
        .from('card_gradings')
        .insert({
          card_id: cardId,
          user_id: userId,
          overall_grade: analysis.overallGrade,
          centering: analysis.centering,
          corners: analysis.corners,
          edges: analysis.edges,
          surface: analysis.surface,
          confidence: analysis.confidence,
          grading_company: GradingCompany.DECKLAB_AI,
          verification_id: verificationId,
          flaws: analysis.flaws,
          date_graded: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        overallGrade: data.overall_grade,
        centering: data.centering,
        corners: data.corners,
        edges: data.edges,
        surface: data.surface,
        confidence: data.confidence,
        gradingCompany: data.grading_company as GradingCompany,
        verificationID: data.verification_id,
        flaws: data.flaws,
        dateGraded: new Date(data.date_graded),
      };
    } catch (error) {
      console.error('Error saving grading:', error);
      throw error;
    }
  }

  async getGradingHistory(userId: string): Promise<CardGrading[]> {
    try {
      const { data, error } = await supabase
        .from('card_gradings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(grading => ({
        id: grading.id,
        overallGrade: grading.overall_grade,
        centering: grading.centering,
        corners: grading.corners,
        edges: grading.edges,
        surface: grading.surface,
        confidence: grading.confidence,
        gradingCompany: grading.grading_company as GradingCompany,
        verificationID: grading.verification_id,
        flaws: grading.flaws,
        dateGraded: new Date(grading.date_graded),
      }));
    } catch (error) {
      console.error('Error fetching grading history:', error);
      throw error;
    }
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
        type: FlawType.CENTERING,
        severity: centering < 6.0 ? FlawSeverity.SEVERE : centering < 7.0 ? FlawSeverity.MODERATE : FlawSeverity.MINOR,
        description: 'Card is off-center, affecting the border symmetry',
        location: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
      });
    }

    if (corners < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-2`,
        type: FlawType.CORNERS,
        severity: corners < 6.0 ? FlawSeverity.SEVERE : corners < 7.0 ? FlawSeverity.MODERATE : FlawSeverity.MINOR,
        description: 'Corner wear detected, may affect grading',
        location: { x: 0.85, y: 0.85, width: 0.1, height: 0.1 },
      });
    }

    if (edges < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-3`,
        type: FlawType.EDGES,
        severity: edges < 6.0 ? FlawSeverity.SEVERE : edges < 7.0 ? FlawSeverity.MODERATE : FlawSeverity.MINOR,
        description: 'Edge wear or roughness detected',
        location: { x: 0.0, y: 0.4, width: 1.0, height: 0.2 },
      });
    }

    if (surface < 8.0) {
      flaws.push({
        id: `flaw-${Date.now()}-4`,
        type: FlawType.SURFACE,
        severity: surface < 6.0 ? FlawSeverity.SEVERE : surface < 7.0 ? FlawSeverity.MODERATE : FlawSeverity.MINOR,
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

  private generateVerificationId(): string {
    return `DL${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export const gradingService = new GradingService();