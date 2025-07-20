# SME Growth Predictor & Business Plan Generator (SGPBG)

## Présentation

**SME Prediktor** est une application web innovante qui démocratise l'accès aux outils d'analyse prédictive et de planification stratégique pour les PME africaines. Grâce à l'intelligence artificielle, elle permet de prédire la croissance des entreprises et de générer automatiquement des business plans professionnels, facilitant ainsi la prise de décision et l'accès au financement.

## Objectifs
- Prédire la croissance potentielle des PME à partir de leurs données historiques
- Générer des business plans structurés et personnalisés en quelques minutes
- Offrir une interface simple, multilingue et adaptée au contexte africain
- Professionnaliser les dossiers pour améliorer l'accès au financement

## Fonctionnalités principales
- **Dashboard** : Vue d'ensemble des métriques clés, graphiques de tendance, alertes IA
- **Collecte de données** : Formulaires intelligents, import Google Sheets, connexion Google Analytics
- **Analyse prédictive** : Prédiction de croissance (6, 12, 24 mois), analyse de risques, recommandations stratégiques
- **Générateur de Business Plan** : Sections modulaires (executive summary, analyse de marché, projections financières...), génération IA (Gemini API), export PDF/Word/Google Docs
- **Paramètres** : Gestion du profil, entreprise, notifications, intégrations (Google Sheets, Analytics, Gemini), sécurité (2FA, rétention des données)

## Technologies utilisées
- **Frontend** : React 18, Vite, TypeScript
- **UI** : shadcn/ui, Tailwind CSS
- **State Management** : Zustand ou Redux Toolkit
- **API Client** : Axios ou React Query
- **Backend (prévu)** : Django REST Framework, PostgreSQL, Celery, Redis
- **Intégrations IA & Cloud** : Google Gemini API, Google Sheets API, Google Analytics API

## Installation & Démarrage

### Prérequis
- Node.js >= 18.x
- npm >= 9.x

### Étapes
```sh
# 1. Cloner le dépôt
git clone https://github.com/ArnaudJunior/prediktor.git
cd prediktor

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173) par défaut.

## Structure du projet
```
afro-growth-spark/
├── public/                # Fichiers statiques
├── src/
│   ├── components/        # Composants UI (Dashboard, DataForm, BusinessPlan, Settings...)
│   ├── hooks/             # Hooks personnalisés
│   ├── lib/               # Fonctions utilitaires
│   ├── pages/             # Pages principales (Index, NotFound)
│   ├── App.tsx            # Point d'entrée principal
│   └── main.tsx           # Bootstrap React
├── tailwind.config.ts     # Configuration Tailwind
├── package.json           # Dépendances et scripts
└── README.md              # Ce fichier
```

## Contribution
Les contributions sont les bienvenues !
- Forkez le projet
- Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
- Commitez vos modifications (`git commit -am 'Ajout d'une fonctionnalité'`)
- Poussez la branche (`git push origin feature/ma-fonctionnalite`)
- Ouvrez une Pull Request

## Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

## Contact
Pour toute question ou suggestion :
- **Auteur** : Nova-Tech

---

*SGPBG – Démocratiser l'accès à l'analyse prédictive et à la planification stratégique pour les PME africaines.*
