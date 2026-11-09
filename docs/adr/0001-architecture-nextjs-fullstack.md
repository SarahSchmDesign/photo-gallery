# 1. Architecture Fullstack Next.js avec Espace Admin Intégré

## Contexte
Le projet a débuté sous la forme d'une galerie statique HTML/CSS/JS. L'évolution vers une plateforme permettant à la photographe d'ajouter et d'éditer ses clichés de manière autonome via un espace d'administration, ainsi que de commercialiser des recettes de retouche, exige un backend sécurisé et une base de données.

## Décision
Nous faisons évoluer le projet vers **Next.js (React / TypeScript)** en utilisant l'App Router.
- Le front-end et le back-end (API Routes et Server Actions) sont hébergés dans le même dépôt.
- L'authentification pour l'espace `/admin` est gérée nativement sans infrastructure complexe.
- Le stockage des clichés originaux HD est délégué à un service cloud optimisé pour les médias (Cloudinary ou Supabase Storage), avec génération automatique de formats modernes (AVIF/WebP) et de miniatures floues (*blur placeholders*).
- Le déploiement continu s'effectue sur Vercel.

## Justification
Cette approche élimine la séparation lourde entre front et back séparés, assure des performances optimales de chargement pour les photographies haute résolution (crucial pour le SEO et l'expérience Squarespace), tout en restant dans des offres gratuites (*free tier*) très généreuses.
