import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Link2, ArrowLeft, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SectorAnalysis from "./SectorAnalysis";
import { CompanyData } from "@/services/gemini";
import { getRandomTestData } from "@/utils/test-data";

interface DataFormProps {
  onBack?: () => void;
}

const DataForm = ({ onBack }: DataFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    year: "",
    revenue: "",
    expenses: "",
    employees: "",
    sector: "",
    market: ""
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  const sectors = [
    "Agriculture", "Commerce", "Services", "Technologie", 
    "Industrie", "Transport", "Santé", "Éducation", "Autre"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des données
    if (!formData.year || !formData.revenue || !formData.expenses || !formData.employees || !formData.sector) {
      toast({
        title: "Données incomplètes",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Conversion des données
    const data: CompanyData = {
      year: formData.year,
      revenue: parseInt(formData.revenue.replace(/\s/g, '')),
      expenses: parseInt(formData.expenses.replace(/\s/g, '')),
      employees: parseInt(formData.employees),
      sector: formData.sector,
      market: formData.market
    };

    setCompanyData(data);
    setShowAnalysis(true);
    
    toast({
      title: "Données validées",
      description: "Génération de l'analyse sectorielle en cours...",
      duration: 3000,
    });
  };

  const handleTestData = () => {
    const testData = getRandomTestData();
    setFormData({
      year: testData.year,
      revenue: testData.revenue.toString(),
      expenses: testData.expenses.toString(),
      employees: testData.employees.toString(),
      sector: testData.sector,
      market: testData.market
    });
    
    toast({
      title: "Données de test chargées",
      description: "Vous pouvez maintenant générer l'analyse ou modifier les données.",
      duration: 3000,
    });
  };

  const formatCurrency = (value: string) => {
    // Format number with thousands separator
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Si l'analyse est demandée, afficher le composant d'analyse
  if (showAnalysis && companyData) {
    return (
      <SectorAnalysis 
        companyData={companyData} 
        onBack={() => {
          setShowAnalysis(false);
          setCompanyData(null);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-2xl font-bold text-foreground">Saisie des Données</h1>
              <p className="text-muted-foreground">Renseignez vos informations financières pour l'analyse sectorielle</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Import Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-card-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Upload className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Importer depuis Google Sheets</h3>
                  <p className="text-sm text-muted-foreground">Connectez votre feuille de calcul</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-card-border hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Google Analytics</h3>
                  <p className="text-sm text-muted-foreground">Données de trafic web</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manual Entry Form */}
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle className="text-foreground">Saisie Manuelle</CardTitle>
            <p className="text-muted-foreground">Entrez vos données financières manuellement</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Year Selection */}
                <div className="space-y-2">
                  <Label htmlFor="year">Année</Label>
                  <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sector */}
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'Activité</Label>
                  <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir le secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue */}
                <div className="space-y-2">
                  <Label htmlFor="revenue">Chiffre d'Affaires (FCFA)</Label>
                  <Input
                    id="revenue"
                    type="text"
                    placeholder="Ex: 5 000 000"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange('revenue', formatCurrency(e.target.value))}
                  />
                </div>

                {/* Expenses */}
                <div className="space-y-2">
                  <Label htmlFor="expenses">Charges Totales (FCFA)</Label>
                  <Input
                    id="expenses"
                    type="text"
                    placeholder="Ex: 3 500 000"
                    value={formData.expenses}
                    onChange={(e) => handleInputChange('expenses', formatCurrency(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employees */}
                <div className="space-y-2">
                  <Label htmlFor="employees">Nombre d'Employés</Label>
                  <Input
                    id="employees"
                    type="number"
                    placeholder="Ex: 15"
                    value={formData.employees}
                    onChange={(e) => handleInputChange('employees', e.target.value)}
                  />
                </div>

                {/* Market */}
                <div className="space-y-2">
                  <Label htmlFor="market">Marché Principal</Label>
                  <Input
                    id="market"
                    type="text"
                    placeholder="Ex: National, Régional, Local"
                    value={formData.market}
                    onChange={(e) => handleInputChange('market', e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button type="submit" className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Générer l'Analyse Sectorielle
                </Button>
                <Button type="button" variant="outline" className="flex-1">
                  Sauvegarder
                </Button>
                <Button type="button" variant="secondary" onClick={handleTestData}>
                  Charger Données Test
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DataForm;