import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PlantEnvironment {
  temperature: number;
  humidity: number;
  light: number;
  soilMoisture?: number;
  rainfall?: number;
}

export interface PlantData {
  name: string;
  species: string;
  isOutdoor: boolean;
  environment: PlantEnvironment;
  healthScore: number;
  lastWatered?: string;
  lastFertilized?: string;
}

export interface WeatherForecast {
  date: string;
  tempHigh: number;
  tempLow: number;
  humidity: number;
  precipitation: number;
  condition: string;
}

export interface GrowthPrediction {
  growthRate: number;
  healthTrajectory: 'improving' | 'stable' | 'declining';
  predictions: Array<{
    day: number;
    growthPercent: number;
    healthScore: number;
    riskLevel: 'low' | 'medium' | 'high';
  }>;
  riskPeriods: Array<{
    startDay: number;
    endDay: number;
    reason: string;
  }>;
  keyFactors: Array<{
    factor: string;
    impact: 'positive' | 'negative';
    description: string;
  }>;
  summary: string;
}

export interface CareRecommendation {
  type: 'watering' | 'light' | 'temperature' | 'humidity' | 'fertilizer' | 'pruning';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reason: string;
  timing: string;
}

export interface CareRecommendations {
  recommendations: CareRecommendation[];
  overallAssessment: string;
}

export interface HealthAnalysis {
  healthScore: number;
  status: 'Healthy' | 'Moderate Stress' | 'Needs Attention' | 'Critical';
  stressFactors: Array<{
    factor: string;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
  }>;
  environmentalAnalysis: {
    temperature: { status: 'optimal' | 'warning' | 'critical'; recommendation: string };
    humidity: { status: 'optimal' | 'warning' | 'critical'; recommendation: string };
    light: { status: 'optimal' | 'warning' | 'critical'; recommendation: string };
    soilMoisture: { status: 'optimal' | 'warning' | 'critical'; recommendation: string };
  };
  immediateActions: string[];
  longTermCare: string[];
}

export interface DailyInsight {
  insight: string;
  impact: string;
  basedOn: string[];
  confidence: number;
}

type AnalysisType = 'growth-prediction' | 'care-recommendation' | 'health-analysis' | 'daily-insight';

// Global request queue and cache to prevent rate limiting
const requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;
const responseCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
const REQUEST_DELAY = 2000; // 2 second delay between requests

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
      if (requestQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
      }
    }
  }
  
  isProcessingQueue = false;
};

const getCacheKey = (type: AnalysisType, plantData: PlantData): string => {
  return `${type}-${plantData.name}-${plantData.healthScore}-${JSON.stringify(plantData.environment)}`;
};

export function usePlantAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRequests = useRef(new Set<string>());

  const analyze = useCallback(async <T>(
    type: AnalysisType,
    plantData: PlantData,
    weatherForecast?: WeatherForecast[]
  ): Promise<T | null> => {
    const cacheKey = getCacheKey(type, plantData);
    
    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Using cached ${type} analysis for ${plantData.name}`);
      return cached.data as T;
    }
    
    // Prevent duplicate pending requests
    if (pendingRequests.current.has(cacheKey)) {
      console.log(`Request already pending for ${type}`);
      return null;
    }
    
    pendingRequests.current.add(cacheKey);
    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      const executeRequest = async () => {
        try {
          console.log(`Requesting ${type} analysis for ${plantData.name}`);
          
          const { data, error: fnError } = await supabase.functions.invoke('plant-ai-analysis', {
            body: { type, plantData, weatherForecast }
          });

          // Handle rate limit and payment errors gracefully
          if (fnError) {
            const errorMessage = fnError.message || '';
            if (errorMessage.includes('429') || errorMessage.includes('Rate limit')) {
              console.log('Rate limited - using fallback data');
              toast.info('AI is busy. Showing cached insights.', { duration: 3000 });
              resolve(null);
              return;
            }
            if (errorMessage.includes('402') || errorMessage.includes('credits')) {
              toast.warning('AI credits low. Please try again later.', { duration: 3000 });
              resolve(null);
              return;
            }
            throw new Error(errorMessage || 'Analysis failed');
          }

          if (data?.error) {
            if (data.error.includes('Rate limit') || data.error.includes('429')) {
              console.log('Rate limited - using fallback data');
              toast.info('AI is busy. Showing cached insights.', { duration: 3000 });
              resolve(null);
              return;
            }
            throw new Error(data.error);
          }

          console.log(`${type} analysis complete:`, data.result);
          
          // Cache the successful response
          responseCache.set(cacheKey, { data: data.result, timestamp: Date.now() });
          
          resolve(data.result as T);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Analysis failed';
          // Only show error toast for non-rate-limit errors
          if (!message.includes('Rate limit') && !message.includes('429')) {
            setError(message);
            toast.error(`AI Analysis Error: ${message}`);
          }
          console.error('Plant AI error:', err);
          resolve(null);
        } finally {
          pendingRequests.current.delete(cacheKey);
          setIsLoading(false);
        }
      };

      // Add to queue and process
      requestQueue.push(executeRequest);
      processQueue();
    });
  }, []);

  const getGrowthPrediction = useCallback(
    (plantData: PlantData, weatherForecast?: WeatherForecast[]) =>
      analyze<GrowthPrediction>('growth-prediction', plantData, weatherForecast),
    [analyze]
  );

  const getCareRecommendations = useCallback(
    (plantData: PlantData) =>
      analyze<CareRecommendations>('care-recommendation', plantData),
    [analyze]
  );

  const getHealthAnalysis = useCallback(
    (plantData: PlantData) =>
      analyze<HealthAnalysis>('health-analysis', plantData),
    [analyze]
  );

  const getDailyInsight = useCallback(
    (plantData: PlantData, weatherForecast?: WeatherForecast[]) =>
      analyze<DailyInsight>('daily-insight', plantData, weatherForecast),
    [analyze]
  );

  return {
    isLoading,
    error,
    getGrowthPrediction,
    getCareRecommendations,
    getHealthAnalysis,
    getDailyInsight,
  };
}
