import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Eye, 
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { GeneratedBusinessPlan } from "@/services/business-plan";

interface PDFPreviewProps {
  businessPlan: GeneratedBusinessPlan;
  onExport: () => Promise<void>;
}

const PDFPreview = ({ businessPlan, onExport }: PDFPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);
      await onExport();
      setExportSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setExportSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const sections = [
    { key: 'executiveSummary', title: 'Résumé Exécutif', icon: '📋' },
    { key: 'companyDescription', title: 'Description de l\'Entreprise', icon: '🏢' },
    { key: 'marketAnalysis', title: 'Analyse de Marché', icon: '📊' },
    { key: 'organization', title: 'Organisation et Management', icon: '👥' },
    { key: 'productsServices', title: 'Produits et Services', icon: '🎯' },
    { key: 'marketingSales', title: 'Marketing et Ventes', icon: '📈' },
    { key: 'financialProjections', title: 'Projections Financières', icon: '💰' },
    { key: 'funding', title: 'Financement Requis', icon: '💳' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Aperçu PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Aperçu du Business Plan PDF
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du document */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Entreprise:</span>
                  <p className="text-muted-foreground">{businessPlan.metadata.companyName}</p>
                </div>
                <div>
                  <span className="font-medium">Secteur:</span>
                  <p className="text-muted-foreground">{businessPlan.metadata.industry}</p>
                </div>
                <div>
                  <span className="font-medium">Pages estimées:</span>
                  <p className="text-muted-foreground">{businessPlan.metadata.totalPages}</p>
                </div>
                <div>
                  <span className="font-medium">Format:</span>
                  <p className="text-muted-foreground">PDF A4 Professionnel</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Structure du document */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Structure du Document</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-lg">📄</span>
                  <span className="font-medium">Page de titre</span>
                  <Badge variant="secondary" className="ml-auto">Page 1</Badge>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="text-lg">📑</span>
                  <span className="font-medium">Table des matières</span>
                  <Badge variant="secondary" className="ml-auto">Page 2</Badge>
                </div>
                {sections.map((section, index) => (
                  <div key={section.key} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                    <Badge variant="secondary" className="ml-auto">Page {index + 3}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Aperçu du contenu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aperçu du Contenu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Résumé Exécutif</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {businessPlan.executiveSummary.content}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description de l'Entreprise</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {businessPlan.companyDescription.content}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Analyse de Marché</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {businessPlan.marketAnalysis.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting}
              className="min-w-[120px]"
            >
              {isExporting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : exportSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Téléchargé !
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger PDF
                </>
              )}
            </Button>
          </div>

          {/* Messages d'information */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Le PDF sera généré avec une mise en page professionnelle</p>
            <p>• Toutes les sections seront incluses avec leurs sous-sections</p>
            <p>• Le document sera optimisé pour l'impression et la lecture</p>
            <p>• Le nom du fichier inclura le nom de l'entreprise et la date</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFPreview; 