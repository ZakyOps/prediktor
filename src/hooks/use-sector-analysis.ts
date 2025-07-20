import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import GeminiService, { CompanyData, ComparativeAnalysis } from '@/services/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { saveAnalysisToFirestore } from '@/services/analysis-storage';

export const useSectorAnalysis = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ComparativeAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDemoData, setIsDemoData] = useState(false);

  const generateAnalysis = useCallback(async (companyData: CompanyData) => {
    try {
      setLoading(true);
      setError(null);
      
      const geminiService = new GeminiService();
      const result = await geminiService.generateComparativeAnalysis(companyData);
      
      setAnalysis(result.analysis);
      setIsDemoData(result.isDemoData);
      
      // Sauvegarder l'analyse dans Firestore liée à l'utilisateur
      if (user && !result.isDemoData) {
        try {
          await saveAnalysisToFirestore(user.uid, result.analysis);
          console.log('Analyse sauvegardée dans Firestore');
        } catch (err) {
          console.error('Erreur lors de la sauvegarde Firestore:', err);
        }
      }
      
      toast({
        title: "Analyse générée",
        description: "L'analyse sectorielle a été générée avec succès.",
        duration: 3000,
      });
      
      return result;
    } catch (err) {
      console.error('Error generating analysis:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération de l\'analyse';
      setError(errorMessage);
      
      toast({
        title: "Erreur",
        description: "Impossible de générer l'analyse sectorielle.",
        variant: "destructive",
        duration: 5000,
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast, user]);

  const generateActionPlan = useCallback(async (analysis: ComparativeAnalysis) => {
    try {
      setLoading(true);
      
      const geminiService = new GeminiService();
      const actionPlan = await geminiService.generateActionPlan(analysis);
      
      toast({
        title: "Plan d'action généré",
        description: "Le plan d'action a été créé avec succès.",
        duration: 3000,
      });
      
      // TODO: Sauvegarder le plan d'action dans Firestore si besoin
      
      return actionPlan;
    } catch (err) {
      console.error('Error generating action plan:', err);
      
      toast({
        title: "Erreur",
        description: "Impossible de générer le plan d'action.",
        variant: "destructive",
        duration: 5000,
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
    setIsDemoData(false);
  }, []);

  return {
    loading,
    analysis,
    error,
    isDemoData,
    generateAnalysis,
    generateActionPlan,
    resetAnalysis
  };
}; 