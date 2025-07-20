import GeminiService from './gemini';
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";

export interface BusinessPlanData {
  companyName: string;
  industry: string;
  description: string;
  marketSize: string;
  targetMarket: string;
  competitiveAdvantage: string;
  revenueModel: string;
  fundingRequired: string;
  teamSize: string;
  timeline: string;
  sections: {
    executiveSummary: boolean;
    companyDescription: boolean;
    marketAnalysis: boolean;
    organization: boolean;
    productsServices: boolean;
    marketingSales: boolean;
    financialProjections: boolean;
    funding: boolean;
    appendices: boolean;
  };
}

export interface BusinessPlanSection {
  title: string;
  content: string;
  subsections?: { title: string; content: string }[];
}

export interface GeneratedBusinessPlan {
  executiveSummary: BusinessPlanSection;
  companyDescription: BusinessPlanSection;
  marketAnalysis: BusinessPlanSection;
  organization: BusinessPlanSection;
  productsServices: BusinessPlanSection;
  marketingSales: BusinessPlanSection;
  financialProjections: BusinessPlanSection;
  funding: BusinessPlanSection;
  appendices?: BusinessPlanSection;
  metadata: {
    generatedAt: string;
    companyName: string;
    industry: string;
    totalPages: number;
  };
}

class BusinessPlanService extends GeminiService {
  async generateBusinessPlan(data: BusinessPlanData): Promise<GeneratedBusinessPlan> {
    const selectedSections = Object.entries(data.sections)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key);

    const prompt = `
    Tu es un expert en création de business plans spécialisé dans le marché africain. Génère un business plan complet et professionnel.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - PAS d'explications ou de commentaires
    - Commence directement par { et termine par }
    - Toutes les valeurs doivent être des chaînes de caractères simples
    - Structure le contenu de manière professionnelle et engageante

    INFORMATIONS DE L'ENTREPRISE:
    - Nom: ${data.companyName}
    - Secteur: ${data.industry}
    - Description: ${data.description}
    - Taille du marché: ${data.marketSize} FCFA
    - Marché cible: ${data.targetMarket}
    - Avantage concurrentiel: ${data.competitiveAdvantage}
    - Modèle de revenus: ${data.revenueModel}
    - Financement requis: ${data.fundingRequired} FCFA
    - Taille équipe: ${data.teamSize}
    - Horizon temporel: ${data.timeline}

    SECTIONS À GÉNÉRER: ${selectedSections.join(', ')}

    Exemple de réponse attendue (adapte au contexte africain):
    {
      "executiveSummary": {
        "title": "Résumé Exécutif",
        "content": "Contenu du résumé exécutif...",
        "subsections": [
          {
            "title": "Synthèse de l'opportunité",
            "content": "Description de l'opportunité..."
          }
        ]
      },
      "companyDescription": {
        "title": "Description de l'Entreprise",
        "content": "Description détaillée...",
        "subsections": [
          {
            "title": "Mission et Vision",
            "content": "Mission et vision de l'entreprise..."
          }
        ]
      },
      "marketAnalysis": {
        "title": "Analyse de Marché",
        "content": "Analyse complète du marché...",
        "subsections": [
          {
            "title": "Taille et Croissance du Marché",
            "content": "Données sur la taille du marché..."
          }
        ]
      },
      "organization": {
        "title": "Organisation et Management",
        "content": "Structure organisationnelle...",
        "subsections": [
          {
            "title": "Équipe de Direction",
            "content": "Présentation de l'équipe..."
          }
        ]
      },
      "productsServices": {
        "title": "Produits et Services",
        "content": "Description des produits/services...",
        "subsections": [
          {
            "title": "Portefeuille de Produits",
            "content": "Détail des produits..."
          }
        ]
      },
      "marketingSales": {
        "title": "Marketing et Ventes",
        "content": "Stratégie marketing...",
        "subsections": [
          {
            "title": "Stratégie Marketing",
            "content": "Approche marketing..."
          }
        ]
      },
      "financialProjections": {
        "title": "Projections Financières",
        "content": "Projections financières...",
        "subsections": [
          {
            "title": "Revenus Projetés",
            "content": "Projections de revenus..."
          }
        ]
      },
      "funding": {
        "title": "Financement Requis",
        "content": "Besoins en financement...",
        "subsections": [
          {
            "title": "Utilisation des Fonds",
            "content": "Détail de l'utilisation..."
          }
        ]
      },
      "metadata": {
        "generatedAt": "${new Date().toISOString()}",
        "companyName": "${data.companyName}",
        "industry": "${data.industry}",
        "totalPages": 25
      }
    }

    RÈGLES IMPORTANTES:
    - Adapte le contenu au contexte africain et ouest-africain
    - Utilise des montants en FCFA
    - Inclus des données réalistes pour le marché local
    - Rends le contenu inspirant et engageant
    - Structure chaque section avec des sous-sections pertinentes
    - Inclus des métriques et KPIs mesurables
    - Propose des stratégies adaptées au marché africain

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
    `;

    const response = await this.callGeminiAPI(prompt);
    let businessPlanData;
    try {
      businessPlanData = JSON.parse(response);
    } catch (error) {
      console.error('JSON Parse Error in generateBusinessPlan:');
      console.error('Raw response:', response);
      console.error('Error:', error);
      throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
    }

    return this.validateAndTransformBusinessPlan(businessPlanData, data);
  }

  private validateAndTransformBusinessPlan(data: any, originalData: BusinessPlanData): GeneratedBusinessPlan {
    const validateSection = (sectionData: any, defaultTitle: string): BusinessPlanSection => {
      return {
        title: typeof sectionData?.title === 'string' ? sectionData.title : defaultTitle,
        content: typeof sectionData?.content === 'string' ? sectionData.content : 'Contenu en cours de génération...',
        subsections: Array.isArray(sectionData?.subsections)
          ? sectionData.subsections.map((sub: any) => ({
              title: typeof sub?.title === 'string' ? sub.title : 'Sous-section',
              content: typeof sub?.content === 'string' ? sub.content : 'Contenu en cours de génération...'
            }))
          : []
      };
    };

    return {
      executiveSummary: validateSection(data.executiveSummary, 'Résumé Exécutif'),
      companyDescription: validateSection(data.companyDescription, 'Description de l\'Entreprise'),
      marketAnalysis: validateSection(data.marketAnalysis, 'Analyse de Marché'),
      organization: validateSection(data.organization, 'Organisation et Management'),
      productsServices: validateSection(data.productsServices, 'Produits et Services'),
      marketingSales: validateSection(data.marketingSales, 'Marketing et Ventes'),
      financialProjections: validateSection(data.financialProjections, 'Projections Financières'),
      funding: validateSection(data.funding, 'Financement Requis'),
      appendices: data.appendices ? validateSection(data.appendices, 'Annexes') : undefined,
      metadata: {
        generatedAt: typeof data.metadata?.generatedAt === 'string' ? data.metadata.generatedAt : new Date().toISOString(),
        companyName: typeof data.metadata?.companyName === 'string' ? data.metadata.companyName : originalData.companyName,
        industry: typeof data.metadata?.industry === 'string' ? data.metadata.industry : originalData.industry,
        totalPages: typeof data.metadata?.totalPages === 'number' ? data.metadata.totalPages : 25
      }
    };
  }

  async generatePDFContent(businessPlan: GeneratedBusinessPlan): Promise<void> {
    const { PDFExportService } = await import('./pdf-export');
    const pdfService = new PDFExportService();
    await pdfService.exportBusinessPlanToPDF(businessPlan);
  }

  async generateWordContent(businessPlan: GeneratedBusinessPlan): Promise<string> {
    const prompt = `
    Tu es un expert en formatage de documents Word. Convertis ce business plan en format Word structuré.

    INSTRUCTIONS CRITIQUES:
    - Réponds UNIQUEMENT avec du JSON valide
    - PAS de texte avant ou après le JSON
    - PAS de markdown, backticks, ou code blocks
    - Structure le contenu pour un document Word professionnel

    BUSINESS PLAN:
    ${JSON.stringify(businessPlan, null, 2)}

    Format JSON requis:
    {
      "title": "Titre du document",
      "sections": [
        {
          "title": "Titre de section",
          "content": "Contenu formaté pour Word",
          "level": 1,
          "style": "Heading1"
        }
      ],
      "metadata": {
        "pageCount": 25,
        "tableOfContents": true
      }
    }

    RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
    `;

    const response = await this.callGeminiAPI(prompt);
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error('JSON Parse Error in generateWordContent:', error);
      throw new Error(`Invalid JSON response from Gemini API: ${error.message}`);
    }
  }
}

export default BusinessPlanService;

export async function saveBusinessPlanToFirestore(userId: string, plan: any) {
  await addDoc(collection(db, "businessPlans"), {
    userId,
    createdAt: new Date().toISOString(),
    ...plan
  });
}

export async function getUserBusinessPlans(userId: string) {
  const q = query(
    collection(db, "businessPlans"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} 