# 5. Schéma de Données, Extraction EXIF et Tirages d'Art

## Contexte
Le catalogue photographique comprend des clichés, des séries thématiques et des recettes de retouche (avec comparatif Avant/Après). De plus, les passionnés et acheteurs recherchent les données techniques de prise de vue (EXIF), et les collectionneurs souhaitent pouvoir commander des tirages physiques d'art.

## Décision
- **ORM & Base de données** : Utilisation de **Prisma** avec **PostgreSQL (Supabase)** ou **SQLite (Turso)**.
  - Modèle `Photo` : titre, slug, description, URL Cloudinary, dimensions, orientation, tags, favori/mise en avant, série associée, métadonnées EXIF.
  - Modèle `Series` : titre, slug, description d'intention, photo de couverture, ordre d'affichage.
  - Modèle `Recipe` (Recette) : titre, description, prix, lien produit Lemon Squeezy, photo brute (Avant), photo retouchée (Après), réglages clés.
- **Extraction EXIF automatique** : Lors de l'envoi d'un fichier photo dans le back-office, une librairie de parsing (`exifr`) lit instantanément le boîtier, l'objectif, la focale, l'ouverture `f/`, la vitesse et les ISO pour pré-remplir la fiche sans effort.
- **Demande de tirage d'art** : Un point de contact direct pré-remplit les informations du cliché sélectionné pour les commandes d'impressions signées sur mesure.

## Justification
Cette organisation sépare clairement le contenu artistique, les produits numériques téléchargeables et les demandes sur mesure, tout en automatisant la saisie technique grâce aux métadonnées EXIF.
