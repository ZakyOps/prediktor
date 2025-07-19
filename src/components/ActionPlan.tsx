import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowLeft,
  Download,
  Share2,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComparativeAnalysis } from "@/services/gemini";
import GeminiService from "@/services/gemini";

interface ActionPlanProps {
  analysis: ComparativeAnalysis;
  onBack?: () => void;
}

interface ActionPlanData {
  objectives: string[];
  actions: { category: string; actions: string[] }[];
  timeline: { phase: string; duration: string; actions: string[] }[];
}

const ActionPlan = ({ analysis, onBack }: ActionPlanProps) => {
  const { toast } = useToast();
  const [actionPlan, setActionPlan] = useState<ActionPlanData | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const generateActionPlan = async () => {
    try {
      setLoading(true);
      
      const geminiService = new GeminiService();
      const actionPlanData = await geminiService.generateActionPlan(analysis);
      
      setActionPlan(actionPlanData);
      
      toast({
        title: "Plan d'action généré",
        description: "Votre plan d'action personnalisé a été créé avec succès par l'IA.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error generating action plan:', error);
      
      toast({
        title: "Erreur",
        description: "Impossible de générer le plan d'action. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAction = (action: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(action)) {
      newCompleted.delete(action);
    } else {
      newCompleted.add(action);
    }
    setCompletedActions(newCompleted);
  };

  const getProgressPercentage = (actions: string[]) => {
    if (actions.length === 0) return 0;
    const completed = actions.filter(action => completedActions.has(action)).length;
    return (completed / actions.length) * 100;
  };

  if (!actionPlan && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Plan d'Action</h1>
                <p className="text-muted-foreground">Générer un plan d'action personnalisé</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="border-card-border max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Générer le Plan d'Action
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Plan d'Action Personnalisé</h3>
                <div className="space-y-4 mb-6">
                  <p className="text-muted-foreground">
                    Basé sur votre analyse sectorielle, nous allons générer un plan d'action 
                    détaillé pour améliorer votre positionnement concurrentiel.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Informations de l'analyse :</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Score de santé :</span>
                        <span className="font-medium ml-2">{analysis.healthScore.overall}/100</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Position :</span>
                        <span className="font-medium ml-2 capitalize">{analysis.competitivePosition.position}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Secteur :</span>
                        <span className="font-medium ml-2">{analysis.companyData.sector}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenus :</span>
                        <span className="font-medium ml-2">{analysis.companyData.revenue.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button onClick={generateActionPlan} size="lg">
                  <Play className="h-4 w-4 mr-2" />
                  Générer le Plan d'Action
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Plan d'Action</h1>
                <p className="text-muted-foreground">Génération en cours...</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RotateCcw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Génération du plan d'action...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!actionPlan) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Plan d'Action</h1>
                <p className="text-muted-foreground">
                  Basé sur votre score de santé: {analysis.healthScore.overall}/100
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Objectifs */}
        <Card className="border-card-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Objectifs Stratégiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {actionPlan.objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline d'Exécution
          </h2>
          
          {actionPlan.timeline.map((phase, index) => (
            <Card key={index} className="border-card-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    {phase.phase}
                  </CardTitle>
                  <Badge variant="outline">{phase.duration}</Badge>
                </div>
                <Progress value={getProgressPercentage(phase.actions)} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phase.actions.map((action, actionIndex) => (
                    <div 
                      key={actionIndex} 
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        completedActions.has(action) 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => toggleAction(action)}
                    >
                      {completedActions.has(action) ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${completedActions.has(action) ? 'line-through text-muted-foreground' : ''}`}>
                        {action}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions par catégorie */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actions par Catégorie
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actionPlan.actions.map((category, index) => (
              <Card key={index} className="border-card-border">
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                  <Progress value={getProgressPercentage(category.actions)} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.actions.map((action, actionIndex) => (
                      <div 
                        key={actionIndex}
                        className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors ${
                          completedActions.has(action) 
                            ? 'bg-green-50' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => toggleAction(action)}
                      >
                        {completedActions.has(action) ? (
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded border border-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${completedActions.has(action) ? 'line-through text-muted-foreground' : ''}`}>
                          {action}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActionPlan; 