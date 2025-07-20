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
import { useUserHistory } from "@/hooks/use-user-history";

interface InsightsProps {
  onBack?: () => void;
}

const Insights = ({ onBack }: InsightsProps) => {
  const { insights, loading, error, refreshInsights } = useInsights();
  const { lastAnalysis, lastPrediction, loading: loadingHistory } = useUserHistory();
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
              <h1 className="text-2xl font-bold text-foreground">Insights Prediktor</h1>
              <p className="text-muted-foreground">
                Analyse avancée et recommandations générées par Prediktor
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
        {/* Affichage de la dernière analyse */}
        {!loadingHistory && lastAnalysis && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Dernière Analyse Sectorielle</CardTitle>
              <div className="text-sm text-muted-foreground">
                {lastAnalysis.companyData?.sector || "Secteur inconnu"} —{" "}
                {lastAnalysis.createdAt ? new Date(lastAnalysis.createdAt).toLocaleString() : ""}
              </div>
            </CardHeader>
            <CardContent>
              {/* Exemple de graphique */}
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={lastAnalysis.charts?.profitabilityTrend || []}>
                  <XAxis dataKey="period" />
                  <YAxis />
                  <RechartsTooltip />
                  <RechartsLegend />
                  <Line type="monotone" dataKey="company" stroke="#2563eb" name="Votre PME" />
                  <Line type="monotone" dataKey="sector" stroke="#059669" name="Secteur" />
                </LineChart>
              </ResponsiveContainer>
              {/* Recommandations */}
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Recommandations</h4>
                <ul className="list-disc ml-6 text-sm">
                  {(lastAnalysis.recommendations?.immediate || []).map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Affichage de la dernière prédiction */}
        {!loadingHistory && lastPrediction && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Dernière Prédiction</CardTitle>
              <div className="text-sm text-muted-foreground">
                {lastPrediction.sector || "Secteur inconnu"} —{" "}
                {lastPrediction.createdAt ? new Date(lastPrediction.createdAt).toLocaleString() : ""}
              </div>
            </CardHeader>
            <CardContent>
              {/* Graphique des données financières */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {lastPrediction.revenue?.toLocaleString('fr-FR')} XOF
                  </div>
                  <div className="text-sm text-muted-foreground">Chiffre d'affaires</div>
                </div>
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {lastPrediction.expenses?.toLocaleString('fr-FR')} XOF
                  </div>
                  <div className="text-sm text-muted-foreground">Dépenses</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-accent">
                    {lastPrediction.employees || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Employés</div>
                </div>
              </div>
              
              {/* Graphique en barres des données */}
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={[
                  {
                    name: 'Chiffre d\'affaires',
                    value: lastPrediction.revenue || 0,
                    color: '#2563eb'
                  },
                  {
                    name: 'Dépenses',
                    value: lastPrediction.expenses || 0,
                    color: '#dc2626'
                  }
                ]}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => `${value?.toLocaleString('fr-FR')} XOF`} />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
              
              {/* Informations supplémentaires */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Détails</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Secteur:</span> {lastPrediction.sector}</div>
                    <div><span className="font-medium">Marché:</span> {lastPrediction.market}</div>
                    <div><span className="font-medium">Année:</span> {lastPrediction.year}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Calculs</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Marge brute:</span> {((lastPrediction.revenue - lastPrediction.expenses) / lastPrediction.revenue * 100).toFixed(1)}%</div>
                    <div><span className="font-medium">CA/employé:</span> {((lastPrediction.revenue || 0) / (lastPrediction.employees || 1)).toLocaleString('fr-FR')} XOF</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                <CardTitle className="text-center text-foreground mb-2">Score de risque Prediktor</CardTitle>
                <div className="relative flex items-center justify-center h-24 w-24">
                  <svg width="96" height="96">
                    <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                    <circle 
                      cx="48" 
                      cy="48" 
                      r="40" 
                      stroke={
                        insights.aiScores.riskScore.value === 'Très Bas' ? '#059669' : 
                        insights.aiScores.riskScore.value === 'Bas' ? '#10b981' : 
                        insights.aiScores.riskScore.value === 'Modéré' ? '#f59e0b' : 
                        insights.aiScores.riskScore.value === 'Élevé' ? '#f97316' : 
                        '#dc2626'
                      } 
                      strokeWidth="12" 
                      fill="none" 
                      strokeDasharray="251.2" 
                      strokeDashoffset={251.2 - (insights.aiScores.riskScore.percentage * 251.2 / 100)} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${
                    insights.aiScores.riskScore.value === 'Très Bas' ? 'text-green-600' : 
                    insights.aiScores.riskScore.value === 'Bas' ? 'text-emerald-600' : 
                    insights.aiScores.riskScore.value === 'Modéré' ? 'text-yellow-600' : 
                    insights.aiScores.riskScore.value === 'Élevé' ? 'text-orange-600' : 
                    'text-red-600'
                  }`}>
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