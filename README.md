# ✦ Lumina — Plateforme Photographique & Recettes de Retouche

Une application fullstack moderne, élégante et minimaliste (type Squarespace) conçue en **Next.js (App Router, TypeScript)**, **Tailwind CSS**, et **Prisma ORM**.

Elle combine un **portfolio photographique d'art**, un **comparateur interactif Avant / Après** pour commercialiser vos presets et recettes de retouche, et un **espace d'administration sécurisé** avec extraction automatique des données EXIF.

---

## ✨ Fonctionnalités Clés

- 📐 **Direction Artistique Éditoriale (Squarespace)** : Fonds clairs et chaleureux, typographie soignée (*Playfair Display* & *Plus Jakarta Sans*), grands espaces de respiration, grilles asymétriques dynamiques.
- 🎛️ **Curseur Interactif Avant / Après** : Comparateur fluide tactile et souris permettant aux visiteurs de prévisualiser l'impact de chaque recette sur un fichier RAW brut avant d'acheter.
- 🛍️ **Boutique Numérique & Presets** : Vente automatisée de packs Lightroom (`.xmp`, `.dng` mobile + guide PDF) connectable à Lemon Squeezy ou Stripe.
- 📸 **Extraction Automatique des Données EXIF** : Détection instantanée dès le glisser-déposer (boîtier, objectif, ouverture `f/`, vitesse d'obturation, sensibilité ISO).
- 🔐 **Espace Admin Monoutilisateur (`/admin`)** : Tableau de bord privé pour téléverser vos clichés, ordonner vos séries, créer des recettes et gérer les demandes de tirages d'art.
- 🖼️ **Visionneuse Plein Écran (Lightbox)** : Navigation clavier (`Flèches`, `Échap`), affichage escamotable des réglages de prise de vue et téléchargement HD.
- ✉️ **Demandes de Tirages d'Art** : Formulaire dédié prérempli par cliché pour recevoir des commandes d'épreuves physiques personnalisées.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Initialisation de la base de données
```bash
# Génère le client Prisma et initialise la base SQLite
npx prisma db push

# Remplit la base avec les séries, clichés et recettes d'exemple
node prisma/seed.js
```

### 3. Lancer l'application en mode développement
```bash
npm run dev
# ou avec Turbopack :
npx next dev --turbo -p 3000
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

---

## 🔑 Accès à l'Espace Administrateur

- **URL du Back-office** : [http://localhost:3000/admin](http://localhost:3000/admin)
- **Mot de passe par défaut** : `lumina-secret-2026` *(modifiable dans le fichier `.env` via `ADMIN_PASSWORD`)*

---

## 🧪 Tests Automatisés

Le projet comprend une suite de tests unitaires et d'intégration validant les frontières (*seams*) d'authentification et de persistance des données :
```bash
npm test
```

---

## 📁 Structure du Projet

```text
├── prisma/
│   ├── schema.prisma       # Modèles Photo, Series, Recipe, PrintInquiry
│   └── seed.js             # Données d'exemple initiales
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Navigation principale et structure globale
│   │   ├── page.tsx        # Accueil & Portfolio éditorial
│   │   ├── recettes/       # Boutique des Recettes avec comparateur Avant/Après
│   │   ├── series/[slug]/  # Pages dédiées aux séries photographiques
│   │   ├── a-propos/       # Biographie, matériel et commande de tirages
│   │   ├── admin/          # Espace d'administration et page de login
│   │   └── api/            # Routes API sécurisées (photos, recipes, auth, inquiries)
│   ├── components/
│   │   ├── BeforeAfterSlider.tsx  # Slider interactif Avant/Après
│   │   ├── LightboxModal.tsx      # Visionneuse plein écran avec EXIF
│   │   └── GalleryView.tsx        # Grille asymétrique Squarespace
│   └── lib/
│       ├── auth.ts         # Authentification monoutilisateur & sessions chiffrées
│       └── prisma.ts       # Client Prisma ORM singleton
├── test/                   # Suite de tests automatisés
├── docs/
│   ├── spec.md             # Spécification technique complète
│   └── adr/                # Décisions d'architecture (0001 à 0005)
├── GLOSSARY.md             # Glossaire officiel du domaine
└── package.json
```

---

## 🌐 Déploiement en Production sur Vercel

1. Poussez le dépôt sur votre compte GitHub.
2. Importez le projet sur [Vercel](https://vercel.com).
3. Ajoutez les variables d'environnement dans les paramètres de votre projet Vercel :
   * `ADMIN_PASSWORD` : Votre mot de passe sécurisé pour l'admin.
   * `SESSION_SECRET` : Une chaîne de caractères aléatoire pour signer la session.
   * `DATABASE_URL` : URL de votre base de données PostgreSQL (ex: Supabase ou Turso).
   * *(Optionnel)* `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
