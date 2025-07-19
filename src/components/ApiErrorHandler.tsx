import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ApiErrorHandlerProps {
  error: Error;
  onRetry: () => void;
  onBack?: () => void;
}

const ApiErrorHandler = ({ error, onRetry, onBack }: ApiErrorHandlerProps) => {
  const isRateLimitError = error.message.includes('429') || error.message.includes('Quota');
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');

  const getErrorIcon = () => {
    if (isRateLimitError) return <WifiOff className="h-12 w-12 text-orange-500" />;
    if (isNetworkError) return <Wifi className="h-12 w-12 text-red-500" />;
    return <AlertCircle className="h-12 w-12 text-destructive" />;
  };

  const getErrorTitle = () => {
    if (isRateLimitError) return "Limite d'API atteinte";
    if (isNetworkError) return "Erreur de connexion";
    return "Erreur de l'API";
  };

  const getErrorDescription = () => {
    if (isRateLimitError) {
      return "L'API Gemini a atteint sa limite de requêtes. Veuillez réessayer dans quelques minutes ou utilisez les données de démonstration.";
    }
    if (isNetworkError) {
      return "Impossible de se connecter à l'API. Vérifiez votre connexion internet.";
    }
    return "Une erreur s'est produite lors de la communication avec l'API Gemini.";
  };

  const getRetryDelay = () => {
    if (isRateLimitError) return "Réessayer dans 30 secondes";
    return "Réessayer maintenant";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analyse Sectorielle</h1>
              <p className="text-muted-foreground">Erreur lors de l'analyse</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="border-card-border max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {getErrorIcon()}
              
              <div>
                <h2 className="text-xl font-semibold mb-2">{getErrorTitle()}</h2>
                <p className="text-muted-foreground mb-4">{getErrorDescription()}</p>
                
                {isRateLimitError && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-orange-800">
                      💡 <strong>Conseil :</strong> L'application utilise maintenant des données de démonstration 
                      pour vous permettre de voir le résultat. Les données réelles seront disponibles 
                      une fois la limite d'API réinitialisée.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onRetry} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {getRetryDelay()}
                </Button>
                
                {isRateLimitError && (
                  <Button onClick={onRetry} variant="default">
                    Continuer avec les données de démonstration
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Détails techniques : {error.message}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ApiErrorHandler; 