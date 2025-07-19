# Intégration des Insights avec Données Réelles

## 🎯 Objectif

Remplacer les données mockées du composant Insights par les vraies données de la dernière analyse sectorielle effectuée, en utilisant le localStorage pour la persistance.

## 🏗️ Architecture Implémentée

### 1. **Hook useInsights** (`src/hooks/use-insights.ts`)

#### Interface `InsightData`
```typescript
export interface InsightData {
  // Données de croissance prévisionnelle
  growthData: {
    current: number;
    projected12Months: number;
    minGrowth: number;
    maxGrowth: number;
    evolution12Months: number;
    monthlyProjections: Array<{
      month: string;
      growth: number;
    }>;
  };
  
  // Données de benchmark sectoriel
  benchmarkData: {
    companyGrowth: number;
    sectorGrowth: number;
    gap: number;
    riskLevel: string;
    indicators: Array<{
      indicator: string;
      company: number;
      sector: number;
    }>;
  };
  
  // Scores IA
  aiScores: {
    riskScore: {
      value: string;
      percentage: number;
      description: string;
    };
    objectiveProbability: {
      value: number;
      description: string;
    };
    recommendation: {
      title: string;
      description: string;
      impact: string;
    };
    opportunity: {
      title: string;
      description: string;
      potential: string;
    };
  };
  
  // Métadonnées
  metadata: {
    lastAnalysisDate: string;
    companyName: string;
    sector: string;
    isDemoData: boolean;
  };
}
```

#### Fonctionnalités du Hook
- **Récupération** des données depuis localStorage
- **Transformation** des données d'analyse en insights
- **Gestion d'erreurs** et états de chargement
- **Actualisation** des données
- **Notification** pour les données de démonstration

### 2. **Composant Insights** (`src/components/Insights.tsx`)

#### États Gérés
```typescript
const { insights, loading, error, refreshInsights } = useInsights();
```

#### Interface Améliorée
- **Header dynamique** avec informations de l'entreprise
- **Badge** pour les données de démonstration
- **Bouton d'actualisation** avec indicateur de chargement
- **Skeletons** pendant le chargement
- **Gestion d'erreurs** avec possibilité de réessayer

### 3. **Composant NoAnalysisMessage** (`src/components/NoAnalysisMessage.tsx`)

#### Interface Guidée
- **Message d'alerte** explicatif
- **Carte d'action** pour commencer l'analyse
- **Fonctionnalités** disponibles
- **Étapes** pour commencer
- **Bouton d'action** vers l'analyse

## 🔄 Flux de Données

### **1. Sauvegarde de l'Analyse**
```typescript
// Dans use-sector-analysis.ts
const result = await geminiService.generateComparativeAnalysis(companyData);
setAnalysis(result.analysis);
setIsDemoData(result.isDemoData);

// Sauvegarder la dernière analyse dans le localStorage
try {
  localStorage.setItem('lastAnalysis', JSON.stringify(result.analysis));
} catch (error) {
  console.error('Error saving analysis to localStorage:', error);
}
```

### **2. Récupération des Insights**
```typescript
// Dans use-insights.ts
const getLastAnalysis = (): ComparativeAnalysis | null => {
  try {
    const stored = localStorage.getItem('lastAnalysis');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch (error) {
    console.error('Error parsing last analysis:', error);
    return null;
  }
};
```

### **3. Transformation des Données**
```typescript
const transformAnalysisToInsights = (analysis: ComparativeAnalysis): InsightData => {
  // Extraire les données de croissance
  const growthMetrics = analysis.growthMetrics || [];
  const currentGrowth = growthMetrics.find(m => m.name === 'Croissance actuelle')?.value || 0;
  const projectedGrowth = growthMetrics.find(m => m.name === 'Croissance projetée')?.value || 0;
  
  // Générer les projections mensuelles
  const monthlyProjections = [];
  const baseGrowth = parseFloat(currentGrowth.toString()) || 0;
  const targetGrowth = parseFloat(projectedGrowth.toString()) || 0;
  
  for (let i = -12; i <= 12; i++) {
    const month = i < 0 ? `M${i}` : i === 0 ? 'M' : `M+${i}`;
    const growth = Math.max(0, baseGrowth + (targetGrowth - baseGrowth) * (i + 12) / 24);
    monthlyProjections.push({ month, growth: Math.round(growth * 10) / 10 });
  }

  // Calculer les indicateurs de benchmark
  const benchmarkMetrics = analysis.benchmarkMetrics || [];
  const sectorGrowth = benchmarkMetrics.find(m => m.name === 'Croissance sectorielle')?.value || 0;
  const sectorGrowthValue = parseFloat(sectorGrowth.toString()) || 0;
  const gap = baseGrowth - sectorGrowthValue;

  // Calculer le niveau de risque
  const riskLevel = gap > 5 ? 'Bas' : gap > 0 ? 'Modéré' : 'Élevé';
  const riskPercentage = Math.max(0, Math.min(100, 100 - (gap * 10)));

  return {
    growthData: {
      current: baseGrowth,
      projected12Months: targetGrowth,
      minGrowth: Math.min(...monthlyProjections.map(p => p.growth)),
      maxGrowth: Math.max(...monthlyProjections.map(p => p.growth)),
      evolution12Months: targetGrowth - baseGrowth,
      monthlyProjections
    },
    // ... autres données
  };
};
```

## 📊 Visualisations Dynamiques

### **1. Graphique de Croissance Prévisionnelle**
```typescript
<LineChart data={insights.growthData.monthlyProjections}>
  <XAxis dataKey="month" hide />
  <YAxis domain={[0, Math.max(35, insights.growthData.maxGrowth + 5)]} tickFormatter={v => `${v}%`} />
  <RechartsTooltip />
  <RechartsLegend />
  <Line type="monotone" dataKey="growth" stroke="#2563eb" strokeWidth={2} dot={false} />
</LineChart>
```

### **2. Benchmark Sectoriel**
```typescript
<BarChart data={insights.benchmarkData.indicators}>
  <XAxis dataKey="indicator" />
  <YAxis />
  <RechartsTooltip />
  <RechartsLegend />
  <Bar dataKey="company" fill="#2563eb" />
  <Bar dataKey="sector" fill="#059669" />
</BarChart>
```

### **3. Score de Risque IA**
```typescript
<circle 
  cx="48" 
  cy="48" 
  r="40" 
  stroke={insights.aiScores.riskScore.value === 'Bas' ? '#059669' : 
          insights.aiScores.riskScore.value === 'Modéré' ? '#f59e0b' : '#dc2626'} 
  strokeWidth="12" 
  fill="none" 
  strokeDasharray="251.2" 
  strokeDashoffset={251.2 - (insights.aiScores.riskScore.percentage * 251.2 / 100)} 
  strokeLinecap="round" 
/>
```

## 🎨 Interface Utilisateur

### **Header Dynamique**
```typescript
<h1 className="text-2xl font-bold text-foreground">Insights IA</h1>
<p className="text-muted-foreground">
  Analyse avancée et recommandations générées par l'IA
  {insights && (
    <span className="ml-2">
      • {insights.metadata.companyName} ({insights.metadata.sector})
    </span>
  )}
</p>
```

### **Badge Données de Démo**
```typescript
{insights?.metadata.isDemoData && (
  <Badge variant="secondary" className="flex items-center gap-1">
    <Info className="h-3 w-3" />
    Données de démo
  </Badge>
)}
```

### **Bouton d'Actualisation**
```typescript
<Button variant="outline" size="sm" onClick={refreshInsights} disabled={loading}>
  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
  Actualiser
</Button>
```

## 🔧 Gestion des États

### **1. État de Chargement**
```typescript
{loading && (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-28" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  </div>
)}
```

### **2. État d'Erreur**
```typescript
{error && (
  <Alert variant="destructive" className="mb-8">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      {error}
      <Button 
        variant="link" 
        className="p-0 h-auto ml-2" 
        onClick={refreshInsights}
      >
        Réessayer
      </Button>
    </AlertDescription>
  </Alert>
)}
```

### **3. État Sans Données**
```typescript
{!loading && !error && !insights && (
  <NoAnalysisMessage onStartAnalysis={onBack} />
)}
```

## 📈 Métriques Calculées

### **1. Croissance Prévisionnelle**
- **Croissance actuelle** : Valeur extraite de l'analyse
- **Croissance projetée** : Objectif sur 12 mois
- **Min/Max** : Valeurs extrêmes des projections
- **Évolution** : Différence entre projeté et actuel

### **2. Benchmark Sectoriel**
- **Croissance PME** : Performance de l'entreprise
- **Croissance secteur** : Moyenne sectorielle
- **Écart** : Différence positive/négative
- **Niveau de risque** : Bas/Modéré/Élevé selon l'écart

### **3. Scores IA**
- **Score de risque** : Calculé selon l'écart sectoriel
- **Probabilité d'atteinte** : Basée sur la performance relative
- **Recommandations** : Extraites de l'analyse
- **Opportunités** : Détectées par l'IA

## 🔄 Persistance des Données

### **localStorage**
```typescript
// Sauvegarde
localStorage.setItem('lastAnalysis', JSON.stringify(analysis));

// Récupération
const stored = localStorage.getItem('lastAnalysis');
const analysis = stored ? JSON.parse(stored) : null;
```

### **Gestion d'Erreurs**
```typescript
try {
  localStorage.setItem('lastAnalysis', JSON.stringify(result.analysis));
} catch (error) {
  console.error('Error saving analysis to localStorage:', error);
  // Continuer sans sauvegarder
}
```

## 🎯 Résultats Attendus

✅ **Données réelles** : Plus de données mockées
✅ **Persistance** : Sauvegarde automatique des analyses
✅ **Interface dynamique** : Adaptation au contenu
✅ **Gestion d'erreurs** : Robustesse améliorée
✅ **Expérience utilisateur** : Guidage pour les nouveaux utilisateurs
✅ **Actualisation** : Possibilité de recharger les données

## 🔮 Évolutions Futures

### **Fonctionnalités Avancées**
- **Historique** : Plusieurs analyses sauvegardées
- **Comparaison** : Entre différentes périodes
- **Export** : Des insights en PDF/Excel
- **Notifications** : Alertes sur les changements

### **Améliorations Techniques**
- **Cache intelligent** : Gestion de la mémoire
- **Synchronisation** : Avec une base de données
- **API** : Endpoints dédiés aux insights
- **Webhooks** : Notifications en temps réel

### **Analytics**
- **Suivi d'usage** : Métriques d'utilisation
- **A/B testing** : Optimisation de l'interface
- **Feedback** : Système de notation
- **Amélioration continue** : Apprentissage des préférences 