import { TrendingUp, Users, DollarSign, AlertCircle, BarChart3, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserHistory } from "@/hooks/use-user-history";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardProps {
  onModuleChange?: (module: string) => void;
}

const Dashboard = ({ onModuleChange }: DashboardProps) => {
  const { lastAnalysis, lastPrediction, loading } = useUserHistory();

  // Calculer les métriques basées sur les vraies données
  const getMetrics = () => {
    if (!lastAnalysis && !lastPrediction) {
      return [
        {
          title: "Chiffre d'Affaires",
          value: "0",
          unit: "€",
          change: "Aucune donnée",
          trend: "neutral",
          icon: DollarSign,
          color: "primary"
        },
        {
          title: "Croissance Prédite",
          value: "0",
          unit: "%",
          change: "Aucune donnée",
          trend: "neutral", 
          icon: TrendingUp,
          color: "success"
        },
        {
          title: "Employés",
          value: "0",
          unit: "personnes",
          change: "Aucune donnée",
          trend: "neutral",
          icon: Users,
          color: "primary"
        },
        {
          title: "Niveau de Risque",
          value: "Inconnu",
          unit: "",
          change: "Aucune donnée",
          trend: "neutral",
          icon: AlertCircle,
          color: "success"
        }
      ];
    }

    // Utiliser les données de prédiction pour les métriques financières
    const revenue = lastPrediction?.revenue || 0;
    const expenses = lastPrediction?.expenses || 0;
    const employees = lastPrediction?.employees || 0;
    const sector = lastPrediction?.sector || "Inconnu";

    // Calculer la marge brute
    const margin = revenue > 0 ? ((revenue - expenses) / revenue * 100) : 0;
    
    // Utiliser les données d'analyse pour le score de risque et la croissance
    const riskScore = lastAnalysis?.healthScore?.overall || 50;
    const growthPrediction = lastAnalysis?.sectorData?.growthRate || 0;
    
    // Déterminer le niveau de risque
    const getRiskLevel = (score: number) => {
      if (score >= 80) return { value: "Faible", color: "success", trend: "neutral" };
      if (score >= 60) return { value: "Modéré", color: "warning", trend: "neutral" };
      if (score >= 40) return { value: "Élevé", color: "warning", trend: "down" };
      return { value: "Critique", color: "destructive", trend: "down" };
    };

    const risk = getRiskLevel(riskScore);

    return [
      {
        title: "Chiffre d'Affaires",
        value: revenue.toLocaleString('fr-FR'),
        unit: "€",
        change: margin > 0 ? `+${margin.toFixed(1)}% marge` : `${margin.toFixed(1)}% marge`,
        trend: margin > 0 ? "up" : margin < 0 ? "down" : "neutral",
        icon: DollarSign,
        color: margin > 0 ? "success" : margin < 0 ? "destructive" : "primary"
      },
      {
        title: "Croissance Prédite",
        value: growthPrediction.toFixed(1),
        unit: "%",
        change: growthPrediction > 0 ? `+${growthPrediction.toFixed(1)}%` : `${growthPrediction.toFixed(1)}%`,
        trend: growthPrediction > 0 ? "up" : growthPrediction < 0 ? "down" : "neutral", 
        icon: TrendingUp,
        color: growthPrediction > 0 ? "success" : growthPrediction < 0 ? "destructive" : "primary"
      },
      {
        title: "Employés",
        value: employees.toString(),
        unit: "personnes",
        change: employees > 0 ? `${(revenue / employees).toLocaleString('fr-FR')} €/pers` : "Aucun employé",
        trend: "neutral",
        icon: Users,
        color: "primary"
      },
      {
        title: "Niveau de Risque",
        value: risk.value,
        unit: "",
        change: `Score: ${riskScore}/100`,
        trend: risk.trend,
        icon: AlertCircle,
        color: risk.color
      }
    ];
  };

  const metrics = getMetrics();

  const quickActions = [
    {
      title: "Saisir Données",
      description: "Ajouter vos données financières",
      icon: BarChart3,
      action: "data-entry"
    },
    {
      title: "Générer Business Plan",
      description: "Créer un business plan automatique",
      icon: FileText,
      action: "business-plan"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">SME Growth Predictor</h1>
              <p className="text-muted-foreground">
                Tableau de bord - {lastPrediction?.sector || "Mon Entreprise"}
                {lastPrediction?.createdAt && (
                  <span className="ml-2 text-xs">
                    • Dernière mise à jour: {new Date(lastPrediction.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => onModuleChange?.("insights")}>
                Insights Prediktor
              </Button>
              <Button size="sm" onClick={() => onModuleChange?.("business-plan")}>
                Générer business plan
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-card-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </CardContent>
              </Card>
            ))
          ) : (
            metrics.map((metric, index) => (
              <Card key={index} className="border-card-border hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <metric.icon className={`h-4 w-4 ${
                    metric.color === 'success' ? 'text-success' : 
                    metric.color === 'destructive' ? 'text-destructive' :
                    metric.color === 'warning' ? 'text-yellow-600' : 'text-primary'
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                  </div>
                  <p className={`text-xs ${
                    metric.trend === 'up' ? 'text-success' : 
                    metric.trend === 'down' ? 'text-destructive' : 
                    'text-muted-foreground'
                  }`}>
                    {metric.change}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Chart Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Évolution de la Croissance</CardTitle>
            <p className="text-muted-foreground">
              {lastAnalysis ? "Données d'analyse sectorielle" : "Prédiction sur 24 mois"}
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            ) : lastAnalysis ? (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-foreground">Analyse sectorielle disponible</p>
                  <p className="text-sm text-muted-foreground">
                    Score de santé: {lastAnalysis.healthScore?.overall || 0}/100
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => onModuleChange?.("insights")}
                  >
                    Voir les insights
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Graphique de tendance à venir</p>
                  <p className="text-sm text-muted-foreground">Connectez vos données pour voir les prédictions</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="border-card-border hover:shadow-md transition-all cursor-pointer group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-foreground">{action.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => onModuleChange?.(action.action)}
                >
                  Commencer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;