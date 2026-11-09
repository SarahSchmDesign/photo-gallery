# Spécification Technique — Plateforme Lumina (Portfolio & Boutique de Recettes)

## Problem Statement

En tant que photographe d'art et créatrice, Sarah a besoin d'une présence en ligne professionnelle, minimaliste et sans distraction (type Squarespace) qui mette en valeur ses clichés sans surcharge visuelle.

Actuellement, elle ne dispose pas de back-end lui permettant :
1. D'ajouter, réorganiser et mettre à jour ses clichés de manière autonome sans manipuler de code ou de fichiers de configuration.
2. D'extraire et de valoriser automatiquement les réglages techniques de prise de vue (données EXIF) de ses photos.
3. De commercialiser ses « recettes de retouche » et presets Adobe Lightroom sous forme de produits numériques téléchargeables avec une démonstration visuelle convaincante (comparateur Avant/Après).
4. De recevoir directement des demandes personnalisées de tirages d'art signés de la part de collectionneurs ou de clients.

---

## Solution

Faire évoluer le projet vers une application fullstack **Next.js (App Router, TypeScript)** moderne et performante, déployée sur Vercel, dotée :
- D'un **portfolio public éditorial épuré** articulé autour de 4 pages (Accueil, Séries thématiques, Boutique de Recettes, À Propos & Tirages d'art).
- D'un **espace d'administration sécurisé (`/admin`)** permettant le téléversement de clichés par glisser-déposer, le classement par séries, et l'extraction automatique des métadonnées EXIF.
- D'un **comparateur interactif Avant / Après** permettant aux visiteurs de constater en temps réel l'impact d'une recette sur un cliché brut avant d'acheter le pack de presets via Lemon Squeezy en paiement sécurisé 1-clic.
- D'une gestion cloud des images haute définition via **Cloudinary** (compression intelligente WebP/AVIF, adaptation dynamique à la résolution d'écran et effet de chargement progressif par flou).

---

## User Stories

### Visiteurs & Passionnés de Photographie
1. *En tant que visiteur*, je veux découvrir une sélection éditoriale de photographies dès la page d'accueil, afin d'apprécier la signature artistique et la lumière des œuvres sans être distrait par des éléments d'interface agressifs.
2. *En tant que visiteur*, je veux explorer des séries thématiques dédiées (`/series/[slug]`), afin de comprendre l'intention artistique et le contexte d'un voyage ou d'un projet photographique.
3. *En tant que visiteur*, je veux ouvrir n'importe quel cliché dans une visionneuse plein écran épurée, afin de contempler l'image en haute résolution avec navigation clavier (`Flèches` et `Échap`).
4. *En tant que passionné de photographie*, je veux pouvoir consulter les réglages de prise de vue (boîtier, objectif, ouverture, vitesse, ISO) sous chaque cliché, afin d'apprendre comment la photo a été réalisée.
5. *En tant que visiteur*, je veux basculer entre un thème clair et un thème sombre, afin d'adapter la luminosité du site à mon environnement de visionnage.

### Clients de la Boutique de Recettes (Presets)
6. *En tant qu'acheteur potentiel*, je veux manipuler un curseur interactif Avant / Après sur chaque recette, afin de visualiser immédiatement l'impact concret du preset sur le fichier RAW brut.
7. *En tant qu'acheteur*, je veux acheter une recette de retouche en 1 clic via Apple Pay, Google Pay ou carte bancaire, afin d'effectuer une transaction rapide et sécurisée.
8. *En tant qu'acheteur*, je veux recevoir automatiquement par e-mail mon lien de téléchargement sécurisé contenant les fichiers `.xmp`/`.dng` et le guide d'utilisation PDF, afin de pouvoir utiliser le preset immédiatement dans Adobe Lightroom.
9. *En tant que client international*, je veux que la taxe locale (TVA) et la facture légale soient générées automatiquement, sans complication administrative.

### Collectionneurs & Amateurs d'Art
10. *En tant que collectionneur*, je veux cliquer sur « Demander un tirage d'art » sous un cliché qui me plaît, afin d'ouvrir un formulaire pré-rempli avec le nom et les références exactes de la photo.
11. *En tant que client intéressé par un tirage*, je veux pouvoir préciser le format souhaité et poser mes questions, afin d'obtenir un devis personnalisé de la photographe.

### Photographe (Administratrice / Sarah)
12. *En tant qu'administratrice*, je veux me connecter à mon espace `/admin` via un mot de passe fort unique, afin de protéger la gestion de mon site sans dépendre d'un tiers.
13. *En tant qu'administratrice*, je veux glisser-déposer un ou plusieurs clichés haute résolution, afin de les téléverser instantanément sur Cloudinary sans perte de qualité.
14. *En tant qu'administratrice*, je veux que les paramètres de prise de vue EXIF soient automatiquement lus et renseignés lors du téléversement, afin de ne pas avoir à ressaisir manuellement le boîtier, l'ouverture ou la vitesse.
15. *En tant qu'administratrice*, je veux pouvoir éditer, corriger ou masquer les métadonnées d'un cliché, afin de garder le contrôle éditorial total sur les informations affichées.
16. *En tant qu'administratrice*, je veux créer, modifier et réorganiser des séries thématiques, afin de structurer mon portfolio au fil de mes voyages et projets.
17. *En tant qu'administratrice*, je veux créer une recette en déposant simplement le cliché brut (Avant) et le cliché développé (Après), en fixant un titre et un lien produit Lemon Squeezy, afin que le slider Avant/Après soit publié immédiatement en boutique.
18. *En tant qu'administratrice*, je veux marquer certains clichés comme « Coup de cœur / Mis en avant », afin qu'ils apparaissent en tête de la page d'accueil.
19. *En tant qu'administratrice*, je veux pouvoir supprimer ou archiver un cliché en un clic, afin de maintenir un catalogue toujours pertinent.

---

## Implementation Decisions

### 1. Architecture Modulaire
- **Framework** : Next.js avec App Router et TypeScript.
- **ORM & Données** : Prisma ORM connecté à une base PostgreSQL (Supabase) ou SQLite (Turso / LibSQL).
- **Gestion des Médias** : SDK Cloudinary (`cloudinary` et `next-cloudinary`) gérant l'upload sécurisé signé, la transformation responsive et les placeholders flous LQIP.
- **Paiements** : Intégration Lemon Squeezy (SDK / Checkout Overlay script).

### 2. Schéma de Données (Prisma)
```prisma
model Photo {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String?
  publicId    String   // Cloudinary Public ID
  secureUrl   String
  width       Int
  height      Int
  aspectRatio Float
  blurDataUrl String?  // Base64 blur placeholder
  
  // Données EXIF
  camera      String?
  lens        String?
  focalLength String?
  aperture    String?  // Ex: f/2.8
  shutter     String?  // Ex: 1/500s
  iso         Int?
  capturedAt  DateTime?

  isFeatured  Boolean  @default(false)
  order       Int      @default(0)
  tags        String[] // Tags thématiques

  seriesId    String?
  series      Series?  @relation(fields: [seriesId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Series {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  subtitle    String?
  statement   String?  // Note d'intention éditoriale
  coverUrl    String?
  order       Int      @default(0)
  photos      Photo[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Recipe {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  description     String
  price           Float
  currency        String   @default("EUR")
  lemonSqueezyUrl String   // Lien checkout Lemon Squeezy
  
  // Clichés comparatifs
  beforeUrl       String   // Photo brute (Avant)
  afterUrl        String   // Photo développée (Après)
  
  software        String   @default("Adobe Lightroom")
  includedFiles   String   // Ex: ".xmp, .dng, guide PDF"
  isPublished     Boolean  @default(true)
  order           Int      @default(0)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PrintInquiry {
  id          String   @id @default(cuid())
  photoSlug   String
  photoTitle  String
  clientName  String
  clientEmail String
  desiredSize String?
  message     String
  status      String   @default("pending") // pending, contacted, completed
  createdAt   DateTime @default(now())
}
```

### 3. Contrats d'API & Server Actions (Frontières)
- `POST /api/auth/login` & `POST /api/auth/logout` : Authentification unique avec cookie de session chiffré HTTP-only.
- `GET /api/photos` & `POST /api/photos` : Lecture paginée et création avec upload Cloudinary.
- `PATCH /api/photos/[id]` & `DELETE /api/photos/[id]` : Mise à jour et suppression de clichés.
- `GET /api/series` & `POST /api/series` : Gestion des séries photographiques.
- `GET /api/recipes` & `POST /api/recipes` : Gestion des recettes et presets.
- `POST /api/inquiries` : Réception d'une demande de tirage d'art et notification e-mail.

### 4. Composants Clés d'Interface
- **`BeforeAfterSlider`** : Composant tactile et souris fluide comparant les clichés brut et retouché avec séparateur vertical.
- **`EditorialGrid`** : Grille asymétrique Squarespace gérant dynamiquement les ratios horizontaux, verticaux et panoramiques avec apparition progressive en flou.
- **`LightboxModal`** : Visionneuse plein écran avec affichage escamotable des données EXIF.
- **`AdminDropzone`** : Zone de glisser-déposer avec parsing EXIF côté client (`exifr`) et barre de progression de téléversement Cloudinary.

---

## Testing Decisions

### Qu'est-ce qu'un bon test ?
Un bon test vérifie le **comportement externe observable** à travers les frontières publiques (seams), et non les détails d'implémentation internes. Les tests doivent résister aux refactorisations de code.

### Points de Test (Seams)
1. **Seam API & Actions Serveur** :
   - Vérification de l'authentification : rejet des requêtes non autorisées sur `/admin` et `/api/photos` (code HTTP 401).
   - Validation des entrées : rejet des clichés sans URL ou des recettes sans prix valide.
   - Intégrité des données : vérification que la création d'une recette associe correctement les clichés Avant et Après.
2. **Seam Composants d'Interaction Client** :
   - Curseur Avant/Après : calcul correct du pourcentage de déplacement sur événement tactile/souris.
   - Visionneuse : ouverture, fermeture sur `Échap`, navigation sur flèches du clavier.
   - Formulaire de demande de tirage : validation d'un e-mail valide et affichage de l'état de confirmation.

---

## Out of Scope

Pour préserver la pureté et la légèreté du projet :
- Pas de panier d'achat e-commerce complexe multi-vendeurs (Lemon Squeezy gère le checkout unitaire instantané).
- Pas d'espace client avec inscription ouverte au public (seule la photographe dispose d'un compte).
- Pas de réseau social interne, espace commentaires ou système de messagerie instantanée.
- Pas de gestionnaire de stock physique automatisé pour les tirages (gérés sur devis via le formulaire dédié).

---

## Further Notes

- Le design suit scrupuleusement la charte éditoriale épurée : dominante de blanc et blanc cassé chaud (`#FAFAF9`), typographies fines, marges généreuses et transitions douces de 300ms.
- Les identifiants et clés d'API (Cloudinary, Lemon Squeezy, mot de passe admin) sont isolés dans des variables d'environnement (`.env.local`) et ne sont jamais committés dans le dépôt Git.
