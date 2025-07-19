import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  ArrowLeft,
  User,
  Building2,
  Key,
  Bell,
  Globe,
  Shield,
  Database,
  Link2,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onBack?: () => void;
}

interface SettingsData {
  // Profil utilisateur
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  
  // Entreprise
  companyName: string;
  companySize: string;
  industry: string;
  country: string;
  currency: string;
  
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  
  // Intégrations
  googleSheets: boolean;
  googleAnalytics: boolean;
  geminiApi: boolean;
  
  // Sécurité
  twoFactorAuth: boolean;
  sessionTimeout: string;
  dataRetention: string;
}

const Settings = ({ onBack }: SettingsProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+225 0123456789",
    language: "fr",
    timezone: "Africa/Abidjan",
    
    companyName: "Tech Solutions Africa",
    companySize: "10-50",
    industry: "Technologie",
    country: "Côte d'Ivoire",
    currency: "FCFA",
    
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
    
    googleSheets: true,
    googleAnalytics: false,
    geminiApi: true,
    
    twoFactorAuth: false,
    sessionTimeout: "30",
    dataRetention: "2"
  });

  const languages = [
    { value: "fr", label: "Français" },
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" }
  ];

  const timezones = [
    { value: "Africa/Abidjan", label: "Abidjan (GMT+0)" },
    { value: "Africa/Lagos", label: "Lagos (GMT+1)" },
    { value: "Africa/Cairo", label: "Cairo (GMT+2)" },
    { value: "Europe/Paris", label: "Paris (GMT+1/+2)" }
  ];

  const companySizes = [
    "1-5", "6-10", "11-25", "26-50", "51-100", "100+"
  ];

  const industries = [
    "Agriculture", "Commerce", "Services", "Technologie", 
    "Industrie", "Transport", "Santé", "Éducation", "Finance",
    "Immobilier", "Tourisme", "Énergie", "Autre"
  ];

  const countries = [
    "Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso", "Niger",
    "Togo", "Bénin", "Ghana", "Nigeria", "Cameroun", "Autre"
  ];

  const currencies = [
    "FCFA", "USD", "EUR", "GBP", "XOF"
  ];

  const sessionTimeouts = [
    { value: "15", label: "15 minutes" },
    { value: "30", label: "30 minutes" },
    { value: "60", label: "1 heure" },
    { value: "120", label: "2 heures" }
  ];

  const dataRetentionPeriods = [
    { value: "1", label: "1 an" },
    { value: "2", label: "2 ans" },
    { value: "3", label: "3 ans" },
    { value: "5", label: "5 ans" }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos paramètres ont été mis à jour avec succès.",
      duration: 3000,
    });
    
    setIsSaving(false);
  };

  const handleTestConnection = (service: string) => {
    toast({
      title: `Test de connexion ${service}`,
      description: `Test de la connexion ${service} en cours...`,
      duration: 2000,
    });
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            value={settings.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            value={settings.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={settings.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            value={settings.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="language">Langue</Label>
          <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="companyName">Nom de l'entreprise</Label>
        <Input
          id="companyName"
          value={settings.companyName}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companySize">Taille de l'entreprise</Label>
          <Select value={settings.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>{size} employés</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Secteur d'activité</Label>
          <Select value={settings.industry} onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="country">Pays</Label>
          <Select value={settings.country} onValueChange={(value) => handleInputChange('country', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency} value={currency}>{currency}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications par email</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir les notifications importantes par email
            </p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications push</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir les notifications sur votre navigateur
            </p>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Rapports hebdomadaires</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir un résumé hebdomadaire de vos performances
            </p>
          </div>
          <Switch
            checked={settings.weeklyReports}
            onCheckedChange={(checked) => handleInputChange('weeklyReports', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Rapports mensuels</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir un rapport mensuel détaillé
            </p>
          </div>
          <Switch
            checked={settings.monthlyReports}
            onCheckedChange={(checked) => handleInputChange('monthlyReports', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card className="border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Link2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Google Sheets</h4>
                  <p className="text-sm text-muted-foreground">
                    Import automatique des données financières
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.googleSheets}
                  onCheckedChange={(checked) => handleInputChange('googleSheets', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('Google Sheets')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tester
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Données de trafic web et comportement utilisateur
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.googleAnalytics}
                  onCheckedChange={(checked) => handleInputChange('googleAnalytics', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('Google Analytics')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tester
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-card-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Key className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium">Google Gemini API</h4>
                  <p className="text-sm text-muted-foreground">
                    Génération de contenu IA pour les business plans
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.geminiApi}
                  onCheckedChange={(checked) => handleInputChange('geminiApi', checked)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestConnection('Gemini API')}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tester
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Authentification à deux facteurs</Label>
            <p className="text-sm text-muted-foreground">
              Sécurisez votre compte avec un code supplémentaire
            </p>
          </div>
          <Switch
            checked={settings.twoFactorAuth}
            onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Délai d'expiration de session</Label>
          <Select value={settings.sessionTimeout} onValueChange={(value) => handleInputChange('sessionTimeout', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sessionTimeouts.map((timeout) => (
                <SelectItem key={timeout.value} value={timeout.value}>{timeout.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataRetention">Rétention des données</Label>
          <Select value={settings.dataRetention} onValueChange={(value) => handleInputChange('dataRetention', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dataRetentionPeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Actions de sécurité</h4>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            Changer le mot de passe
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Database className="h-4 w-4 mr-2" />
            Exporter mes données
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Supprimer mon compte
          </Button>
        </div>
      </div>
    </div>
  );

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
              <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
              <p className="text-muted-foreground">Configurez votre profil et vos préférences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Entreprise
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Intégrations
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>Profil utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                {renderProfileTab()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>Informations entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCompanyTab()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
              </CardHeader>
              <CardContent>
                {renderNotificationsTab()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>Intégrations externes</CardTitle>
              </CardHeader>
              <CardContent>
                {renderIntegrationsTab()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-card-border">
              <CardHeader>
                <CardTitle>Sécurité et confidentialité</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSecurityTab()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings; 