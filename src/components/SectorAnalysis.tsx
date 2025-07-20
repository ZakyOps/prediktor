import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BarChart3, 
  Lightbulb,
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Eye
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useToast } from "@/hooks/use-toast";
import GeminiService, { ComparativeAnalysis, CompanyData } from "@/services/gemini";
import ActionPlan from "./ActionPlan";
import ApiErrorHandler from "./ApiErrorHandler";
import DemoDataIndicator from "./DemoDataIndicator";
import DebugData from "./DebugData";
import { useAuth } from "@/contexts/AuthContext";
import { saveAnalysisToFirestore } from "@/services/analysis-storage";
import { useUserProfile } from "@/hooks/use-user-profile";

interface SectorAnalysisProps {
  companyData: CompanyData;
  onBack?: () => void;
}

const COLORS = ['#2563eb', '#059669', '#dc2626', '#ea580c', '#7c3aed'];

const SectorAnalysis = ({ companyData, onBack }: SectorAnalysisProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile: userProfile } = useUserProfile();
  const [analysis, setAnalysis] = useState<ComparativeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [isDemoData, setIsDemoData] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    generateAnalysis();
  }, [companyData]);

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const geminiService = new GeminiService();
      const result = await geminiService.generateComparativeAnalysis(companyData, userProfile);
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
        description: userProfile?.isProfileComplete 
          ? "L'analyse sectorielle a été générée avec succès en tenant compte de vos informations d'entreprise."
          : "L'analyse sectorielle a été générée. Complétez votre profil pour des analyses plus précises.",
        duration: 3000,
      });
    } catch (err) {
      console.error('Error generating analysis:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de la génération de l\'analyse. Veuillez réessayer.');
      setError(error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'analyse sectorielle.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'leader': return 'bg-green-100 text-green-800';
      case 'strong': return 'bg-blue-100 text-blue-800';
      case 'average': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-orange-100 text-orange-800';
      case 'struggling': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <h1 className="text-2xl font-bold text-foreground">Analyse Sectorielle</h1>
                <p className="text-muted-foreground">Génération de l'analyse en cours...</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Analyse en cours...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <ApiErrorHandler 
        error={error} 
        onRetry={generateAnalysis} 
        onBack={onBack}
      />
    );
  }

  // Si le plan d'action est demandé, afficher le composant ActionPlan
  if (showActionPlan && analysis) {
    return (
      <ActionPlan 
        analysis={analysis} 
        onBack={() => setShowActionPlan(false)} 
      />
    );
  }

  if (!analysis) return null;

  // Vérification de sécurité pour éviter les erreurs React
  if (!analysis.competitivePosition || !analysis.healthScore || !analysis.sectorData) {
    console.error('Analysis data is incomplete:', analysis);
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
                <h1 className="text-2xl font-bold text-foreground">Analyse Sectorielle</h1>
                <p className="text-muted-foreground">Erreur dans les données d'analyse</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="border-card-border">
            <CardContent className="p-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Données d'analyse incomplètes</h3>
                <p className="text-muted-foreground mb-4">
                  Les données d'analyse ne sont pas complètes. Veuillez réessayer.
                </p>
                <Button onClick={generateAnalysis}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réessayer
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
                <h1 className="text-2xl font-bold text-foreground">Analyse Sectorielle</h1>
                <p className="text-muted-foreground">
                  {companyData.sector} - {companyData.year}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowActionPlan(true)}
              >
                <Target className="h-4 w-4 mr-2" />
                Plan d'Action
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDebug(!showDebug)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Debug
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Indicateur de données de démonstration */}
        {isDemoData && (
          <DemoDataIndicator className="mb-6" />
        )}
        
        {/* Score de santé et position */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Score de Santé Global
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getHealthScoreColor(analysis.healthScore.overall)}`}>
                  {analysis.healthScore.overall}/100
                </div>
                <Progress value={analysis.healthScore.overall} className="mb-4" />
                <p className="text-sm text-muted-foreground">
                  {analysis.healthScore.overall >= 80 ? 'Excellent' : 
                   analysis.healthScore.overall >= 60 ? 'Bon' : 
                   analysis.healthScore.overall >= 40 ? 'Moyen' : 'À améliorer'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-success" />
                Position Concurrentielle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge className={`mb-2 ${getPositionColor(analysis.competitivePosition.position)}`}>
                  {analysis.competitivePosition.position.toUpperCase()}
                </Badge>
                <div className="text-2xl font-bold mb-2">
                  {analysis.competitivePosition.score}/100
                </div>
                <p className="text-sm text-muted-foreground">
                  {analysis.competitivePosition.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Croissance Secteur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2 text-accent">
                  {analysis.sectorData.growthRate}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Taux de croissance moyen du secteur
                </p>
                <div className="mt-2">
                  <Badge variant="outline">
                    Marché: {analysis.sectorData.marketSize.toLocaleString()} FCFA
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Data */}
        {showDebug && (
          <div className="mb-6">
            <DebugData data={analysis} title="Données d'Analyse Complètes" />
          </div>
        )}

        {/* Analyse détaillée */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="comparison">Comparaisons</TabsTrigger>
            <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
            <TabsTrigger value="charts">Graphiques</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Forces et faiblesses */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Forces
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.healthScore.details.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Faiblesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.healthScore.details.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Tendances du secteur */}
            <Card className="border-card-border mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Tendances du Secteur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Tendances</h4>
                    <ul className="space-y-1">
                      {analysis.sectorData.trends.map((trend, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-success" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Défis</h4>
                    <ul className="space-y-1">
                      {analysis.sectorData.challenges.map((challenge, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-destructive" />
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Opportunités</h4>
                    <ul className="space-y-1">
                      {analysis.sectorData.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Lightbulb className="h-3 w-3 text-accent" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Comparaison des métriques */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Comparaison des Métriques</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analysis.charts.marketPosition}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="company" fill="#2563eb" name="Votre entreprise" />
                      <Bar dataKey="sector" fill="#059669" name="Secteur" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Comparaison des Revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analysis.charts.revenueComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="company" fill="#2563eb" name="Votre entreprise" />
                      <Bar dataKey="sector" fill="#059669" name="Secteur" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <div className="space-y-6">
              {/* Actions immédiates */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Actions Immédiates (1-3 mois)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.immediate.map((action, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-destructive text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions court terme */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Actions Court Terme (3-6 mois)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.shortTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Actions long terme */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Actions Long Terme (6-12 mois)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.longTerm.map((action, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score de santé détaillé */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Score de Santé Détaillé</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Rentabilité', value: analysis.healthScore.profitability },
                          { name: 'Efficacité', value: analysis.healthScore.efficiency },
                          { name: 'Croissance', value: analysis.healthScore.growth },
                          { name: 'Position Marché', value: analysis.healthScore.marketPosition }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tendances de rentabilité */}
              <Card className="border-card-border">
                <CardHeader>
                  <CardTitle>Tendances de Rentabilité</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analysis.charts.profitabilityTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="company" stroke="#2563eb" strokeWidth={2} name="Votre entreprise" />
                      <Line type="monotone" dataKey="sector" stroke="#059669" strokeWidth={2} name="Secteur" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SectorAnalysis; 