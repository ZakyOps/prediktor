interface SectorData {
  sector: string;
  averageRevenue: number;
  averageExpenses: number;
  averageEmployees: number;
  growthRate: number;
  marketSize: number;
  keyMetrics: {
    profitability: number;
    efficiency: number;
    marketShare: number;
  };
  trends: string[];
  challenges: string[];
  opportunities: string[];
}

interface CompanyData {
  year: string;
  revenue: number;
  expenses: number;
  employees: number;
  sector: string;
  market: string;
}

interface HealthScore {
  overall: number;
  profitability: number;
  efficiency: number;
  growth: number;
  marketPosition: number;
  details: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

interface ComparativeAnalysis {
  companyData: CompanyData;
  sectorData: SectorData;
  healthScore: HealthScore;
  competitivePosition: {
    score: number;
    position: 'leader' | 'strong' | 'average' | 'weak' | 'struggling';
    description: string;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  charts: {
    revenueComparison: { company: number; sector: number; label: string }[];
    profitabilityTrend: { company: number; sector: number; period: string }[];
    marketPosition: { metric: string; company: number; sector: number }[];
  };
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
    }
  }

  async callGeminiAPI(prompt: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Quota API dépassé ou rate limiting. Veuillez réessayer dans quelques minutes.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Nettoyer la réponse pour extraire le JSON
      return this.cleanJsonResponse(responseText);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  private cleanJsonResponse(response: string): string {
    // Supprimer les backticks et le markdown
    let cleaned = response.trim();
    
    // Supprimer ```json et ``` au début et à la fin
    cleaned = cleaned.replace(/^```json\s*/i, '');
    cleaned = cleaned.replace(/^```\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
    
    // Supprimer tout texte avant le premier {
    const jsonStart = cleaned.indexOf('{');
    if (jsonStart > 0) {
      cleaned = cleaned.substring(jsonStart);
    }
    
    // Supprimer tout texte après le dernier }
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonEnd > 0 && jsonEnd < cleaned.length - 1) {
      cleaned = cleaned.substring(0, jsonEnd + 1);
    }
    
    return cleaned.trim();
  }

  async analyzeSectorData(sector: string, country: string = 'Côte d\'Ivoire'): Promise<SectorData> {
    const prompt = `
    Tu es un expert en analyse sectorielle. Analyse le secteur "${sector}" en ${country}.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }

    Exemple de réponse attendue (remplace les valeurs par des données réalistes pour "${sector}"):
    {
      "sector": "${sector}",
      "averageRevenue": 50000000,
      "averageExpenses": 35000000,
      "averageEmployees": 25,
      "growthRate": 12,
      "marketSize": 5000000000,
      "keyMetrics": {
        "profitability": 15,
        "efficiency": 75,
        "marketShare": 8
      },
      "trends": ["Digitalisation accélérée", "Investissements locaux", "Innovation technologique"],
      "challenges": ["Accès au financement", "Infrastructure limitée", "Concurrence internationale"],
      "opportunities": ["Marché en croissance", "Développement digital", "Partenariats locaux"]
    }

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
    `;

    const response = await this.callGeminiAPI(prompt);
    try {
      const data = JSON.parse(response);
      return this.validateAndTransformSectorData(data);
    } catch (error) {
      console.error('JSON Parse Error in analyzeSectorData:');
      console.error('Raw response:', response);
      console.error('Error:', error);
      throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
    }
  }

  async calculateHealthScore(companyData: CompanyData, sectorData: SectorData): Promise<HealthScore> {
    const prompt = `
    Tu es un expert en analyse financière. Calcule un score de santé pour une entreprise.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }

    Données entreprise:
    - Revenus: ${companyData.revenue} FCFA
    - Charges: ${companyData.expenses} FCFA
    - Employés: ${companyData.employees}
    - Secteur: ${companyData.sector}
    
    Données secteur:
    - Revenus moyens: ${sectorData.averageRevenue} FCFA
    - Charges moyennes: ${sectorData.averageExpenses} FCFA
    - Employés moyens: ${sectorData.averageEmployees}
    - Croissance: ${sectorData.growthRate}%

    Exemple de réponse attendue (calcule des scores réalistes):
    {
      "overall": 75,
      "profitability": 80,
      "efficiency": 70,
      "growth": 65,
      "marketPosition": 75,
      "details": {
        "strengths": ["Rentabilité supérieure à la moyenne", "Efficacité opérationnelle"],
        "weaknesses": ["Taille d'équipe limitée", "Potentiel de croissance"],
        "recommendations": ["Investir dans la croissance", "Optimiser les processus"]
      }
    }

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
    `;

    const response = await this.callGeminiAPI(prompt);
    try {
      const data = JSON.parse(response);
      return this.validateAndTransformHealthScore(data);
    } catch (error) {
      console.error('JSON Parse Error in calculateHealthScore:');
      console.error('Raw response:', response);
      console.error('Error:', error);
      throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
    }
  }

  async generateComparativeAnalysis(companyData: CompanyData): Promise<{ analysis: ComparativeAnalysis; isDemoData: boolean }> {
    try {
      // Récupérer les données sectorielles
      const sectorData = await this.analyzeSectorData(companyData.sector);
      
      // Calculer le score de santé
      const healthScore = await this.calculateHealthScore(companyData, sectorData);
      
      // Générer l'analyse comparative complète
      const prompt = `
      Tu es un expert en stratégie d'entreprise. Génère une analyse comparative complète.

      INSTRUCTIONS CRITIQUES:
      - Réponds UNIQUEMENT avec du JSON valide
      - PAS de texte avant ou après le JSON
      - PAS de markdown, backticks, ou code blocks
      - PAS d'explications ou de commentaires
      - Commence directement par { et termine par }

      Données entreprise:
      - Revenus: ${companyData.revenue} FCFA
      - Charges: ${companyData.expenses} FCFA
      - Employés: ${companyData.employees}
      - Secteur: ${companyData.sector}
      
      Score de santé: ${healthScore.overall}/100

      Exemple de réponse attendue (adapte au contexte africain):
      {
        "competitivePosition": {
          "score": 75,
          "position": "strong",
          "description": "Position concurrentielle solide avec des opportunités d'amélioration"
        },
        "recommendations": {
          "immediate": ["Optimiser les coûts opérationnels", "Renforcer la présence digitale"],
          "shortTerm": ["Développer de nouveaux marchés", "Investir dans la formation"],
          "longTerm": ["Expansion géographique", "Innovation produit"]
        },
        "charts": {
          "revenueComparison": [
            {"company": ${companyData.revenue}, "sector": ${sectorData.averageRevenue}, "label": "Revenus"}
          ],
          "profitabilityTrend": [
            {"company": ${(companyData.revenue - companyData.expenses) / companyData.revenue * 100}, "sector": ${sectorData.keyMetrics.profitability}, "period": "Actuel"}
          ],
          "marketPosition": [
            {"metric": "Rentabilité", "company": ${(companyData.revenue - companyData.expenses) / companyData.revenue * 100}, "sector": ${sectorData.keyMetrics.profitability}},
            {"metric": "Efficacité", "company": ${companyData.revenue / companyData.employees}, "sector": ${sectorData.averageRevenue / sectorData.averageEmployees}}
          ]
        }
      }

      RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
      `;

      const response = await this.callGeminiAPI(prompt);
      let analysis;
      try {
        analysis = JSON.parse(response);
      } catch (error) {
        console.error('JSON Parse Error in generateComparativeAnalysis:');
        console.error('Raw response:', response);
        console.error('Error:', error);
        throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
      }

      return {
        analysis: {
          companyData,
          sectorData,
          healthScore,
          ...this.validateAndTransformAnalysis(analysis)
        },
        isDemoData: false
      };
    } catch (error) {
      console.error('Error in generateComparativeAnalysis, using fallback data:', error);
      
      // Utiliser les données de fallback en cas d'erreur
      const sectorData = getFallbackSectorData(companyData.sector);
      const healthScore = getFallbackHealthScore();
      const analysis = getFallbackAnalysis(companyData, sectorData, healthScore);
      
      return {
        analysis: {
          companyData,
          sectorData,
          healthScore,
          ...analysis
        },
        isDemoData: true
      };
    }
  }

  async generateActionPlan(analysis: ComparativeAnalysis): Promise<{
    objectives: string[];
    actions: { category: string; actions: string[] }[];
    timeline: { phase: string; duration: string; actions: string[] }[];
  }> {
    const prompt = `
    Tu es un expert en stratégie d'entreprise spécialisé dans le marché africain. Génère un plan d'action détaillé et personnalisé.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }
    - Toutes les valeurs doivent être des chaînes de caractères simples

    CONTEXTE DE L'ENTREPRISE:
    - Secteur: ${analysis.companyData.sector}
    - Revenus: ${analysis.companyData.revenue.toLocaleString()} FCFA
    - Charges: ${analysis.companyData.expenses.toLocaleString()} FCFA
    - Employés: ${analysis.companyData.employees}
    - Score de santé: ${analysis.healthScore.overall}/100
    - Position concurrentielle: ${analysis.competitivePosition.position}
    
    DONNÉES SECTORIELLES:
    - Revenus moyens du secteur: ${analysis.sectorData.averageRevenue.toLocaleString()} FCFA
    - Croissance du secteur: ${analysis.sectorData.growthRate}%
    - Taille du marché: ${analysis.sectorData.marketSize.toLocaleString()} FCFA
    
    FORCES ET FAIBLESSES IDENTIFIÉES:
    - Forces: ${analysis.healthScore.details.strengths.join(', ')}
    - Faiblesses: ${analysis.healthScore.details.weaknesses.join(', ')}
    
    RECOMMANDATIONS EXISTANTES:
    - Immédiates: ${analysis.recommendations.immediate.join(', ')}
    - Court terme: ${analysis.recommendations.shortTerm.join(', ')}
    - Long terme: ${analysis.recommendations.longTerm.join(', ')}

    Exemple de réponse attendue (adapte au contexte africain):
    {
      "objectives": [
        "Augmenter les revenus de 25% en 12 mois en développant 3 nouveaux marchés",
        "Réduire les coûts opérationnels de 15% en optimisant les processus",
        "Améliorer la satisfaction client de 30% en formant l'équipe"
      ],
      "actions": [
        {
          "category": "Marketing",
          "actions": ["Lancer une campagne digitale ciblée", "Participer à 5 salons professionnels", "Créer un programme de fidélisation"]
        },
        {
          "category": "Opérations", 
          "actions": ["Automatiser les processus manuels", "Négocier de nouveaux fournisseurs", "Optimiser la chaîne logistique"]
        },
        {
          "category": "Finance",
          "actions": ["Diversifier les sources de financement", "Mettre en place un budget prévisionnel", "Optimiser la trésorerie"]
        },
        {
          "category": "Ressources Humaines",
          "actions": ["Former l'équipe aux nouvelles technologies", "Recruter 2 experts sectoriels", "Mettre en place un système de motivation"]
        }
      ],
      "timeline": [
        {
          "phase": "Phase 1 - Actions Immédiates",
          "duration": "1-3 mois",
          "actions": ["Audit des processus actuels", "Formation de l'équipe", "Lancement de la campagne digitale"]
        },
        {
          "phase": "Phase 2 - Développement",
          "duration": "3-6 mois", 
          "actions": ["Développement des nouveaux marchés", "Optimisation des processus", "Recrutement des experts"]
        },
        {
          "phase": "Phase 3 - Expansion",
          "duration": "6-12 mois",
          "actions": ["Expansion géographique", "Innovation produit", "Partenariats stratégiques"]
        }
      ]
    }

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
    `;

    const response = await this.callGeminiAPI(prompt);
    let actionPlanData;
    try {
      actionPlanData = JSON.parse(response);
    } catch (error) {
      console.error('JSON Parse Error in generateActionPlan:');
      console.error('Raw response:', response);
      console.error('Error:', error);
      throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
    }

    // Validation et transformation des données
    return this.validateAndTransformActionPlan(actionPlanData);
  }

  private validateAndTransformActionPlan(data: any): {
    objectives: string[];
    actions: { category: string; actions: string[] }[];
    timeline: { phase: string; duration: string; actions: string[] }[];
  } {
    // Validation des objectifs
    const objectives = Array.isArray(data.objectives) 
      ? data.objectives.map((obj: any) => typeof obj === 'string' ? obj : JSON.stringify(obj))
      : ['Objectif 1: Améliorer la rentabilité', 'Objectif 2: Optimiser les processus', 'Objectif 3: Développer le marché'];

    // Validation des actions par catégorie
    const actions = Array.isArray(data.actions) 
      ? data.actions.map((category: any) => ({
          category: typeof category.category === 'string' ? category.category : 'Catégorie',
          actions: Array.isArray(category.actions) 
            ? category.actions.map((action: any) => typeof action === 'string' ? action : JSON.stringify(action))
            : ['Action 1', 'Action 2', 'Action 3']
        }))
      : [
          { category: 'Marketing', actions: ['Action marketing 1', 'Action marketing 2', 'Action marketing 3'] },
          { category: 'Opérations', actions: ['Action opérations 1', 'Action opérations 2', 'Action opérations 3'] },
          { category: 'Finance', actions: ['Action finance 1', 'Action finance 2', 'Action finance 3'] },
          { category: 'Ressources Humaines', actions: ['Action RH 1', 'Action RH 2', 'Action RH 3'] }
        ];

    // Validation de la timeline
    const timeline = Array.isArray(data.timeline)
      ? data.timeline.map((phase: any) => ({
          phase: typeof phase.phase === 'string' ? phase.phase : 'Phase',
          duration: typeof phase.duration === 'string' ? phase.duration : '1-3 mois',
          actions: Array.isArray(phase.actions)
            ? phase.actions.map((action: any) => typeof action === 'string' ? action : JSON.stringify(action))
            : ['Action 1', 'Action 2', 'Action 3']
        }))
      : [
          { phase: 'Phase 1 - Actions Immédiates', duration: '1-3 mois', actions: ['Action prioritaire 1', 'Action prioritaire 2', 'Action prioritaire 3'] },
          { phase: 'Phase 2 - Développement', duration: '3-6 mois', actions: ['Action développement 1', 'Action développement 2', 'Action développement 3'] },
          { phase: 'Phase 3 - Expansion', duration: '6-12 mois', actions: ['Action expansion 1', 'Action expansion 2', 'Action expansion 3'] }
        ];

    return { objectives, actions, timeline };
  }

  private validateAndTransformAnalysis(data: any): any {
    // Validation et transformation des recommandations
    const recommendations = {
      immediate: Array.isArray(data.recommendations?.immediate) 
        ? data.recommendations.immediate.map((rec: any) => typeof rec === 'string' ? rec : JSON.stringify(rec))
        : ['Optimiser les coûts opérationnels', 'Renforcer la présence digitale'],
      shortTerm: Array.isArray(data.recommendations?.shortTerm)
        ? data.recommendations.shortTerm.map((rec: any) => typeof rec === 'string' ? rec : JSON.stringify(rec))
        : ['Développer de nouveaux marchés', 'Investir dans la formation'],
      longTerm: Array.isArray(data.recommendations?.longTerm)
        ? data.recommendations.longTerm.map((rec: any) => typeof rec === 'string' ? rec : JSON.stringify(rec))
        : ['Expansion géographique', 'Innovation produit']
    };

    // Validation et transformation de la position concurrentielle
    const competitivePosition = {
      score: typeof data.competitivePosition?.score === 'number' ? data.competitivePosition.score : 75,
      position: typeof data.competitivePosition?.position === 'string' ? data.competitivePosition.position : 'strong',
      description: typeof data.competitivePosition?.description === 'string' ? data.competitivePosition.description : 'Position concurrentielle solide'
    };

    // Validation et transformation des graphiques
    const charts = {
      revenueComparison: Array.isArray(data.charts?.revenueComparison)
        ? data.charts.revenueComparison.map((item: any) => ({
            company: typeof item.company === 'number' ? item.company : 0,
            sector: typeof item.sector === 'number' ? item.sector : 0,
            label: typeof item.label === 'string' ? item.label : 'Revenus'
          }))
        : [{ company: 0, sector: 0, label: 'Revenus' }],
      profitabilityTrend: Array.isArray(data.charts?.profitabilityTrend)
        ? data.charts.profitabilityTrend.map((item: any) => ({
            company: typeof item.company === 'number' ? item.company : 0,
            sector: typeof item.sector === 'number' ? item.sector : 0,
            period: typeof item.period === 'string' ? item.period : 'Actuel'
          }))
        : [{ company: 0, sector: 0, period: 'Actuel' }],
      marketPosition: Array.isArray(data.charts?.marketPosition)
        ? data.charts.marketPosition.map((item: any) => ({
            metric: typeof item.metric === 'string' ? item.metric : 'Métrique',
            company: typeof item.company === 'number' ? item.company : 0,
            sector: typeof item.sector === 'number' ? item.sector : 0
          }))
        : [{ metric: 'Rentabilité', company: 0, sector: 0 }]
    };

    return {
      competitivePosition,
      recommendations,
      charts
    };
  }

  private validateAndTransformSectorData(data: any): SectorData {
    return {
      sector: typeof data.sector === 'string' ? data.sector : 'Secteur',
      averageRevenue: typeof data.averageRevenue === 'number' ? data.averageRevenue : 50000000,
      averageExpenses: typeof data.averageExpenses === 'number' ? data.averageExpenses : 35000000,
      averageEmployees: typeof data.averageEmployees === 'number' ? data.averageEmployees : 25,
      growthRate: typeof data.growthRate === 'number' ? data.growthRate : 12,
      marketSize: typeof data.marketSize === 'number' ? data.marketSize : 5000000000,
      keyMetrics: {
        profitability: typeof data.keyMetrics?.profitability === 'number' ? data.keyMetrics.profitability : 15,
        efficiency: typeof data.keyMetrics?.efficiency === 'number' ? data.keyMetrics.efficiency : 75,
        marketShare: typeof data.keyMetrics?.marketShare === 'number' ? data.keyMetrics.marketShare : 8
      },
      trends: Array.isArray(data.trends) 
        ? data.trends.map((trend: any) => typeof trend === 'string' ? trend : JSON.stringify(trend))
        : ['Digitalisation accélérée', 'Investissements locaux', 'Innovation technologique'],
      challenges: Array.isArray(data.challenges)
        ? data.challenges.map((challenge: any) => typeof challenge === 'string' ? challenge : JSON.stringify(challenge))
        : ['Accès au financement', 'Infrastructure limitée', 'Concurrence internationale'],
      opportunities: Array.isArray(data.opportunities)
        ? data.opportunities.map((opportunity: any) => typeof opportunity === 'string' ? opportunity : JSON.stringify(opportunity))
        : ['Marché en croissance', 'Développement digital', 'Partenariats locaux']
    };
  }

  private validateAndTransformHealthScore(data: any): HealthScore {
    return {
      overall: typeof data.overall === 'number' ? data.overall : 75,
      profitability: typeof data.profitability === 'number' ? data.profitability : 80,
      efficiency: typeof data.efficiency === 'number' ? data.efficiency : 70,
      growth: typeof data.growth === 'number' ? data.growth : 65,
      marketPosition: typeof data.marketPosition === 'number' ? data.marketPosition : 75,
      details: {
        strengths: Array.isArray(data.details?.strengths)
          ? data.details.strengths.map((strength: any) => typeof strength === 'string' ? strength : JSON.stringify(strength))
          : ['Rentabilité supérieure à la moyenne', 'Efficacité opérationnelle'],
        weaknesses: Array.isArray(data.details?.weaknesses)
          ? data.details.weaknesses.map((weakness: any) => typeof weakness === 'string' ? weakness : JSON.stringify(weakness))
          : ['Taille d\'équipe limitée', 'Potentiel de croissance'],
        recommendations: Array.isArray(data.details?.recommendations)
          ? data.details.recommendations.map((rec: any) => typeof rec === 'string' ? rec : JSON.stringify(rec))
          : ['Investir dans la croissance', 'Optimiser les processus']
      }
    };
  }
}

// Données de fallback pour éviter les erreurs quand l'API échoue
export const getFallbackSectorData = (sector: string): SectorData => ({
  sector,
  averageRevenue: 50000000,
  averageExpenses: 35000000,
  averageEmployees: 25,
  growthRate: 12,
  marketSize: 5000000000,
  keyMetrics: {
    profitability: 15,
    efficiency: 75,
    marketShare: 8
  },
  trends: ["Digitalisation accélérée", "Investissements locaux", "Innovation technologique"],
  challenges: ["Accès au financement", "Infrastructure limitée", "Concurrence internationale"],
  opportunities: ["Marché en croissance", "Développement digital", "Partenariats locaux"]
});

export const getFallbackHealthScore = (): HealthScore => ({
  overall: 75,
  profitability: 80,
  efficiency: 70,
  growth: 65,
  marketPosition: 75,
  details: {
    strengths: ["Rentabilité supérieure à la moyenne", "Efficacité opérationnelle"],
    weaknesses: ["Taille d'équipe limitée", "Potentiel de croissance"],
    recommendations: ["Investir dans la croissance", "Optimiser les processus"]
  }
});

export const getFallbackAnalysis = (companyData: CompanyData, sectorData: SectorData, healthScore: HealthScore) => ({
  competitivePosition: {
    score: 75,
    position: 'strong' as const,
    description: "Position concurrentielle solide avec des opportunités d'amélioration"
  },
  recommendations: {
    immediate: ["Optimiser les coûts opérationnels", "Renforcer la présence digitale"],
    shortTerm: ["Développer de nouveaux marchés", "Investir dans la formation"],
    longTerm: ["Expansion géographique", "Innovation produit"]
  },
  charts: {
    revenueComparison: [
      {"company": companyData.revenue, "sector": sectorData.averageRevenue, "label": "Revenus"}
    ],
    profitabilityTrend: [
      {"company": (companyData.revenue - companyData.expenses) / companyData.revenue * 100, "sector": sectorData.keyMetrics.profitability, "period": "Actuel"}
    ],
    marketPosition: [
      {"metric": "Rentabilité", "company": (companyData.revenue - companyData.expenses) / companyData.revenue * 100, "sector": sectorData.keyMetrics.profitability},
      {"metric": "Efficacité", "company": companyData.revenue / companyData.employees, "sector": sectorData.averageRevenue / sectorData.averageEmployees}
    ]
  }
});

export default GeminiService;
export type { SectorData, CompanyData, HealthScore, ComparativeAnalysis }; 