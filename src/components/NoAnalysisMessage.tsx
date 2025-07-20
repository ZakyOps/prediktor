import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  ArrowRight,
  AlertCircle
} from "lucide-react";

interface NoAnalysisMessageProps {
  onStartAnalysis?: () => void;
}

const NoAnalysisMessage = ({ onStartAnalysis }: NoAnalysisMessageProps) => {
  return (
    <div className="space-y-8">
      {/* Message principal */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucune analyse sectorielle récente trouvée. Effectuez une analyse pour voir vos insights IA.
        </AlertDescription>
      </Alert>

      {/* Carte d'action principale */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Commencer votre première analyse
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            L'analyse sectorielle vous permettra d'obtenir des insights avancés sur votre positionnement 
            et vos opportunités de croissance.
          </p>
          
          {onStartAnalysis && (
            <Button onClick={onStartAnalysis} className="gap-2">
              Lancer l'analyse sectorielle
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Fonctionnalités disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Croissance prévisionnelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualisez les projections de croissance sur 24 mois basées sur les données sectorielles 
              et les tendances du marché.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-success" />
              Benchmark sectoriel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Comparez vos performances avec celles de votre secteur et identifiez vos avantages 
              concurrentiels.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-accent" />
              Recommandations IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Recevez des recommandations personnalisées et des opportunités détectées par Prediktor
              pour optimiser votre stratégie.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Étapes pour commencer */}
      <Card>
        <CardHeader>
          <CardTitle>Comment commencer ?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Remplissez le formulaire d'analyse</h4>
                <p className="text-sm text-muted-foreground">
                  Saisissez les informations de votre entreprise : secteur, taille, performance, etc.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Lancez l'analyse avec Prediktor</h4>
                <p className="text-sm text-muted-foreground">
                  Notre IA Prediktor analyse vos données et génère des insights personnalisés en quelques secondes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Consultez vos insights</h4>
                <p className="text-sm text-muted-foreground">
                  Visualisez vos résultats, graphiques et recommandations dans cette section.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoAnalysisMessage; 