# 💩 Poop in My Hands - Jeu JavaScript Rétro

## Description

**Poop in My Hands** est un jeu JavaScript au style rétro pixelisé où le joueur doit éviter que des cacas tombant du ciel touchent sa tête, tout en essayant d'en attraper le maximum avec ses mains pour marquer des points.

## 🎮 Gameplay

- **Objectif** : Attrapez le caca avec vos mains pour marquer des points
- **Condition de défaite** : Le jeu se termine si un caca touche votre tête
- **Contrôles** : Utilisez les flèches ← → pour déplacer votre personnage
- **Score** : Chaque caca attrapé avec les mains rapporte 10 points
- **Difficulté progressive** : La vitesse du jeu augmente avec le score

## 🚀 Fonctionnalités

### ✨ Fonctionnalités de Base

- **Moteur de jeu fluide** avec boucle de rendu optimisée
- **Système de collision précis** avec zones distinctes (tête vs mains)
- **Graphismes pixelisés** dans un style rétro authentique
- **Effets de particules** lors de la capture des objets
- **Système de pause** avec la barre d'espace

### 🏆 Système de Score

- **Tableau des records** local (localStorage)
- **Sauvegarde automatique** des 5 meilleurs scores
- **Interface de saisie** du nom du joueur pour les nouveaux records
- **Affichage en temps réel** du score actuel et du meilleur score

### 🎨 Interface Utilisateur

- **Design rétro** avec police Press Start 2P
- **Animations CSS** avec effets de brillance et transitions
- **Modal de fin de partie** avec options de redémarrage
- **Interface responsive** adaptée aux différentes tailles d'écran

## 🛠️ Architecture Technique

### Structure du Projet

```
game-test-v2/
├── index.html          # Structure HTML principale
├── style.css           # Styles CSS rétro pixelisés
├── game.js            # Moteur de jeu JavaScript
├── README.md          # Documentation (ce fichier)
└── LICENSE            # Licence MIT
```

### Technologies Utilisées

- **HTML5 Canvas** pour le rendu graphique
- **JavaScript ES6+** avec classes et modules
- **CSS3** avec animations et transformations
- **LocalStorage** pour la persistance des données
- **Press Start 2P** police Google Fonts pour l'authenticité rétro

### Principes de Développement

Le code suit les **principes SOLID** :

- **Single Responsibility** : Chaque méthode a une responsabilité unique
- **Open/Closed** : Le système est extensible via la configuration
- **Liskov Substitution** : Les objets respectent leurs contrats
- **Interface Segregation** : Interfaces minimales et spécialisées
- **Dependency Inversion** : Dépendances abstraites via configuration

## 📦 Installation et Déploiement

### Prérequis

- Navigateur web moderne supportant HTML5 Canvas
- Serveur web local (optionnel pour le développement)

### Installation

1. **Cloner le repository** :
   ```bash
   git clone https://github.com/rodmtl/game-test-v2.git
   cd game-test-v2
   ```

2. **Ouvrir le jeu** :
   - Option 1 : Ouvrir `index.html` directement dans un navigateur
   - Option 2 : Utiliser un serveur local (recommandé)
     ```bash
     # Avec Python
     python -m http.server 8000
     
     # Avec Node.js
     npx http-server
     
     # Avec Live Server (VS Code)
     # Clic droit sur index.html > "Open with Live Server"
     ```

3. **Accéder au jeu** :
   - Naviguer vers `http://localhost:8000` (si serveur local)
   - Ou ouvrir directement le fichier `index.html`

### Déploiement

Le jeu peut être déployé sur n'importe quelle plateforme d'hébergement statique :

- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Azure Static Web Apps**
- **AWS S3 + CloudFront**

## 🎯 Configuration et Personnalisation

### Paramètres de Jeu

Les paramètres du jeu peuvent être modifiés dans la classe `PoopInMyHandsGame` :

```javascript
this.config = {
    player: {
        width: 60,           // Largeur du joueur
        height: 80,          // Hauteur du joueur
        speed: 5,            // Vitesse de déplacement
        headHeight: 20,      // Hauteur de la zone de la tête
        handWidth: 15,       // Largeur des mains
        handHeight: 15       // Hauteur des mains
    },
    poop: {
        width: 25,           // Largeur des objets
        height: 30,          // Hauteur des objets
        minSpeed: 2,         // Vitesse minimale de chute
        maxSpeed: 6,         // Vitesse maximale de chute
        spawnRate: 0.02      // Taux d'apparition
    }
};
```

### Personnalisation Visuelle

- **Couleurs** : Modifiables dans `style.css`
- **Animations** : Ajustables via les keyframes CSS
- **Taille du canvas** : Configurable dans `index.html` et `game.js`

## 🧪 Tests et Qualité

### Tests Manuels Recommandés

1. **Contrôles** :
   - ✅ Déplacement avec les flèches gauche/droite
   - ✅ Pause avec la barre d'espace
   - ✅ Boutons de l'interface

2. **Gameplay** :
   - ✅ Collision tête = Game Over
   - ✅ Collision mains = Points
   - ✅ Augmentation de la difficulté

3. **Interface** :
   - ✅ Affichage du score en temps réel
   - ✅ Sauvegarde des records
   - ✅ Modal de fin de partie

### Métriques de Performance

- **FPS** : ~60 fps stable sur navigateurs modernes
- **Mémoire** : Gestion automatique avec nettoyage des objets
- **Responsive** : Compatible mobile et desktop

## 🔧 Maintenance et Support

### Problèmes Connus

- **Performance** : Peut ralentir avec de très nombreux objets simultanés
- **Mobile** : Contrôles tactiles non implémentés (amélioration future)

### Améliorations Futures

- [ ] Contrôles tactiles pour mobile
- [ ] Sons et effets sonores
- [ ] Modes de jeu supplémentaires
- [ ] Multijoueur local
- [ ] Sauvegarde cloud des scores

## 👥 Contribution

### Processus de Contribution

1. **Fork** le repository
2. **Créer une branche** pour votre fonctionnalité
3. **Commiter** vos changements
4. **Pousser** vers votre fork
5. **Créer une Pull Request**

### Standards de Code

- **ESLint** : Configuration recommandée
- **Prettier** : Formatage automatique
- **JSDoc** : Documentation des fonctions
- **Tests** : Ajout de tests pour nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **Police Press Start 2P** : Google Fonts
- **Inspiration** : Jeux arcade classiques des années 80-90
- **Communauté** : JavaScript et développement web

---

**Architecte DevOps** : Rodrigo Riveros-Vanegas  
**Version** : 1.0.0  
**Date** : Septembre 2025

*Développé avec ❤️ en suivant les meilleures pratiques DevOps et les principes SOLID*
