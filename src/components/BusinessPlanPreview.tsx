import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Edit3, 
  ArrowLeft,
  Building2,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  BarChart3,
  Calendar,
  MapPin,
  Lightbulb
} from "lucide-react";
import { GeneratedBusinessPlan } from "@/services/business-plan";
import BusinessPlanService from "@/services/business-plan";

interface BusinessPlanPreviewProps {
  businessPlan: GeneratedBusinessPlan;
  onBack?: () => void;
  onEdit?: () => void;
  onExport?: (format: 'pdf' | 'docx' | 'google-docs') => void;
}

const BusinessPlanPreview = ({ businessPlan, onBack, onEdit, onExport }: BusinessPlanPreviewProps) => {
  const [activeTab, setActiveTab] = useState('executiveSummary');
  const [isExporting, setIsExporting] = useState(false);

  const getSectionIcon = (sectionKey: string) => {
    switch (sectionKey) {
      case 'executiveSummary': return <FileText className="h-4 w-4" />;
      case 'companyDescription': return <Building2 className="h-4 w-4" />;
      case 'marketAnalysis': return <TrendingUp className="h-4 w-4" />;
      case 'organization': return <Users className="h-4 w-4" />;
      case 'productsServices': return <Target className="h-4 w-4" />;
      case 'marketingSales': return <BarChart3 className="h-4 w-4" />;
      case 'financialProjections': return <DollarSign className="h-4 w-4" />;
      case 'funding': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderSection = (section: any, sectionKey: string) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        {getSectionIcon(sectionKey)}
        <h3 className="text-xl font-semibold">{section.title}</h3>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground leading-relaxed mb-6">
          {section.content}
        </p>
        
        {section.subsections && section.subsections.length > 0 && (
          <div className="space-y-4">
            {section.subsections.map((subsection: any, index: number) => (
              <div key={index} className="border-l-4 border-primary/20 pl-4">
                <h4 className="font-semibold text-sm mb-2">{subsection.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {subsection.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const sections = [
    { key: 'executiveSummary', label: 'Résumé Exécutif' },
    { key: 'companyDescription', label: 'Description Entreprise' },
    { key: 'marketAnalysis', label: 'Analyse de Marché' },
    { key: 'organization', label: 'Organisation' },
    { key: 'productsServices', label: 'Produits & Services' },
    { key: 'marketingSales', label: 'Marketing & Ventes' },
    { key: 'financialProjections', label: 'Projections Financières' },
    { key: 'funding', label: 'Financement' }
  ];

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
                <h1 className="text-2xl font-bold text-foreground">
                  Business Plan - {businessPlan.metadata.companyName}
                </h1>
                <p className="text-muted-foreground">
                  {businessPlan.metadata.industry} • {businessPlan.metadata.totalPages} pages
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  try {
                    setIsExporting(true);
                    const businessPlanService = new BusinessPlanService();
                    await businessPlanService.generatePDFContent(businessPlan);
                  } catch (error) {
                    console.error('Error exporting PDF:', error);
                  } finally {
                    setIsExporting(false);
                  }
                }}
                disabled={isExporting}
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Génération...' : 'PDF'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport?.('docx')}>
                <Download className="h-4 w-4 mr-2" />
                Word
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Métadonnées */}
        <Card className="border-card-border mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Entreprise:</span>
                <span className="font-medium">{businessPlan.metadata.companyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Secteur:</span>
                <span className="font-medium">{businessPlan.metadata.industry}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Généré le:</span>
                <span className="font-medium">
                  {new Date(businessPlan.metadata.generatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Pages:</span>
                <span className="font-medium">{businessPlan.metadata.totalPages}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contenu du Business Plan */}
        <Card className="border-card-border">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
                {sections.map((section) => (
                  <TabsTrigger key={section.key} value={section.key} className="text-xs">
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sections.map((section) => (
                <TabsContent key={section.key} value={section.key} className="space-y-4">
                  {renderSection(businessPlan[section.key as keyof GeneratedBusinessPlan], section.key)}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BusinessPlanPreview; 