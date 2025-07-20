import { UserProfile } from "@/services/user-profile";

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

  async analyzeSectorData(sector: string, userProfile?: UserProfile): Promise<SectorData> {
    const country = userProfile?.country || 'Côte d\'Ivoire';
    const currency = userProfile?.currency || 'FCFA';
    
    const prompt = `
    Tu es un expert en analyse sectorielle. Analyse le secteur "${sector}" en ${country}.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }
    - IMPORTANT: Adapte les données au contexte économique de ${country} et utilise ${currency} comme devise

    CONTEXTE GÉOGRAPHIQUE ET ÉCONOMIQUE:
    - Pays: ${country}
    - Devise: ${currency}
    - Secteur: ${sector}
    - Contexte: Marché africain avec spécificités locales

    Exemple de réponse attendue (remplace les valeurs par des données réalistes pour "${sector}" en ${country}):
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

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire. Adapte les données au contexte de ${country}.
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

  async calculateHealthScore(companyData: CompanyData, sectorData: SectorData, userProfile?: UserProfile): Promise<HealthScore> {
    const country = userProfile?.country || 'Côte d\'Ivoire';
    const currency = userProfile?.currency || 'FCFA';
    const companyName = userProfile?.companyName || 'Votre entreprise';
    
    const prompt = `
    Tu es un expert en analyse financière. Calcule un score de santé pour une entreprise.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }
    - IMPORTANT: Adapte l'analyse au contexte de ${country} et utilise ${currency}

    CONTEXTE DE L'ENTREPRISE:
    - Nom: ${companyName}
    - Pays: ${country}
    - Devise: ${currency}
    - Revenus: ${companyData.revenue} ${currency}
    - Charges: ${companyData.expenses} ${currency}
    - Employés: ${companyData.employees}
    - Secteur: ${companyData.sector}
    
    DONNÉES SECTORIELLES (${country}):
    - Revenus moyens: ${sectorData.averageRevenue} ${currency}
    - Charges moyennes: ${sectorData.averageExpenses} ${currency}
    - Employés moyens: ${sectorData.averageEmployees}
    - Croissance du secteur: ${sectorData.growthRate}%
    - Taille du marché: ${sectorData.marketSize} ${currency}

    Exemple de réponse attendue (adapte au contexte de ${country}):
    {
      "overall": 75,
      "profitability": 80,
      "efficiency": 70,
      "growth": 65,
      "marketPosition": 75,
      "details": {
        "strengths": ["Rentabilité supérieure à la moyenne du secteur en ${country}", "Efficacité opérationnelle"],
        "weaknesses": ["Taille d'équipe limitée", "Potentiel de croissance"],
        "recommendations": ["Investir dans la croissance", "Optimiser les processus"]
      }
    }

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire. Adapte l'analyse au contexte de ${country}.
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

  async generateComparativeAnalysis(companyData: CompanyData, userProfile?: UserProfile): Promise<{ analysis: ComparativeAnalysis; isDemoData: boolean }> {
    try {
      // Récupérer les données sectorielles avec le profil utilisateur
      const sectorData = await this.analyzeSectorData(companyData.sector, userProfile);
      
      // Calculer le score de santé avec le profil utilisateur
      const healthScore = await this.calculateHealthScore(companyData, sectorData, userProfile);
      
      // Générer l'analyse comparative complète
      const country = userProfile?.country || 'Côte d\'Ivoire';
      const currency = userProfile?.currency || 'FCFA';
      const companyName = userProfile?.companyName || 'Votre entreprise';
      const website = userProfile?.website || '';
      const companySize = userProfile?.companySize || '';
      
      const prompt = `
      Tu es un expert en stratégie d'entreprise. Génère une analyse comparative complète.

      INSTRUCTIONS CRITIQUES:
      - Réponds UNIQUEMENT avec du JSON valide
      - PAS de texte avant ou après le JSON
      - PAS de markdown, backticks, ou code blocks
      - PAS d'explications ou de commentaires
      - Commence directement par { et termine par }
      - IMPORTANT: Génère TOUJOURS des données complètes pour les graphiques
      - IMPORTANT: Adapte l'analyse au contexte de ${country} et utilise ${currency}

      CONTEXTE DE L'ENTREPRISE:
      - Nom: ${companyName}
      - Pays: ${country}
      - Devise: ${currency}
      - Site web: ${website || 'Non renseigné'}
      - Taille: ${companySize || 'Non renseignée'}
      - Revenus: ${companyData.revenue} ${currency}
      - Charges: ${companyData.expenses} ${currency}
      - Employés: ${companyData.employees}
      - Secteur: ${companyData.sector}
      
      Score de santé: ${healthScore.overall}/100

      Exemple de réponse attendue (actions CONCRÈTES pour le secteur ${companyData.sector} en ${country}):
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
            {"company": ${companyData.revenue}, "sector": ${sectorData.averageRevenue}, "label": "Revenus"},
            {"company": ${companyData.expenses}, "sector": ${sectorData.averageExpenses}, "label": "Charges"},
            {"company": ${companyData.revenue - companyData.expenses}, "sector": ${sectorData.averageRevenue - sectorData.averageExpenses}, "label": "Bénéfice"},
            {"company": ${Math.round(companyData.revenue / companyData.employees)}, "sector": ${Math.round(sectorData.averageRevenue / sectorData.averageEmployees)}, "label": "CA/Employé"}
          ],
          "profitabilityTrend": [
            {"company": ${Math.round((companyData.revenue - companyData.expenses) / companyData.revenue * 100 * 0.8)}, "sector": ${Math.round(sectorData.keyMetrics.profitability * 0.9)}, "period": "2022"},
            {"company": ${Math.round((companyData.revenue - companyData.expenses) / companyData.revenue * 100 * 0.9)}, "sector": ${Math.round(sectorData.keyMetrics.profitability * 0.95)}, "period": "2023"},
            {"company": ${Math.round((companyData.revenue - companyData.expenses) / companyData.revenue * 100)}, "sector": ${sectorData.keyMetrics.profitability}, "period": "2024"},
            {"company": ${Math.round((companyData.revenue - companyData.expenses) / companyData.revenue * 100 * 1.1)}, "sector": ${Math.round(sectorData.keyMetrics.profitability * 1.05)}, "period": "2025"}
          ],
          "marketPosition": [
            {"metric": "Rentabilité", "company": ${Math.round((companyData.revenue - companyData.expenses) / companyData.revenue * 100)}, "sector": ${sectorData.keyMetrics.profitability}},
            {"metric": "Efficacité", "company": ${Math.round(companyData.revenue / companyData.employees)}, "sector": ${Math.round(sectorData.averageRevenue / sectorData.averageEmployees)}},
            {"metric": "Croissance", "company": ${healthScore.growth}, "sector": ${sectorData.growthRate}},
            {"metric": "Taille", "company": ${companyData.employees}, "sector": ${sectorData.averageEmployees}}
          ]
        }
      }

      RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire. Génère des actions CONCRÈTES et SPÉCIFIQUES au secteur ${companyData.sector} en ${country}.
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

  async generateActionPlan(analysis: ComparativeAnalysis, userProfile?: UserProfile): Promise<{
    objectives: string[];
    actions: { category: string; actions: string[] }[];
    timeline: { phase: string; duration: string; actions: string[] }[];
  }> {
    const country = userProfile?.country || 'Côte d\'Ivoire';
    const currency = userProfile?.currency || 'FCFA';
    const companyName = userProfile?.companyName || 'Votre entreprise';
    const website = userProfile?.website || '';
    const companySize = userProfile?.companySize || '';
    
    const prompt = `
    Tu es un expert en stratégie d'entreprise spécialisé dans le marché africain. Génère un plan d'action détaillé et personnalisé avec des actions CONCRÈTES et SPÉCIFIQUES.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }
    - IMPORTANT: Génère des actions CONCRÈTES et SPÉCIFIQUES, PAS d'actions génériques comme "Action prioritaire 1"
    - Chaque action doit être détaillée et actionable
    - Adapte les actions au score de santé, au secteur spécifique et au contexte de ${country}

    CONTEXTE DE L'ENTREPRISE:
    - Nom: ${companyName}
    - Pays: ${country}
    - Devise: ${currency}
    - Site web: ${website || 'Non renseigné'}
    - Taille: ${companySize || 'Non renseignée'}
    - Secteur: ${analysis.companyData.sector}
    - Revenus: ${analysis.companyData.revenue.toLocaleString()} ${currency}
    - Charges: ${analysis.companyData.expenses.toLocaleString()} ${currency}
    - Employés: ${analysis.companyData.employees}
    - Score de santé: ${analysis.healthScore.overall}/100
    - Position concurrentielle: ${analysis.competitivePosition.position}
    
    DONNÉES SECTORIELLES (${country}):
    - Revenus moyens du secteur: ${analysis.sectorData.averageRevenue.toLocaleString()} ${currency}
    - Croissance du secteur: ${analysis.sectorData.growthRate}%
    - Taille du marché: ${analysis.sectorData.marketSize.toLocaleString()} ${currency}
    
    FORCES ET FAIBLESSES IDENTIFIÉES:
    - Forces: ${analysis.healthScore.details.strengths.join(', ')}
    - Faiblesses: ${analysis.healthScore.details.weaknesses.join(', ')}
    
    RECOMMANDATIONS EXISTANTES:
    - Immédiates: ${analysis.recommendations.immediate.join(', ')}
    - Court terme: ${analysis.recommendations.shortTerm.join(', ')}
    - Long terme: ${analysis.recommendations.longTerm.join(', ')}

    Exemple de réponse attendue (actions CONCRÈTES pour ${companyName} en ${country}):
    {
      "objectives": [
        "Augmenter les revenus de 25% en 12 mois en développant 3 nouveaux marchés dans ${country}",
        "Réduire les coûts opérationnels de 15% en optimisant la chaîne logistique",
        "Améliorer la satisfaction client de 30% en formant l'équipe aux nouvelles technologies"
      ],
      "actions": [
        {
          "category": "Marketing",
          "actions": [
            "Lancer une campagne Facebook Ads ciblée sur les clients potentiels de ${analysis.companyData.sector} en ${country}",
            "Créer un site web responsive avec système de réservation en ligne",
            "Participer au Salon International de ${analysis.companyData.sector} à ${country === 'Côte d\'Ivoire' ? 'Abidjan' : 'la capitale'}"
          ]
        },
        {
          "category": "Opérations", 
          "actions": [
            "Automatiser le processus de facturation avec un logiciel de gestion",
            "Négocier des contrats avec 3 nouveaux fournisseurs locaux en ${country}",
            "Optimiser les horaires de travail pour réduire les coûts énergétiques"
          ]
        },
        {
          "category": "Finance",
          "actions": [
            "Obtenir un prêt bancaire de 50M ${currency} pour l'expansion",
            "Mettre en place un système de suivi budgétaire mensuel",
            "Diversifier les sources de revenus avec des services complémentaires"
          ]
        },
        {
          "category": "Ressources Humaines",
          "actions": [
            "Former 5 employés aux techniques de vente modernes",
            "Recruter un expert en ${analysis.companyData.sector} avec 5 ans d'expérience",
            "Mettre en place un système de bonus basé sur les performances"
          ]
        }
      ],
      "timeline": [
        {
          "phase": "Phase 1 - Actions Immédiates",
          "duration": "1-3 mois",
          "actions": [
            "Audit complet des processus actuels et identification des goulots d'étranglement",
            "Formation de l'équipe aux nouvelles technologies et outils digitaux",
            "Lancement de la campagne marketing digitale avec budget de 2M ${currency}"
          ]
        },
        {
          "phase": "Phase 2 - Développement", 
          "duration": "3-6 mois",
          "actions": [
            "Ouverture de 2 nouveaux points de vente dans les zones à fort potentiel de ${country}",
            "Optimisation des processus de production pour réduire les coûts de 10%",
            "Recrutement et formation de 3 nouveaux employés qualifiés"
          ]
        },
        {
          "phase": "Phase 3 - Expansion",
          "duration": "6-12 mois",
          "actions": [
            "Expansion vers 2 nouvelles régions de ${country} avec partenariats locaux",
            "Lancement de 3 nouveaux produits/services innovants",
            "Partenariat stratégique avec une entreprise leader du secteur en ${country}"
          ]
        }
      ]
    }

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire. Génère des actions CONCRÈTES et SPÉCIFIQUES pour ${companyName} dans le secteur ${analysis.companyData.sector} en ${country}.
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
      : [
          'Augmenter les revenus de 25% en 12 mois en développant de nouveaux marchés',
          'Réduire les coûts opérationnels de 15% en optimisant les processus',
          'Améliorer la satisfaction client de 30% en formant l\'équipe'
        ];

    // Validation des actions par catégorie
    const actions = Array.isArray(data.actions) 
      ? data.actions.map((category: any) => ({
          category: typeof category.category === 'string' ? category.category : 'Catégorie',
          actions: Array.isArray(category.actions) 
            ? category.actions.map((action: any) => typeof action === 'string' ? action : JSON.stringify(action))
            : ['Action 1', 'Action 2', 'Action 3']
        }))
      : [
          { 
            category: 'Marketing', 
            actions: [
              'Lancer une campagne Facebook Ads ciblée sur les clients potentiels',
              'Créer un site web responsive avec système de réservation en ligne',
              'Participer à 3 salons professionnels dans la région'
            ] 
          },
          { 
            category: 'Opérations', 
            actions: [
              'Automatiser le processus de facturation avec un logiciel de gestion',
              'Négocier des contrats avec 3 nouveaux fournisseurs locaux',
              'Optimiser les horaires de travail pour réduire les coûts énergétiques'
            ] 
          },
          { 
            category: 'Finance', 
            actions: [
              'Obtenir un prêt bancaire de 50M FCFA pour l\'expansion',
              'Mettre en place un système de suivi budgétaire mensuel',
              'Diversifier les sources de revenus avec des services complémentaires'
            ] 
          },
          { 
            category: 'Ressources Humaines', 
            actions: [
              'Former 5 employés aux techniques de vente modernes',
              'Recruter un expert sectoriel avec 5 ans d\'expérience',
              'Mettre en place un système de bonus basé sur les performances'
            ] 
          }
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
          { 
            phase: 'Phase 1 - Actions Immédiates', 
            duration: '1-3 mois', 
            actions: [
              'Audit complet des processus actuels et identification des goulots d\'étranglement',
              'Formation de l\'équipe aux nouvelles technologies et outils digitaux',
              'Lancement de la campagne marketing digitale avec budget de 2M FCFA'
            ] 
          },
          { 
            phase: 'Phase 2 - Développement', 
            duration: '3-6 mois', 
            actions: [
              'Ouverture de 2 nouveaux points de vente dans les zones à fort potentiel',
              'Optimisation des processus de production pour réduire les coûts de 10%',
              'Recrutement et formation de 3 nouveaux employés qualifiés'
            ] 
          },
          { 
            phase: 'Phase 3 - Expansion', 
            duration: '6-12 mois', 
            actions: [
              'Expansion vers 2 nouvelles régions avec partenariats locaux',
              'Lancement de 3 nouveaux produits/services innovants',
              'Partenariat stratégique avec une entreprise leader du secteur'
            ] 
          }
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

    // Validation et transformation des graphiques avec données de fallback complètes
    const charts = {
      revenueComparison: Array.isArray(data.charts?.revenueComparison) && data.charts.revenueComparison.length > 0
        ? data.charts.revenueComparison.map((item: any) => ({
            company: typeof item.company === 'number' ? item.company : 0,
            sector: typeof item.sector === 'number' ? item.sector : 0,
            label: typeof item.label === 'string' ? item.label : 'Revenus'
          }))
        : [
            {"company": 5000000, "sector": 8000000, "label": "Revenus"},
            {"company": 3500000, "sector": 6000000, "label": "Charges"},
            {"company": 1500000, "sector": 2000000, "label": "Bénéfice"},
            {"company": 250000, "sector": 320000, "label": "CA/Employé"}
          ],
      profitabilityTrend: Array.isArray(data.charts?.profitabilityTrend) && data.charts.profitabilityTrend.length > 0
        ? data.charts.profitabilityTrend.map((item: any) => ({
            company: typeof item.company === 'number' ? item.company : 0,
            sector: typeof item.sector === 'number' ? item.sector : 0,
            period: typeof item.period === 'string' ? item.period : 'Actuel'
          }))
        : [
            {"company": 18, "sector": 15, "period": "2022"},
            {"company": 20, "sector": 16, "period": "2023"},
            {"company": 22, "sector": 17, "period": "2024"},
            {"company": 25, "sector": 18, "period": "2025"}
          ],
      marketPosition: Array.isArray(data.charts?.marketPosition) && data.charts.marketPosition.length > 0
        ? data.charts.marketPosition.map((item: any) => ({
            metric: typeof item.metric === 'string' ? item.metric : 'Métrique',
            company: typeof item.company === 'number' ? item.company : 0,
            sector: typeof item.sector === 'number' ? item.sector : 0
          }))
        : [
            {"metric": "Rentabilité", "company": 22, "sector": 17},
            {"metric": "Efficacité", "company": 250000, "sector": 320000},
            {"metric": "Croissance", "company": 15, "sector": 12},
            {"metric": "Taille", "company": 20, "sector": 25}
          ]
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

export const getFallbackAnalysis = (companyData: CompanyData, sectorData: SectorData, healthScore: HealthScore) => {
  // Calculer la rentabilité de l'entreprise
  const companyProfitability = ((companyData.revenue - companyData.expenses) / companyData.revenue) * 100;
  const companyEfficiency = companyData.revenue / companyData.employees;
  const sectorEfficiency = sectorData.averageRevenue / sectorData.averageEmployees;
  
  return {
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
        {"company": companyData.revenue, "sector": sectorData.averageRevenue, "label": "Revenus"},
        {"company": companyData.expenses, "sector": sectorData.averageExpenses, "label": "Charges"},
        {"company": companyData.revenue - companyData.expenses, "sector": sectorData.averageRevenue - sectorData.averageExpenses, "label": "Bénéfice"},
        {"company": companyData.revenue / companyData.employees, "sector": sectorData.averageRevenue / sectorData.averageEmployees, "label": "CA/Employé"}
      ],
      profitabilityTrend: [
        {"company": companyProfitability * 0.8, "sector": sectorData.keyMetrics.profitability * 0.9, "period": "2022"},
        {"company": companyProfitability * 0.9, "sector": sectorData.keyMetrics.profitability * 0.95, "period": "2023"},
        {"company": companyProfitability, "sector": sectorData.keyMetrics.profitability, "period": "2024"},
        {"company": companyProfitability * 1.1, "sector": sectorData.keyMetrics.profitability * 1.05, "period": "2025"}
      ],
      marketPosition: [
        {"metric": "Rentabilité", "company": companyProfitability, "sector": sectorData.keyMetrics.profitability},
        {"metric": "Efficacité", "company": companyEfficiency, "sector": sectorEfficiency},
        {"metric": "Croissance", "company": healthScore.growth, "sector": sectorData.growthRate},
        {"metric": "Taille", "company": companyData.employees, "sector": sectorData.averageEmployees}
      ]
    }
  };
};

export default GeminiService;
export type { SectorData, CompanyData, HealthScore, ComparativeAnalysis }; 