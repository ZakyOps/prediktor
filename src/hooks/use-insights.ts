import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ComparativeAnalysis } from '@/services/gemini';

export interface InsightData {
  // Données de croissance prévisionnelle
  growthData: {
    current: number;
    projected12Months: number;
    minGrowth: number;
    maxGrowth: number;
    evolution12Months: number;
    monthlyProjections: Array<{
      month: string;
      growth: number;
    }>;
  };
  
  // Données de benchmark sectoriel
  benchmarkData: {
    companyGrowth: number;
    sectorGrowth: number;
    gap: number;
    riskLevel: string;
    indicators: Array<{
      indicator: string;
      company: number;
      sector: number;
    }>;
  };
  
  // Scores IA
  aiScores: {
    riskScore: {
      value: string;
      percentage: number;
      description: string;
    };
    objectiveProbability: {
      value: number;
      description: string;
    };
    recommendation: {
      title: string;
      description: string;
      impact: string;
    };
    opportunity: {
      title: string;
      description: string;
      potential: string;
    };
  };
  
  // Métadonnées
  metadata: {
    lastAnalysisDate: string;
    companyName: string;
    sector: string;
    isDemoData: boolean;
  };
}

export const useInsights = () => {
  const { toast } = useToast();
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données de la dernière analyse depuis le localStorage
  const getLastAnalysis = (): ComparativeAnalysis | null => {
    try {
      const stored = localStorage.getItem('lastAnalysis');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error('Error parsing last analysis:', error);
      return null;
    }
  };

  // Transformer les données d'analyse en insights
  const transformAnalysisToInsights = (analysis: ComparativeAnalysis): InsightData => {
    // Extraire les données de croissance depuis l'analyse
    const companyGrowth = analysis.sectorData.growthRate;
    const projectedGrowth = Math.min(companyGrowth * 1.5, 30); // Projection optimiste
    
    // Générer les projections mensuelles
    const monthlyProjections = [];
    const baseGrowth = companyGrowth;
    const targetGrowth = projectedGrowth;
    
    for (let i = -12; i <= 12; i++) {
      const month = i < 0 ? `M${i}` : i === 0 ? 'M' : `M+${i}`;
      const growth = Math.max(0, baseGrowth + (targetGrowth - baseGrowth) * (i + 12) / 24);
      monthlyProjections.push({ month, growth: Math.round(growth * 10) / 10 });
    }

    // Extraire les données de benchmark
    const sectorGrowth = analysis.sectorData.growthRate;
    const gap = companyGrowth - sectorGrowth;

    // Calculer le niveau de risque
    const riskLevel = gap > 5 ? 'Bas' : gap > 0 ? 'Modéré' : 'Élevé';
    const riskPercentage = Math.max(0, Math.min(100, 100 - (gap * 10)));

    // Générer les indicateurs de benchmark
    const indicators = [
      {
        indicator: 'Croissance',
        company: companyGrowth,
        sector: sectorGrowth
      },
      {
        indicator: 'Rentabilité',
        company: analysis.healthScore.profitability,
        sector: analysis.sectorData.keyMetrics.profitability
      },
      {
        indicator: 'Risque',
        company: riskPercentage / 10,
        sector: 5
      }
    ];

    // Extraire les recommandations
    const recommendations = analysis.recommendations.immediate;
    const mainRecommendation = recommendations[0] || 'Optimiser la stratégie';

    // Extraire les opportunités
    const opportunities = analysis.sectorData.opportunities;
    const mainOpportunity = opportunities[0] || 'Nouveau marché';

    return {
      growthData: {
        current: companyGrowth,
        projected12Months: targetGrowth,
        minGrowth: Math.min(...monthlyProjections.map(p => p.growth)),
        maxGrowth: Math.max(...monthlyProjections.map(p => p.growth)),
        evolution12Months: targetGrowth - companyGrowth,
        monthlyProjections
      },
      benchmarkData: {
        companyGrowth,
        sectorGrowth,
        gap,
        riskLevel,
        indicators
      },
      aiScores: {
        riskScore: {
          value: riskLevel,
          percentage: riskPercentage,
          description: `Risque ${riskLevel.toLowerCase()} selon l'IA`
        },
        objectiveProbability: {
          value: Math.max(50, Math.min(95, 85 + gap * 2)),
          description: 'd\'atteindre vos objectifs annuels'
        },
        recommendation: {
          title: mainRecommendation,
          description: 'Recommandation basée sur l\'analyse sectorielle',
          impact: '+5% de performance'
        },
        opportunity: {
          title: mainOpportunity,
          description: 'Opportunité détectée dans le secteur',
          potential: '+10% CA'
        }
      },
      metadata: {
        lastAnalysisDate: new Date().toISOString(),
        companyName: analysis.companyData.sector,
        sector: analysis.companyData.sector,
        isDemoData: false
      }
    };
  };

  // Charger les insights
  const loadInsights = () => {
    try {
      setLoading(true);
      setError(null);

      const lastAnalysis = getLastAnalysis();
      
      if (!lastAnalysis) {
        setError('Aucune analyse récente trouvée. Veuillez effectuer une analyse sectorielle.');
        setInsights(null);
        return;
      }

      const insightsData = transformAnalysisToInsights(lastAnalysis);
      setInsights(insightsData);

      if (insightsData.metadata.isDemoData) {
        toast({
          title: "Données de démonstration",
          description: "Les insights affichés sont basés sur des données de démonstration.",
          duration: 5000,
        });
      }

    } catch (error) {
      console.error('Error loading insights:', error);
      setError('Erreur lors du chargement des insights');
      toast({
        title: "Erreur",
        description: "Impossible de charger les insights. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Recharger les insights
  const refreshInsights = () => {
    loadInsights();
  };

  // Charger les insights au montage du composant
  useEffect(() => {
    loadInsights();
  }, []);

  return {
    insights,
    loading,
    error,
    refreshInsights
  };
}; 