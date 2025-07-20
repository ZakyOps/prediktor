import { useUserHistory } from "@/hooks/use-user-history";
import { useToast } from '@/hooks/use-toast';
import { ComparativeAnalysis } from '@/services/gemini';
import { useMemo } from 'react';

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
  const { lastAnalysis, loading } = useUserHistory();

  // Calculer la probabilité d'atteinte des objectifs basée sur les données réelles
  const calculateObjectiveProbability = (
    analysis: ComparativeAnalysis, 
    riskScore: number, 
    healthScore: number, 
    profitabilityGap: number, 
    efficiencyGap: number
  ): number => {
    // Base de probabilité (50-95%)
    let baseProbability = 50;
    
    // Facteur de santé (0-20 points)
    const healthFactor = Math.max(0, Math.min(20, healthScore * 0.2));
    
    // Facteur de rentabilité (0-15 points)
    const profitabilityFactor = Math.max(0, Math.min(15, Math.max(0, profitabilityGap) * 0.5));
    
    // Facteur d'efficacité (0-10 points)
    const efficiencyFactor = Math.max(0, Math.min(10, Math.max(0, efficiencyGap) * 0.2));
    
    // Facteur de croissance (0-10 points)
    const growthGap = analysis.sectorData.growthRate - analysis.sectorData.growthRate * 0.8; // Objectif réaliste
    const growthFactor = Math.max(0, Math.min(10, Math.max(0, growthGap) * 0.5));
    
    // Pénalité de risque (0-20 points négatifs)
    const riskPenalty = Math.max(0, Math.min(20, riskScore * 0.2));
    
    // Calcul final
    const finalProbability = Math.round(
      baseProbability + 
      healthFactor + 
      profitabilityFactor + 
      efficiencyFactor + 
      growthFactor - 
      riskPenalty
    );
    
    return Math.max(10, Math.min(95, finalProbability));
  };

  // Transformer les données d'analyse en insights
  const transformAnalysisToInsights = (analysis: ComparativeAnalysis) => {
    // Calculer la croissance actuelle basée sur les données réelles de l'entreprise
    const currentGrowth = analysis.healthScore.growth;
    const sectorGrowth = analysis.sectorData.growthRate;
    
    // Calculer la projection réaliste basée sur les performances de l'entreprise
    const companyProfitability = analysis.healthScore.profitability;
    const sectorProfitability = analysis.sectorData.keyMetrics.profitability;
    const profitabilityAdvantage = companyProfitability - sectorProfitability;
    
    const companyEfficiency = analysis.healthScore.efficiency;
    const sectorEfficiency = analysis.sectorData.keyMetrics.efficiency;
    const efficiencyAdvantage = companyEfficiency - sectorEfficiency;
    
    const healthScore = analysis.healthScore.overall;
    
    // Facteur de projection basé sur les performances réelles
    const performanceFactor = Math.max(0.8, Math.min(2.0, 
      1 + (profitabilityAdvantage / 100) + (efficiencyAdvantage / 100) + (healthScore - 50) / 100
    ));
    
    // Projection réaliste basée sur les données de l'entreprise
    const projectedGrowth = Math.max(0, Math.min(35, currentGrowth * performanceFactor));
    
    // Générer les projections mensuelles avec variabilité réaliste
    const monthlyProjections = [];
    const baseGrowth = currentGrowth;
    const targetGrowth = projectedGrowth;
    
    for (let i = -12; i <= 12; i++) {
      const month = i < 0 ? `M${i}` : i === 0 ? 'M' : `M+${i}`;
      
      // Progression non-linéaire avec variabilité
      const progress = (i + 12) / 24;
      const variability = 0.1; // 10% de variabilité
      const randomFactor = 1 + (Math.random() - 0.5) * variability;
      
      const growth = Math.max(0, 
        baseGrowth + (targetGrowth - baseGrowth) * progress * randomFactor
      );
      
      monthlyProjections.push({ 
        month, 
        growth: Math.round(growth * 10) / 10 
      });
    }
    const gap = currentGrowth - sectorGrowth;
    
    // Calcul du risque basé sur plusieurs facteurs
    const profitabilityGap = profitabilityAdvantage;
    const efficiencyGap = efficiencyAdvantage;
    
    // Calcul du score de risque composite (0-100, plus bas = moins de risque)
    const growthRisk = Math.max(0, Math.min(100, 50 - (gap * 5))); // Croissance
    const profitabilityRisk = Math.max(0, Math.min(100, 50 - (profitabilityGap * 2))); // Rentabilité
    const efficiencyRisk = Math.max(0, Math.min(100, 50 - (efficiencyGap * 0.5))); // Efficacité
    const healthRisk = Math.max(0, Math.min(100, 100 - healthScore)); // Score de santé
    
    // Score de risque final (moyenne pondérée)
    const finalRiskScore = Math.round(
      (growthRisk * 0.25) + 
      (profitabilityRisk * 0.25) + 
      (efficiencyRisk * 0.25) + 
      (healthRisk * 0.25)
    );
    
    // Déterminer le niveau de risque
    let riskLevel: string;
    if (finalRiskScore <= 20) {
      riskLevel = 'Très Bas';
    } else if (finalRiskScore <= 40) {
      riskLevel = 'Bas';
    } else if (finalRiskScore <= 60) {
      riskLevel = 'Modéré';
    } else if (finalRiskScore <= 80) {
      riskLevel = 'Élevé';
    } else {
      riskLevel = 'Très Élevé';
    }
    
    const riskPercentage = Math.max(0, Math.min(100, finalRiskScore));
    const indicators = [
      {
        indicator: 'Croissance',
        company: currentGrowth,
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
    const recommendations = analysis.recommendations.immediate;
    const mainRecommendation = recommendations[0] || 'Optimiser la stratégie';
    const opportunities = analysis.sectorData.opportunities;
    const mainOpportunity = opportunities[0] || 'Nouveau marché';
    return {
      growthData: {
        current: currentGrowth,
        projected12Months: targetGrowth,
        minGrowth: Math.min(...monthlyProjections.map(p => p.growth)),
        maxGrowth: Math.max(...monthlyProjections.map(p => p.growth)),
        evolution12Months: targetGrowth - currentGrowth,
        monthlyProjections
      },
      benchmarkData: {
        companyGrowth: currentGrowth,
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
          value: calculateObjectiveProbability(analysis, finalRiskScore, healthScore, profitabilityGap, efficiencyGap),
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
        lastAnalysisDate: (analysis as any).createdAt || new Date().toISOString(),
        companyName: analysis.companyData.sector,
        sector: analysis.companyData.sector,
        isDemoData: false
      }
    };
  };

  const insights = useMemo(() => {
    if (!lastAnalysis) return null;
    try {
      return transformAnalysisToInsights(lastAnalysis);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de transformer l'analyse en insights.",
        variant: "destructive",
        duration: 5000,
      });
      return null;
    }
  }, [lastAnalysis, toast]);

  return {
    insights,
    loading,
    error: null,
    refreshInsights: () => {} // Optionnel
  };
}; 