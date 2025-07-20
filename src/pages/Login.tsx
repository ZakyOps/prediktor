import { useState } from "react";
import { login } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Copy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirige si déjà connecté
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    setEmail("test1@gmail.com");
    setPassword("123456");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Section d'informations de test (conservée) */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-900 text-lg">Compte de test</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-blue-800 text-sm mb-3">
              Utilisez ces identifiants pour tester notre solution :
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded p-2">
                <span className="text-sm font-medium text-blue-900">Email:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">test1@gmail.com</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("test1@gmail.com")}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-2">
                <span className="text-sm font-medium text-blue-900">Mot de passe:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">123456</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("123456")}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={handleTestLogin}
              variant="outline"
              className="w-full mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              Remplir automatiquement
            </Button>
          </CardContent>
        </Card>

        {/* Formulaire de connexion simplifié */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Connexion à la plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Chargement..." : "Se connecter"}
              </Button>
            </form>
            {/* Pas de lien vers l'inscription */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;