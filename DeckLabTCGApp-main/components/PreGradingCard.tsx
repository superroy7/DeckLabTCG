import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Zap, Star, TrendingUp, CircleAlert as AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { preGradingService } from '@/services/preGradingService';
import { PreGradingResult } from '@/types/pokemon';

interface PreGradingCardProps {
  onStartGrading: () => void;
  onGradingComplete?: (result: PreGradingResult) => void;
}

export function PreGradingCard({ onStartGrading, onGradingComplete }: PreGradingCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<PreGradingResult | null>(null);

  const handleStartGrading = async () => {
    try {
      setIsAnalyzing(true);
      onStartGrading();
      
      // Simulate camera capture and analysis
      const mockImageData = ['image1', 'image2', 'image3'];
      const result = await preGradingService.analyzeCardCondition('mock-card-id', mockImageData);
      
      setLastResult(result);
      onGradingComplete?.(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze card condition. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 9.5) return '#10B981'; // Green
    if (grade >= 8.5) return '#3B82F6'; // Blue
    if (grade >= 7.0) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  const styles = getStyles(isDark);

  return (
    <Animated.View entering={FadeInDown.delay(200)} style={styles.container}>
      <LinearGradient
        colors={isDark ? ['#1f2937', '#374151'] : ['#ffffff', '#f8fafc']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Zap size={24} color="#3B82F6" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>AI Pre-Grading</Text>
            <Text style={styles.subtitle}>Get instant condition analysis</Text>
          </View>
        </View>

        {lastResult ? (
          <Animated.View entering={FadeInRight} style={styles.resultContainer}>
            <View style={styles.gradeDisplay}>
              <Text style={styles.gradeLabel}>Overall Grade</Text>
              <Text style={[
                styles.gradeValue,
                { color: getGradeColor(lastResult.overallGrade) }
              ]}>
                {lastResult.overallGrade.toFixed(1)}
              </Text>
              <Text style={styles.confidenceText}>
                {Math.round(lastResult.confidence * 100)}% confidence
              </Text>
            </View>

            <View style={styles.subGrades}>
              <View style={styles.subGradeItem}>
                <Text style={styles.subGradeLabel}>Centering</Text>
                <Text style={styles.subGradeValue}>{lastResult.subGrades.centering.toFixed(1)}</Text>
              </View>
              <View style={styles.subGradeItem}>
                <Text style={styles.subGradeLabel}>Corners</Text>
                <Text style={styles.subGradeValue}>{lastResult.subGrades.corners.toFixed(1)}</Text>
              </View>
              <View style={styles.subGradeItem}>
                <Text style={styles.subGradeLabel}>Edges</Text>
                <Text style={styles.subGradeValue}>{lastResult.subGrades.edges.toFixed(1)}</Text>
              </View>
              <View style={styles.subGradeItem}>
                <Text style={styles.subGradeLabel}>Surface</Text>
                <Text style={styles.subGradeValue}>{lastResult.subGrades.surface.toFixed(1)}</Text>
              </View>
            </View>

            <View style={styles.valueEstimate}>
              <TrendingUp size={16} color="#10B981" />
              <Text style={styles.valueText}>
                Estimated Value: ${lastResult.estimatedValue.toFixed(2)}
              </Text>
            </View>

            {lastResult.flaws.length > 0 && (
              <View style={styles.flawsContainer}>
                <View style={styles.flawsHeader}>
                  <AlertCircle size={16} color="#F59E0B" />
                  <Text style={styles.flawsTitle}>Issues Detected</Text>
                </View>
                {lastResult.flaws.slice(0, 2).map((flaw) => (
                  <Text key={flaw.id} style={styles.flawText}>
                    • {flaw.description}
                  </Text>
                ))}
              </View>
            )}

            <Text style={styles.recommendation}>
              {lastResult.gradingRecommendation}
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.actionContainer}>
            <Text style={styles.description}>
              Use AI-powered analysis to get instant condition assessment and grading estimates for your cards.
            </Text>

            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Star size={16} color="#3B82F6" />
                <Text style={styles.featureText}>Professional-grade analysis</Text>
              </View>
              <View style={styles.featureItem}>
                <Camera size={16} color="#3B82F6" />
                <Text style={styles.featureText}>Multi-angle scanning</Text>
              </View>
              <View style={styles.featureItem}>
                <TrendingUp size={16} color="#3B82F6" />
                <Text style={styles.featureText}>Value estimation</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionButton, isAnalyzing && styles.actionButtonDisabled]}
          onPress={handleStartGrading}
          disabled={isAnalyzing}
        >
          <LinearGradient
            colors={isAnalyzing ? ['#6b7280', '#9ca3af'] : ['#3B82F6', '#1D4ED8']}
            style={styles.buttonGradient}
          >
            <Camera size={20} color="white" />
            <Text style={styles.buttonText}>
              {isAnalyzing ? 'Analyzing...' : lastResult ? 'Analyze Another Card' : 'Start Analysis'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? '#374151' : '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  resultContainer: {
    marginBottom: 16,
  },
  gradeDisplay: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: isDark ? '#374151' : '#f8fafc',
    borderRadius: 12,
  },
  gradeLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 4,
  },
  gradeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  subGrades: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subGradeItem: {
    alignItems: 'center',
    flex: 1,
  },
  subGradeLabel: {
    fontSize: 12,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 4,
  },
  subGradeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#1f2937',
  },
  valueEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: isDark ? '#065f46' : '#d1fae5',
    borderRadius: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  flawsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: isDark ? '#451a03' : '#fef3c7',
    borderRadius: 8,
  },
  flawsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  flawsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 8,
  },
  flawText: {
    fontSize: 12,
    color: isDark ? '#fbbf24' : '#92400e',
    marginBottom: 2,
  },
  recommendation: {
    fontSize: 14,
    color: isDark ? '#d1d5db' : '#4b5563',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  actionContainer: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: isDark ? '#d1d5db' : '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: isDark ? '#d1d5db' : '#4b5563',
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});