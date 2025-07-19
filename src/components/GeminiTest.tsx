import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import GeminiService from "@/services/gemini";

const GeminiTest = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const testSimplePrompt = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const geminiService = new GeminiService();
      
      // Test avec un prompt simple
      const response = await geminiService['callGeminiAPI'](`
        Tu es un assistant. Réponds UNIQUEMENT avec du JSON valide.
        
        Format requis:
        {
          "message": "Test réussi",
          "timestamp": "${new Date().toISOString()}"
        }
        
        RÈPONSE REQUISE: JSON uniquement, sans formatage supplémentaire.
      `);
      
      setResult(response);
      toast({
        title: "Test réussi",
        description: "L'API Gemini fonctionne correctement.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Test error:', error);
      setResult(`Erreur: ${error.message}`);
      toast({
        title: "Test échoué",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const testSectorData = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const geminiService = new GeminiService();
      const sectorData = await geminiService.analyzeSectorData("Technologie");
      
      setResult(JSON.stringify(sectorData, null, 2));
      toast({
        title: "Analyse sectorielle réussie",
        description: "Les données sectorielles ont été générées.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Sector data error:', error);
      setResult(`Erreur: ${error.message}`);
      toast({
        title: "Analyse sectorielle échouée",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Test de l'API Gemini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testSimplePrompt} 
              disabled={loading}
              variant="outline"
            >
              Test Simple
            </Button>
            <Button 
              onClick={testSectorData} 
              disabled={loading}
            >
              Test Analyse Sectorielle
            </Button>
          </div>
          
          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Test en cours...</p>
            </div>
          )}
          
          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Résultat :</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                {result}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeminiTest; 