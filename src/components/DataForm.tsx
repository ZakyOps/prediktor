import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Link2, ArrowLeft, BarChart3, FileSpreadsheet, TrendingUp, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SectorAnalysis from "./SectorAnalysis";
import { CompanyData } from "@/services/gemini";
import { getRandomTestData } from "@/utils/test-data";
import { useAuth } from "@/contexts/AuthContext";
import { savePredictionToFirestore } from "@/services/prediction-storage";
import { useUserProfile } from "@/hooks/use-user-profile";

interface DataFormProps {
  onBack?: () => void;
}

interface ImportedData {
  type: 'sheets' | 'analytics' | 'manual';
  data: CompanyData[];
  source: string;
  lastUpdated: Date;
}

const DataForm = ({ onBack }: DataFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { profile: userProfile } = useUserProfile();
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
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

    handlePrediction(data);
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

    handlePrediction(testData);
  };

  const formatCurrency = (value: string) => {
    // Format number with thousands separator
    return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handlePrediction = async (prediction: any) => {
    if (user) {
      try {
        await savePredictionToFirestore(user.uid, prediction);
      } catch (err) {
        console.error('Erreur lors de la sauvegarde de la prédiction Firestore:', err);
      }
    }
  };

  // Simulation d'import depuis Google Sheets
  const handleGoogleSheetsImport = async () => {
    setIsImporting(true);
    setImportStatus('loading');
    
    try {
      // Simulation d'un délai d'import
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Données simulées importées depuis Google Sheets
      const mockSheetsData: CompanyData[] = [
        {
          year: "2024",
          revenue: 8500000,
          expenses: 6200000,
          employees: 25,
          sector: "Technologie",
          market: "National"
        },
        {
          year: "2023",
          revenue: 7200000,
          expenses: 5400000,
          employees: 22,
          sector: "Technologie",
          market: "National"
        },
        {
          year: "2022",
          revenue: 5800000,
          expenses: 4200000,
          employees: 18,
          sector: "Technologie",
          market: "Régional"
        }
      ];

      const importedData: ImportedData = {
        type: 'sheets',
        data: mockSheetsData,
        source: 'Google Sheets - Données Financières 2022-2024',
        lastUpdated: new Date()
      };

      setImportedData(importedData);
      setImportStatus('success');
      
      toast({
        title: "Import réussi",
        description: `${mockSheetsData.length} lignes de données importées depuis Google Sheets`,
        duration: 3000,
      });

    } catch (error) {
      setImportStatus('error');
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les données depuis Google Sheets",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Simulation d'import depuis Google Analytics
  const handleGoogleAnalyticsImport = async () => {
    setIsImporting(true);
    setImportStatus('loading');
    
    try {
      // Simulation d'un délai d'import
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Données simulées importées depuis Google Analytics
      const mockAnalyticsData: CompanyData[] = [
        {
          year: "2024",
          revenue: 9200000,
          expenses: 6800000,
          employees: 28,
          sector: "Commerce",
          market: "International"
        },
        {
          year: "2023",
          revenue: 7800000,
          expenses: 5900000,
          employees: 24,
          sector: "Commerce",
          market: "National"
        }
      ];

      const importedData: ImportedData = {
        type: 'analytics',
        data: mockAnalyticsData,
        source: 'Google Analytics - Données de Performance',
        lastUpdated: new Date()
      };

      setImportedData(importedData);
      setImportStatus('success');
      
      toast({
        title: "Import réussi",
        description: `${mockAnalyticsData.length} lignes de données importées depuis Google Analytics`,
        duration: 3000,
      });

    } catch (error) {
      setImportStatus('error');
      toast({
        title: "Erreur d'import",
        description: "Impossible d'importer les données depuis Google Analytics",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Analyser les données importées
  const handleAnalyzeImportedData = (selectedData: CompanyData) => {
    setCompanyData(selectedData);
    setShowAnalysis(true);
    
    toast({
      title: "Analyse en cours",
      description: "Génération de l'analyse sectorielle pour les données sélectionnées...",
      duration: 3000,
    });

    handlePrediction(selectedData);
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
          <Card className="border-card-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <FileSpreadsheet className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Importer depuis Google Sheets</h3>
                  <p className="text-sm text-muted-foreground">Connectez votre feuille de calcul</p>
                </div>
              </div>
              <Button 
                onClick={handleGoogleSheetsImport}
                disabled={isImporting}
                className="w-full"
                variant="outline"
              >
                {isImporting && importStatus === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer depuis Sheets
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-card-border hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Google Analytics</h3>
                  <p className="text-sm text-muted-foreground">Données de trafic web</p>
                </div>
              </div>
              <Button 
                onClick={handleGoogleAnalyticsImport}
                disabled={isImporting}
                className="w-full"
                variant="outline"
              >
                {isImporting && importStatus === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4 mr-2" />
                    Importer depuis Analytics
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Imported Data Display */}
        {importedData && (
          <Card className="border-card-border mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {importedData.type === 'sheets' ? (
                    <FileSpreadsheet className="h-5 w-5 text-secondary" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-primary" />
                  )}
                  <CardTitle>Données Importées</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {importStatus === 'success' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">Importé</span>
                    </div>
                  )}
                  {importStatus === 'error' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Erreur</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {importedData.source} • Dernière mise à jour: {importedData.lastUpdated.toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {importedData.data.map((data, index) => (
                    <Card key={index} className="border border-border hover:border-primary/20 transition-colors">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Année</span>
                            <span className="text-sm font-semibold">{data.year}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">CA</span>
                            <span className="text-sm font-semibold">{data.revenue.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Charges</span>
                            <span className="text-sm font-semibold">{data.expenses.toLocaleString()} FCFA</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Employés</span>
                            <span className="text-sm font-semibold">{data.employees}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Secteur</span>
                            <span className="text-sm font-semibold">{data.sector}</span>
                          </div>
                          <Button 
                            onClick={() => handleAnalyzeImportedData(data)}
                            className="w-full mt-2"
                            size="sm"
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analyser
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Profile Information */}
        {userProfile && (
          <Card className="border-card-border mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Informations d'Entreprise
              </CardTitle>
              <p className="text-muted-foreground">
                Vos informations d'entreprise seront utilisées pour des analyses plus précises et personnalisées.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Entreprise</span>
                  <p className="text-sm font-semibold">{userProfile.companyName || 'Non renseigné'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Pays</span>
                  <p className="text-sm font-semibold">{userProfile.country || 'Non renseigné'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Taille</span>
                  <p className="text-sm font-semibold">{userProfile.companySize || 'Non renseignée'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">Devise</span>
                  <p className="text-sm font-semibold">{userProfile.currency || 'FCFA'}</p>
                </div>
              </div>
              {userProfile.isProfileComplete ? (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Profil complet</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Vos analyses seront adaptées au contexte de {userProfile.country} avec des données sectorielles locales et des recommandations personnalisées.
                  </p>
                </div>
              ) : (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Profil incomplet</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Complétez votre profil dans les paramètres pour des analyses plus précises adaptées à votre contexte local.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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