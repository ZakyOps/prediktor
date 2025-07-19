import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart3, ArrowLeft, RefreshCw, AlertCircle, Info } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  Bar
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useInsights } from "@/hooks/use-insights";
import { Skeleton } from "@/components/ui/skeleton";
import NoAnalysisMessage from "./NoAnalysisMessage";

interface InsightsProps {
  onBack?: () => void;
}

const Insights = ({ onBack }: InsightsProps) => {
  const { insights, loading, error, refreshInsights } = useInsights();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Insights IA</h1>
              <p className="text-muted-foreground">
                Analyse avancée et recommandations générées par l'IA
                {insights && (
                  <span className="ml-2">
                    • {insights.metadata.companyName} ({insights.metadata.sector})
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {insights?.metadata.isDemoData && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                Données de démo
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={refreshInsights} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {/* Gestion des états de chargement et d'erreur */}
        {loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 w-28" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-16 w-28" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-48 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="flex flex-col items-center justify-center py-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-24 w-24 rounded-full mb-4" />
                  <Skeleton className="h-4 w-48" />
                </Card>
              ))}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="link" 
                className="p-0 h-auto ml-2" 
                onClick={refreshInsights}
              >
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!loading && !error && !insights && (
          <NoAnalysisMessage onStartAnalysis={onBack} />
        )}

        {!loading && !error && insights && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Croissance prévisionnelle (ligne) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Croissance prévisionnelle (24 mois)</CardTitle>
                  {/* Metrics associées */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="bg-primary/10 rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Actuel</span>
                      <span className="text-lg font-bold text-primary">{insights.growthData.current}%</span>
                    </div>
                    <div className="bg-success/10 rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">+12 mois</span>
                      <span className="text-lg font-bold text-success">+{insights.growthData.projected12Months}%</span>
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Min/Max</span>
                      <span className="text-lg font-bold text-foreground">{insights.growthData.minGrowth}% / {insights.growthData.maxGrowth}%</span>
                    </div>
                    <div className="bg-accent/10 rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Évolution 12 mois</span>
                      <span className="text-lg font-bold text-accent">+{insights.growthData.evolution12Months} pts</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={insights.growthData.monthlyProjections}>
                      <XAxis dataKey="month" hide />
                      <YAxis domain={[0, Math.max(35, insights.growthData.maxGrowth + 5)]} tickFormatter={v => `${v}%`} />
                      <RechartsTooltip />
                      <RechartsLegend />
                      <Line type="monotone" dataKey="growth" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Benchmark sectoriel (barres comparatives) */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-foreground">Benchmark sectoriel</CardTitle>
                  {/* Metrics associées */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    <div className="bg-primary/10 rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Votre PME</span>
                      <span className="text-lg font-bold text-primary">{insights.benchmarkData.companyGrowth}%</span>
                    </div>
                    <div className="bg-success/10 rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Secteur</span>
                      <span className="text-lg font-bold text-success">{insights.benchmarkData.sectorGrowth}%</span>
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Écart</span>
                      <span className="text-lg font-bold text-foreground">+{insights.benchmarkData.gap} pts</span>
                    </div>
                    <div className="bg-accent/10 rounded-lg px-4 py-2 flex flex-col items-center min-w-[110px]">
                      <span className="text-xs text-muted-foreground">Risque</span>
                      <span className="text-lg font-bold text-accent">{insights.benchmarkData.riskLevel}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={insights.benchmarkData.indicators}>
                      <XAxis dataKey="indicator" />
                      <YAxis />
                      <RechartsTooltip />
                      <RechartsLegend />
                      <Bar dataKey="company" fill="#2563eb" />
                      <Bar dataKey="sector" fill="#059669" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Indicateurs IA avancés */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Score de risque IA */}
              <Card className="flex flex-col items-center justify-center py-6">
                <CardTitle className="text-center text-foreground mb-2">Score de risque IA</CardTitle>
                <div className="relative flex items-center justify-center h-24 w-24">
                  <svg width="96" height="96">
                    <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke={insights.aiScores.riskScore.value === 'Bas' ? '#059669' : insights.aiScores.riskScore.value === 'Modéré' ? '#f59e0b' : '#dc2626'} 
                      strokeWidth="12" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (insights.aiScores.riskScore.percentage * 251.2 / 100)} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-success">
                    {insights.aiScores.riskScore.value}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{insights.aiScores.riskScore.description}</p>
              </Card>

              {/* Probabilité d'atteinte des objectifs */}
              <Card className="flex flex-col items-center justify-center py-6">
                <CardTitle className="text-center text-foreground mb-2">Probabilité d'atteinte</CardTitle>
                <div className="relative flex items-center justify-center h-24 w-24">
                  <svg width="96" height="96">
                    <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke="#2563eb" 
                      strokeWidth="12" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (insights.aiScores.objectiveProbability.value * 251.2 / 100)} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-primary">
                    {insights.aiScores.objectiveProbability.value}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{insights.aiScores.objectiveProbability.description}</p>
              </Card>

              {/* Recommandation IA */}
              <Card className="flex flex-col items-center justify-center py-6">
                <CardTitle className="text-center text-foreground mb-2">Recommandation IA</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <span className="text-lg font-semibold text-foreground">{insights.aiScores.recommendation.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{insights.aiScores.recommendation.impact}</p>
              </Card>

              {/* Opportunité détectée */}
              <Card className="flex flex-col items-center justify-center py-6">
                <CardTitle className="text-center text-foreground mb-2">Opportunité IA</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-6 w-6 text-success" />
                  <span className="text-lg font-semibold text-success">{insights.aiScores.opportunity.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{insights.aiScores.opportunity.potential}</p>
              </Card>
            </div>

            {/* Informations sur la dernière analyse */}
            <Card className="mt-8">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Dernière analyse : {new Date(insights.metadata.lastAnalysisDate).toLocaleDateString('fr-FR')}</span>
                  <span>Entreprise : {insights.metadata.companyName} • Secteur : {insights.metadata.sector}</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Insights; 