import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  Settings, 
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BusinessPlanService, { BusinessPlanData as ServiceBusinessPlanData, GeneratedBusinessPlan, saveBusinessPlanToFirestore } from "@/services/business-plan";
import BusinessPlanPreview from "./BusinessPlanPreview";
import PDFPreview from "./PDFPreview";
import { useAuth } from "@/contexts/AuthContext";

interface BusinessPlanProps {
  onBack?: () => void;
}

interface BusinessPlanData {
  companyName: string;
  industry: string;
  description: string;
  marketSize: string;
  targetMarket: string;
  competitiveAdvantage: string;
  revenueModel: string;
  fundingRequired: string;
  teamSize: string;
  timeline: string;
  sections: {
    executiveSummary: boolean;
    companyDescription: boolean;
    marketAnalysis: boolean;
    organization: boolean;
    productsServices: boolean;
    marketingSales: boolean;
    financialProjections: boolean;
    funding: boolean;
    appendices: boolean;
  };
}

const BusinessPlan = ({ onBack }: BusinessPlanProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedBusinessPlan | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [planData, setPlanData] = useState<BusinessPlanData>({
    companyName: "",
    industry: "",
    description: "",
    marketSize: "",
    targetMarket: "",
    competitiveAdvantage: "",
    revenueModel: "",
    fundingRequired: "",
    teamSize: "",
    timeline: "",
    sections: {
      executiveSummary: true,
      companyDescription: true,
      marketAnalysis: true,
      organization: true,
      productsServices: true,
      marketingSales: true,
      financialProjections: true,
      funding: true,
      appendices: false,
    }
  });

  const industries = [
    "Agriculture", "Commerce", "Services", "Technologie", 
    "Industrie", "Transport", "Santé", "Éducation", "Finance",
    "Immobilier", "Tourisme", "Énergie", "Autre"
  ];

  const revenueModels = [
    "Vente directe", "Abonnement", "Commission", "Publicité",
    "Licence", "Franchise", "Marketplace", "Freemium"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    if (typeof value === 'boolean') {
      setPlanData(prev => ({
        ...prev,
        sections: {
          ...prev.sections,
          [field]: value
        }
      }));
    } else {
      setPlanData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleGeneratePlan = async () => {
    try {
      setIsGenerating(true);
      
      // Validation des données requises
      if (!planData.companyName || !planData.industry || !planData.description) {
        toast({
          title: "Données manquantes",
          description: "Veuillez remplir au minimum le nom de l'entreprise, le secteur et la description.",
          variant: "destructive",
          duration: 5000,
        });
        return;
      }

      const businessPlanService = new BusinessPlanService();
      const generated = await businessPlanService.generateBusinessPlan(planData as ServiceBusinessPlanData);
      
      setGeneratedPlan(generated);
      
      // Sauvegarder le business plan dans Firestore lié à l'utilisateur
      if (user) {
        try {
          await saveBusinessPlanToFirestore(user.uid, generated);
        } catch (err) {
          console.error('Erreur lors de la sauvegarde du business plan Firestore:', err);
        }
      }
      
      toast({
        title: "Business Plan généré",
        description: "Votre business plan a été créé avec succès par l'IA. Vous pouvez maintenant le télécharger ou le modifier.",
        duration: 5000,
      });
      
      setCurrentStep(3);
    } catch (error) {
      console.error('Error generating business plan:', error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le business plan. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx' | 'google-docs') => {
    if (!generatedPlan) {
      toast({
        title: "Aucun plan généré",
        description: "Veuillez d'abord générer un business plan.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const businessPlanService = new BusinessPlanService();
      
      if (format === 'pdf') {
        await businessPlanService.generatePDFContent(generatedPlan);
      } else if (format === 'docx') {
        const wordContent = await businessPlanService.generateWordContent(generatedPlan);
        // Ici vous pourriez intégrer une bibliothèque de génération Word
        console.log('Word Content:', wordContent);
      }

      toast({
        title: `Export ${format.toUpperCase()}`,
        description: `Votre business plan est en cours d'export au format ${format.toUpperCase()}.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error exporting business plan:', error);
      
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le business plan. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const steps = [
    { id: 1, title: "Informations de base", description: "Décrivez votre entreprise" },
    { id: 2, title: "Sections du plan", description: "Choisissez les sections à inclure" },
    { id: 3, title: "Génération & Export", description: "Générez et téléchargez votre plan" }
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise</Label>
          <Input
            id="companyName"
            placeholder="Ex: Tech Solutions Africa"
            value={planData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Select value={planData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir le secteur" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description de l'entreprise</Label>
        <Textarea
          id="description"
          placeholder="Décrivez votre entreprise, sa mission et sa vision..."
          value={planData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="marketSize">Taille du marché (FCFA)</Label>
          <Input
            id="marketSize"
            placeholder="Ex: 50 000 000"
            value={planData.marketSize}
            onChange={(e) => handleInputChange('marketSize', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetMarket">Marché cible</Label>
          <Input
            id="targetMarket"
            placeholder="Ex: PME africaines, 25-45 ans"
            value={planData.targetMarket}
            onChange={(e) => handleInputChange('targetMarket', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="competitiveAdvantage">Avantage concurrentiel</Label>
        <Textarea
          id="competitiveAdvantage"
          placeholder="Décrivez ce qui vous différencie de vos concurrents..."
          value={planData.competitiveAdvantage}
          onChange={(e) => handleInputChange('competitiveAdvantage', e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="revenueModel">Modèle de revenus</Label>
          <Select value={planData.revenueModel} onValueChange={(value) => handleInputChange('revenueModel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir le modèle" />
            </SelectTrigger>
            <SelectContent>
              {revenueModels.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundingRequired">Financement requis (FCFA)</Label>
          <Input
            id="fundingRequired"
            placeholder="Ex: 10 000 000"
            value={planData.fundingRequired}
            onChange={(e) => handleInputChange('fundingRequired', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="teamSize">Taille de l'équipe</Label>
          <Input
            id="teamSize"
            placeholder="Ex: 5 personnes"
            value={planData.teamSize}
            onChange={(e) => handleInputChange('teamSize', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline">Horizon temporel</Label>
          <Input
            id="timeline"
            placeholder="Ex: 3-5 ans"
            value={planData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(planData.sections).map(([key, value]) => (
          <Card key={key} className="border-card-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => handleInputChange(key, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={key} className="text-sm font-medium">
                    {key === 'executiveSummary' && 'Résumé exécutif'}
                    {key === 'companyDescription' && 'Description de l\'entreprise'}
                    {key === 'marketAnalysis' && 'Analyse de marché'}
                    {key === 'organization' && 'Organisation et management'}
                    {key === 'productsServices' && 'Produits et services'}
                    {key === 'marketingSales' && 'Marketing et ventes'}
                    {key === 'financialProjections' && 'Projections financières'}
                    {key === 'funding' && 'Financement requis'}
                    {key === 'appendices' && 'Annexes'}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {key === 'executiveSummary' && 'Synthèse du business plan'}
                    {key === 'companyDescription' && 'Présentation détaillée de l\'entreprise'}
                    {key === 'marketAnalysis' && 'Étude du marché et de la concurrence'}
                    {key === 'organization' && 'Structure organisationnelle'}
                    {key === 'productsServices' && 'Description des produits/services'}
                    {key === 'marketingSales' && 'Stratégie marketing et commerciale'}
                    {key === 'financialProjections' && 'Projections financières détaillées'}
                    {key === 'funding' && 'Besoins en financement'}
                    {key === 'appendices' && 'Documents complémentaires'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <Card className="border-card-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Business Plan généré avec succès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <h4 className="font-medium">Business Plan - {planData.companyName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Généré le {new Date().toLocaleDateString()} • {generatedPlan?.metadata.totalPages || 25} pages
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PDFPreview 
                  businessPlan={generatedPlan} 
                  onExport={async () => {
                    const businessPlanService = new BusinessPlanService();
                    await businessPlanService.generatePDFContent(generatedPlan);
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Aperçu Complet
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={() => handleExport('pdf')} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter PDF
              </Button>
              <Button onClick={() => handleExport('docx')} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter Word
              </Button>
              <Button onClick={() => handleExport('google-docs')} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Google Docs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu du Business Plan */}
      {generatedPlan && (
        <Card className="border-card-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Aperçu du Business Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="executiveSummary" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="executiveSummary">Résumé</TabsTrigger>
                <TabsTrigger value="companyDescription">Entreprise</TabsTrigger>
                <TabsTrigger value="marketAnalysis">Marché</TabsTrigger>
                <TabsTrigger value="financialProjections">Finances</TabsTrigger>
              </TabsList>

              <TabsContent value="executiveSummary" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{generatedPlan.executiveSummary.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{generatedPlan.executiveSummary.content}</p>
                  {generatedPlan.executiveSummary.subsections?.map((subsection, index) => (
                    <div key={index} className="ml-4 mb-3">
                      <h4 className="font-medium text-sm mb-1">{subsection.title}</h4>
                      <p className="text-xs text-muted-foreground">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="companyDescription" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{generatedPlan.companyDescription.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{generatedPlan.companyDescription.content}</p>
                  {generatedPlan.companyDescription.subsections?.map((subsection, index) => (
                    <div key={index} className="ml-4 mb-3">
                      <h4 className="font-medium text-sm mb-1">{subsection.title}</h4>
                      <p className="text-xs text-muted-foreground">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="marketAnalysis" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{generatedPlan.marketAnalysis.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{generatedPlan.marketAnalysis.content}</p>
                  {generatedPlan.marketAnalysis.subsections?.map((subsection, index) => (
                    <div key={index} className="ml-4 mb-3">
                      <h4 className="font-medium text-sm mb-1">{subsection.title}</h4>
                      <p className="text-xs text-muted-foreground">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="financialProjections" className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{generatedPlan.financialProjections.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{generatedPlan.financialProjections.content}</p>
                  {generatedPlan.financialProjections.subsections?.map((subsection, index) => (
                    <div key={index} className="ml-4 mb-3">
                      <h4 className="font-medium text-sm mb-1">{subsection.title}</h4>
                      <p className="text-xs text-muted-foreground">{subsection.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Si on affiche la prévisualisation complète
  if (showPreview && generatedPlan) {
    return (
      <BusinessPlanPreview
        businessPlan={generatedPlan}
        onBack={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
        onExport={handleExport}
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
              <h1 className="text-2xl font-bold text-foreground">Générateur de Business Plan</h1>
              <p className="text-muted-foreground">Créez un business plan professionnel en quelques étapes</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background border-border'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep - 1].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-card-border">
          <CardContent className="p-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep < 3 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Précédent
            </Button>
            <Button
              onClick={() => {
                if (currentStep === 1) {
                  setCurrentStep(2);
                } else if (currentStep === 2) {
                  handleGeneratePlan();
                }
              }}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : currentStep === 2 ? (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Générer le Business Plan
                </>
              ) : (
                'Suivant'
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default BusinessPlan; 