import { TrendingUp, Users, DollarSign, AlertCircle, BarChart3, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  onModuleChange?: (module: string) => void;
}

const Dashboard = ({ onModuleChange }: DashboardProps) => {
  const metrics = [
    {
      title: "Chiffre d'Affaires",
      value: "2,500,000",
      unit: "FCFA",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "primary"
    },
    {
      title: "Croissance Prédite",
      value: "18.5",
      unit: "%",
      change: "+3.2%",
      trend: "up", 
      icon: TrendingUp,
      color: "success"
    },
    {
      title: "Employés",
      value: "12",
      unit: "personnes",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "primary"
    },
    {
      title: "Niveau de Risque",
      value: "Faible",
      unit: "",
      change: "Stable",
      trend: "neutral",
      icon: AlertCircle,
      color: "success"
    }
  ];

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
              <p className="text-muted-foreground">Tableau de bord - Mon Entreprise</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => onModuleChange?.("data-entry")}>
                Prédictions
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
          {metrics.map((metric, index) => (
            <Card key={index} className="border-card-border hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className={`h-4 w-4 ${
                  metric.color === 'success' ? 'text-success' : 'text-primary'
                }`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                </div>
                <p className={`text-xs ${
                  metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {metric.change} par rapport au mois dernier
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Évolution de la Croissance</CardTitle>
            <p className="text-muted-foreground">Prédiction sur 24 mois</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Graphique de tendance à venir</p>
                <p className="text-sm text-muted-foreground">Connectez vos données pour voir les prédictions</p>
              </div>
            </div>
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