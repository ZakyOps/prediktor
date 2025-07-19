# Guide de Test - Intégration Gemini API

## 🚀 Démarrage Rapide

### 1. Configuration
1. Créer le fichier `.env` à la racine du projet :
```env
VITE_GEMINI_API_KEY=AIzaSyCM6LIoA2o-qgnEy226RR8yq_vpQlJS9SU
```

2. Installer les dépendances :
```bash
npm install
```

3. Lancer l'application :
```bash
npm run dev
```

### 2. Test Rapide
1. Ouvrir l'application dans le navigateur
2. Aller dans "Saisir Données"
3. Cliquer sur "Charger Données Test"
4. Cliquer sur "Générer l'Analyse Sectorielle"
5. Attendre la génération de l'analyse par Gemini
6. Explorer les résultats et le plan d'action

## 🧪 Tests Détaillés

### Test 1 : Analyse Sectorielle Basique
**Objectif** : Vérifier que l'API Gemini génère une analyse complète

**Étapes** :
1. Utiliser les données de test "Technologie" (50M FCFA)
2. Vérifier que l'analyse contient :
   - Score de santé (0-100)
   - Position concurrentielle
   - Données sectorielles
   - Graphiques comparatifs

**Résultats attendus** :
- ✅ Analyse générée en < 30 secondes
- ✅ Score de santé cohérent
- ✅ Graphiques affichés correctement
- ✅ Recommandations pertinentes

### Test 2 : Plan d'Action Personnalisé
**Objectif** : Vérifier la génération du plan d'action par Gemini

**Étapes** :
1. Après l'analyse, cliquer sur "Plan d'Action"
2. Cliquer sur "Générer le Plan d'Action"
3. Vérifier le contenu généré

**Résultats attendus** :
- ✅ Plan généré en < 20 secondes
- ✅ Objectifs SMART avec métriques
- ✅ Actions par catégorie (Marketing, Opérations, Finance, RH)
- ✅ Timeline en 3 phases
- ✅ Actions interactives (checkboxes)

### Test 3 : Différents Secteurs
**Objectif** : Tester la pertinence selon le secteur

**Secteurs à tester** :
- Technologie (50M FCFA, 25 employés)
- Commerce (15M FCFA, 8 employés)
- Services (80M FCFA, 45 employés)
- Agriculture (25M FCFA, 15 employés)

**Vérifications** :
- ✅ Données sectorielles adaptées
- ✅ Recommandations spécifiques au secteur
- ✅ Contexte africain respecté

### Test 4 : Gestion des Erreurs
**Objectif** : Vérifier la robustesse de l'application

**Tests d'erreur** :
1. **Clé API invalide** : Modifier la clé API dans `.env`
2. **Données invalides** : Saisir des montants négatifs
3. **Réseau défaillant** : Désactiver internet temporairement

**Résultats attendus** :
- ✅ Messages d'erreur clairs
- ✅ Possibilité de réessayer
- ✅ Pas de crash de l'application

## 📊 Métriques de Performance

### Temps de Réponse
- **Analyse sectorielle** : < 30 secondes
- **Plan d'action** : < 20 secondes
- **Chargement initial** : < 3 secondes

### Qualité des Réponses
- **Pertinence** : Recommandations adaptées au contexte
- **Cohérence** : Données logiques entre les sections
- **Complétude** : Toutes les sections remplies

## 🔧 Debugging

### Logs à Surveiller
```javascript
// Dans la console du navigateur
console.log('Gemini API Response:', response);
console.log('Analysis Data:', analysis);
console.log('Action Plan:', actionPlan);
```

### Erreurs Communes
1. **"VITE_GEMINI_API_KEY is not defined"**
   - Vérifier le fichier `.env`
   - Redémarrer le serveur de développement

2. **"HTTP error! status: 400"**
   - Vérifier la validité de la clé API
   - Contrôler les quotas Gemini

3. **"JSON parse error"**
   - Vérifier le format de réponse de Gemini
   - Contrôler les prompts dans le service

### Outils de Debug
- **Network Tab** : Surveiller les appels API
- **Console** : Voir les erreurs et logs
- **React DevTools** : Inspecter l'état des composants

## 📈 Améliorations Suggérées

### Performance
- [ ] Cache des analyses sectorielles
- [ ] Optimisation des prompts
- [ ] Lazy loading des graphiques

### Fonctionnalités
- [ ] Historique des analyses
- [ ] Export PDF/Excel
- [ ] Comparaison temporelle
- [ ] Alertes intelligentes

### UX/UI
- [ ] Indicateurs de progression détaillés
- [ ] Animations de chargement
- [ ] Mode sombre
- [ ] Responsive design amélioré

## 🐛 Troubleshooting

### Problème : Analyse ne se génère pas
**Solutions** :
1. Vérifier la clé API dans `.env`
2. Contrôler la console pour les erreurs
3. Vérifier la connexion internet
4. Redémarrer le serveur de développement

### Problème : Plan d'action vide
**Solutions** :
1. Vérifier que l'analyse a été générée
2. Contrôler les logs de l'API Gemini
3. Vérifier le format JSON de la réponse

### Problème : Graphiques ne s'affichent pas
**Solutions** :
1. Vérifier l'installation de Recharts
2. Contrôler les données des graphiques
3. Vérifier la console pour les erreurs

## 📞 Support

En cas de problème :
1. Consulter les logs de la console
2. Vérifier la documentation Gemini
3. Tester avec les données de test fournies
4. Contacter l'équipe de développement 