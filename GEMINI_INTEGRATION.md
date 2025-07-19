# Intégration Gemini API - Analyse Sectorielle

## Vue d'ensemble

Cette intégration utilise l'API Gemini de Google pour générer des analyses sectorielles comparatives et des plans d'action personnalisés pour les PME africaines.

## Fonctionnalités

### 1. Analyse Sectorielle
- **Comparaison des données** : Compare les données de l'entreprise avec les moyennes sectorielles
- **Score de santé** : Calcule un score global de santé de l'entreprise (0-100)
- **Position concurrentielle** : Détermine la position de l'entreprise dans son secteur
- **Graphiques comparatifs** : Visualise les différences avec le secteur

### 2. Plan d'Action Personnalisé
- **Objectifs stratégiques** : Définit des objectifs SMART basés sur l'analyse
- **Actions par catégorie** : Marketing, Opérations, Finance
- **Timeline d'exécution** : Phases immédiate, court terme, long terme
- **Suivi des progrès** : Interface interactive pour marquer les actions complétées

### 3. Recommandations IA
- **Actions immédiates** : Priorités à traiter dans les 1-3 mois
- **Actions court terme** : Objectifs 3-6 mois
- **Actions long terme** : Stratégies 6-12 mois

## Architecture

### Services
- `src/services/gemini.ts` : Service principal pour l'API Gemini
- `src/hooks/use-sector-analysis.ts` : Hook personnalisé pour la gestion d'état

### Composants
- `src/components/SectorAnalysis.tsx` : Affichage de l'analyse sectorielle
- `src/components/ActionPlan.tsx` : Plan d'action interactif
- `src/components/DataForm.tsx` : Saisie des données (modifié)

### Types TypeScript
```typescript
interface CompanyData {
  year: string;
  revenue: number;
  expenses: number;
  employees: number;
  sector: string;
  market: string;
}

interface SectorData {
  sector: string;
  averageRevenue: number;
  averageExpenses: number;
  averageEmployees: number;
  growthRate: number;
  marketSize: number;
  keyMetrics: {
    profitability: number;
    efficiency: number;
    marketShare: number;
  };
  trends: string[];
  challenges: string[];
  opportunities: string[];
}

interface HealthScore {
  overall: number;
  profitability: number;
  efficiency: number;
  growth: number;
  marketPosition: number;
  details: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}
```

## Configuration

### Variables d'environnement
Créer un fichier `.env` à la racine du projet :
```env
VITE_GEMINI_API_KEY=AIzaSyCM6LIoA2o-qgnEy226RR8yq_vpQlJS9SU
```

### Configuration Vite
Le fichier `vite.config.ts` a été modifié pour supporter les variables d'environnement :
```typescript
export default defineConfig({
  // ...
  define: {
    'process.env': {}
  },
  envPrefix: 'VITE_'
})
```

## Utilisation

### 1. Saisie des Données
L'utilisateur saisit ses données financières dans le formulaire :
- Année
- Chiffre d'affaires (FCFA)
- Charges totales (FCFA)
- Nombre d'employés
- Secteur d'activité
- Marché principal

### 2. Génération de l'Analyse
- Validation des données
- Appel à l'API Gemini pour l'analyse sectorielle
- Calcul du score de santé
- Génération des recommandations

### 3. Visualisation
- Graphiques comparatifs (Recharts)
- Score de santé avec indicateurs visuels
- Position concurrentielle
- Tendances du secteur

### 4. Plan d'Action
- Génération automatique basée sur l'analyse
- Interface interactive pour le suivi
- Export et partage

## API Gemini

### Endpoints utilisés
- `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

### Prompts personnalisés
1. **Analyse sectorielle** : Données du secteur avec contexte africain
2. **Score de santé** : Calcul basé sur les métriques comparatives
3. **Plan d'action** : Recommandations stratégiques personnalisées

### Gestion des erreurs
- Timeout des requêtes
- Retry automatique
- Messages d'erreur utilisateur
- Fallback vers des données simulées

## Graphiques et Visualisations

### Technologies utilisées
- **Recharts** : Graphiques React
- **Types de graphiques** :
  - BarChart : Comparaisons sectorielles
  - LineChart : Tendances temporelles
  - PieChart : Répartition des scores
  - Progress : Indicateurs de progression

### Métriques affichées
- Score de santé global
- Position concurrentielle
- Comparaison revenus/charges
- Rentabilité vs secteur
- Efficacité opérationnelle

## Sécurité et Performance

### Sécurité
- Clé API dans les variables d'environnement
- Validation des données côté client
- Gestion des erreurs API

### Performance
- Lazy loading des composants
- Mise en cache des analyses
- Optimisation des requêtes API

## Développement

### Installation des dépendances
```bash
npm install
```

### Démarrage en développement
```bash
npm run dev
```

### Variables d'environnement requises
- `VITE_GEMINI_API_KEY` : Clé API Gemini

## Améliorations futures

### Fonctionnalités prévues
1. **Import de données** : Google Sheets, Excel
2. **Historique des analyses** : Sauvegarde et comparaison temporelle
3. **Alertes intelligentes** : Notifications basées sur les métriques
4. **Collaboration** : Partage d'analyses avec l'équipe
5. **Intégration CRM** : Synchronisation avec les outils existants

### Optimisations techniques
1. **Cache intelligent** : Mise en cache des données sectorielles
2. **Analyse en temps réel** : Mise à jour automatique des métriques
3. **API REST** : Backend dédié pour la persistance
4. **Machine Learning** : Modèles prédictifs personnalisés

## Support

Pour toute question ou problème :
1. Vérifier la configuration des variables d'environnement
2. Consulter les logs de la console pour les erreurs API
3. Tester avec des données de démonstration
4. Contacter l'équipe de développement 