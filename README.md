# ✦ Lumina — Galerie Photo Moderne

Une galerie photographique interactive, fluide et entièrement responsive, développée en **HTML5 / CSS3 / JavaScript (Vanilla)** sans aucune dépendance externe.

![Aperçu de la Galerie Lumina](https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Fonctionnalités Principales

- 🎨 **Design Moderne & Épuré** : Interface sombre (dark mode) par défaut avec bascule fluide vers le mode clair (light mode).
- 📐 **Affichage Flexible** :
  - **Vue Masonry** (colonnes automatiques selon la hauteur des clichés).
  - **Vue Grille Carrée** (format carré uniforme).
- 🏷️ **Filtres par Catégorie** : Nature & Paysages, Architecture, Voyages, Portraits, Street & Vie urbaine.
- ❤️ **Système de Favoris** : Enregistrement local des clichés coup de cœur avec compteur en temps réel.
- 🔍 **Recherche Instantanée** : Filtre en direct par titre, photographe, tags ou lieu géographique.
- 🖼️ **Visionneuse Plein Écran (Lightbox)** :
  - Clichés en haute définition.
  - Navigation au clavier (`Flèche droite` / `Flèche gauche`, touche `Échap`).
  - Affichage des métadonnées (titre, auteur, lieu, date, tags).
  - Bouton de téléchargement direct.
- ➕ **Ajout de Photos Personnalisées** :
  - Par URL d'image web.
  - Par téléversement de fichier local depuis votre ordinateur (stocké via `FileReader` et `localStorage`).
- ⚡ **100% Autonome** : Aucun serveur ou compilation nécessaire (`npm` non requis).

---

## 🚀 Démarrage Rapide

### 1. Ouvrir directement en local
Double-cliquez simplement sur le fichier `index.html` dans votre navigateur préféré (Chrome, Safari, Firefox, Edge).

### 2. Ou lancer un serveur local rapide (Python)
Dans votre terminal :
```bash
python3 -m http.server 8080
```
Puis rendez-vous sur [http://localhost:8080](http://localhost:8080).

---

## 🌐 Déploiement Gratuit sur GitHub Pages

Pour mettre votre galerie en ligne gratuitement :

1. Poussez ce dépôt sur votre compte GitHub (voir instructions ci-dessous).
2. Rendez-vous sur votre dépôt GitHub : **Settings** > **Pages**.
3. Dans **Build and deployment** :
   - Source : `Deploy from a branch`
   - Branch : `main` / dossier `/ (root)`
   - Cliquez sur **Save**.
4. Votre galerie sera accessible publiquement en quelques secondes à l'adresse :
   `https://<votre-pseudo-github>.github.io/<nom-du-repo>/`

---

## 📁 Structure du Projet

```text
├── index.html            # Structure HTML sémantique et accessibilité
├── css/
│   └── style.css         # Styles, variables CSS, animations & responsive
├── js/
│   ├── gallery-data.js   # Données des photographies initiales (Unsplash HD)
│   └── app.js            # Filtres, recherche, lightbox, upload, favoris
├── .gitignore            # Fichiers ignorés par Git
└── README.md             # Documentation
```

---

## 🛠️ Personnalisation

- **Changer les photos de départ** : Modifiez le fichier `js/gallery-data.js` pour ajouter vos propres images et métadonnées.
- **Ajouter vos propres polices ou couleurs** : Ajustez les variables `:root` dans `css/style.css`.
