# 🚀 Prediktor - Analyse Prédictive & Business Plan IA pour PME Africaines

## 📋 Présentation

**Prediktor** est une application web révolutionnaire qui démocratise l'accès aux outils d'analyse prédictive et de planification stratégique pour les PME africaines. Grâce à l'intelligence artificielle (Google Gemini), elle permet de prédire la croissance des entreprises, générer des analyses sectorielles détaillées et créer automatiquement des business plans professionnels, facilitant ainsi la prise de décision et l'accès au financement.

## 🎯 Objectifs du Projet

- **Prédire la croissance** des PME à partir de leurs données historiques
- **Générer des analyses sectorielles** complètes avec comparaisons concurrentielles
- **Créer des business plans** structurés et personnalisés en quelques minutes
- **Offrir une interface moderne** et adaptée au contexte africain
- **Personnaliser les recommandations** selon le profil de l'entreprise
- **Faciliter l'accès au financement** avec des dossiers professionnels

## ✨ Fonctionnalités Développées

### 🏠 **Dashboard Intelligent**
- **Vue d'ensemble** des métriques clés de l'entreprise
- **Graphiques interactifs** de tendances et performances
- **Alertes IA** pour les opportunités et risques
- **Navigation intuitive** entre les différents modules
- **Indicateurs de santé** financière en temps réel

### 📊 **Collecte de Données Avancée**
- **Saisie manuelle** avec validation intelligente
- **Import Google Sheets** avec simulation de données
- **Connexion Google Analytics** pour données web
- **Données de test** pour démonstration
- **Validation en temps réel** des entrées utilisateur

### 🔍 **Analyse Sectorielle Complète**
- **Score de santé global** (0-100) avec métriques détaillées
- **Position concurrentielle** (leader, strong, average, weak, struggling)
- **Comparaisons sectorielles** avec graphiques interactifs
- **Tendances du marché** et opportunités identifiées
- **Recommandations stratégiques** immédiates, court et long terme
- **Graphiques détaillés** :
  - Comparaison des métriques (rentabilité, efficacité, croissance)
  - Tendances de rentabilité sur 4 ans
  - Positionnement concurrentiel

### 📈 **Plan d'Action Personnalisé**
- **Objectifs stratégiques** adaptés au score de santé
- **Actions concrètes** par catégorie (Marketing, Opérations, Finance, RH)
- **Timeline d'exécution** en 3 phases (1-3 mois, 3-6 mois, 6-12 mois)
- **Suivi des actions** avec système de checkboxes
- **Actions spécifiques** au secteur et au pays de l'entreprise
- **Recommandations personnalisées** basées sur le profil de l'entreprise et le score de santé

### ⚙️ **Système de Paramètres Complet**
- **Profil utilisateur** avec informations personnelles
- **Informations d'entreprise** (nom, taille, secteur, pays, devise)
- **Gestion des notifications** (email, push, rapports)
- **Intégrations externes** (Google Sheets, Analytics, Gemini API)
- **Sécurité avancée** (2FA, délai de session, rétention données)
- **Indicateur de complétion** du profil (0-100%)

### 🎨 **Interface Utilisateur Moderne**
- **Design responsive** adapté mobile et desktop
- **Thème sombre/clair** avec Tailwind CSS
- **Composants shadcn/ui** pour une UX cohérente
- **Animations fluides** et transitions
- **Feedback utilisateur** avec toasts et notifications

## 🛠️ Technologies Utilisées

### **Frontend**
- **React 18** avec TypeScript pour la robustesse
- **Vite** pour un développement ultra-rapide
- **Tailwind CSS** pour le styling moderne
- **shadcn/ui** pour les composants UI
- **Lucide React** pour les icônes

### **Intégrations IA & APIs**
- **Google Gemini API** pour l'analyse prédictive
- **Google Sheets API** pour l'import de données
- **Google Analytics API** pour les données web
- **Firebase** pour l'authentification et le stockage

### **Gestion d'État & Données**
- **React Hooks** pour la gestion d'état locale
- **Context API** pour l'authentification
- **Firestore** pour la persistance des données
- **Local Storage** pour les préférences utilisateur

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** >= 18.x
- **npm** >= 9.x
- **Clé API Google Gemini** (optionnelle pour les tests)

### Étapes d'installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/ZakyOps/prediktor.git
cd prediktor

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Ajouter votre clé API Gemini : VITE_GEMINI_API_KEY=votre_clé_ici

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

### Configuration Firebase (optionnelle)
```bash
# Créer un projet Firebase et configurer :
# - Authentication (Email/Password)
# - Firestore Database
# - Ajouter les clés dans src/lib/firebase.ts
```

## 📁 Structure du Projet

```
prediktor/
├── public/                    # Fichiers statiques
├── src/
│   ├── components/           # Composants UI
│   │   ├── ui/              # Composants shadcn/ui
│   │   ├── Dashboard.tsx    # Tableau de bord principal
│   │   ├── DataForm.tsx     # Collecte de données
│   │   ├── SectorAnalysis.tsx # Analyse sectorielle
│   │   ├── ActionPlan.tsx   # Plan d'action
│   │   ├── BusinessPlan.tsx # Générateur business plan
│   │   ├── Settings.tsx     # Paramètres utilisateur
│   │   └── Navigation.tsx   # Navigation principale
│   ├── hooks/               # Hooks personnalisés
│   │   ├── use-user-profile.ts
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   ├── services/            # Services et APIs
│   │   ├── gemini.ts       # Service IA Gemini
│   │   ├── auth.ts         # Authentification
│   │   ├── user-profile.ts # Gestion profil
│   │   └── firebase.ts     # Configuration Firebase
│   ├── contexts/           # Contextes React
│   │   └── AuthContext.tsx
│   ├── pages/              # Pages principales
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   └── utils/              # Utilitaires
├── tailwind.config.ts      # Configuration Tailwind
├── package.json           # Dépendances
└── README.md             # Documentation
```

## 🎯 Fonctionnalités Détaillées

### **Analyse Prédictive Intelligente**
- **Algorithme IA** basé sur Google Gemini
- **Données sectorielles** adaptées au contexte africain
- **Comparaisons concurrentielles** avec benchmarks locaux
- **Prédictions de croissance** sur 6, 12, 24 mois
- **Analyse de risques** et opportunités

### **Personnalisation Avancée**
- **Profil utilisateur complet** avec informations d'entreprise
- **Adaptation géographique** selon le pays (Côte d'Ivoire, Sénégal, etc.)
- **Devise locale** (FCFA, EUR, USD, etc.)
- **Secteur d'activité** spécifique
- **Taille d'entreprise** pour recommandations adaptées

### **Génération de Contenu IA**
- **Business plans structurés** avec sections complètes
- **Analyses sectorielles** détaillées
- **Plans d'action** personnalisés et actionnables
- **Recommandations stratégiques** basées sur les données
- **Graphiques et visualisations** automatiques

### **Sécurité et Confidentialité**
- **Authentification Firebase** sécurisée
- **Chiffrement des données** sensibles
- **Gestion des sessions** avec délai d'expiration
- **Rétention des données** configurable
- **Authentification à deux facteurs** (2FA)

## 🔧 Configuration Avancée

### Variables d'Environnement
```env
# Google Gemini API
VITE_GEMINI_API_KEY=votre_clé_gemini

# Firebase (optionnel)
VITE_FIREBASE_API_KEY=votre_clé_firebase
VITE_FIREBASE_AUTH_DOMAIN=votre_domaine.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre_projet_id
VITE_FIREBASE_STORAGE_BUCKET=votre_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
```

### Personnalisation du Thème
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Personnaliser les couleurs du thème
      }
    }
  }
}
```

## 🧪 Tests et Démonstration

### Données de Test
- **Comptes de démonstration** : `test1@gmail.com` / `123456`
- **Données sectorielles** simulées pour tous les secteurs
- **Graphiques interactifs** avec données de démonstration
- **Analyses complètes** sans clé API requise

### Fonctionnalités de Test
- **Import simulé** Google Sheets et Analytics
- **Génération d'analyses** avec données de fallback
- **Plans d'action** avec actions concrètes
- **Interface complète** sans authentification requise

## 🚀 Déploiement

### Production
```bash
# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Déployer sur Vercel/Netlify
npm run deploy
```

### Environnements
- **Développement** : `npm run dev`
- **Production** : `npm run build`
- **Tests** : `npm run test`

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Forkez** le projet
2. **Créez** une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commitez** vos modifications (`git commit -am 'Ajout d'une fonctionnalité'`)
4. **Poussez** la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrez** une Pull Request

### Standards de Code
- **TypeScript** strict
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- **Tests unitaires** pour les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

## 📞 Contact & Support

Pour toute question, suggestion ou support :
- **Auteur** : Nova-Tech
- **Issues** : [GitHub Issues](https://github.com/ZakyOps/prediktor.git/issues)

## 🎉 Remerciements

- **Google Gemini** pour l'API d'intelligence artificielle
- **shadcn/ui** pour les composants UI
- **Tailwind CSS** pour le framework de styling
- **Firebase** pour l'infrastructure backend
- **Communauté React** pour l'écosystème

---

## 🚀 Roadmap

### Version 2.0 (Prévue)
- [ ] **API REST** complète avec Django
- [ ] **Machine Learning** avancé
- [ ] **Intégrations bancaires** pour financement
- [ ] **Application mobile** React Native
- [ ] **Multi-langues** (Anglais, Français, Bambara)

### Version 1.1 (En cours)
- [ ] **Export PDF** des business plans
- [ ] **Notifications push** en temps réel
- [ ] **Dashboard analytics** avancé
- [ ] **Intégrations CRM** (HubSpot, Salesforce)

---

*Prediktor – Démocratiser l'accès à l'analyse prédictive et à la planification stratégique pour les PME africaines.* 🚀
