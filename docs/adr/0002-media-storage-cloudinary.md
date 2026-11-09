# 2. Stockage et Optimisation des Médias avec Cloudinary

## Contexte
Les portfolios de photographie exigent des fichiers haute résolution tout en maintenant un temps de chargement ultra rapide sur mobile et écrans Retina 4K. Servir des fichiers bruts non optimisés dégraderait le SEO et l'expérience utilisateur.

## Décision
Nous utilisons **Cloudinary** pour le stockage et la distribution des clichés photographiques.
- Téléversement direct depuis l'espace `/admin` vers Cloudinary via API sécurisée.
- Génération automatique des formats d'image nouvelle génération (`f_auto` : AVIF / WebP) et adaptation de la qualité (`q_auto`).
- Génération automatique de miniatures floues ultra légères (*blur placeholders*) pour un effet d'apparition progressif élégant.

## Justification
Cloudinary offre un CDN mondial ultra performant et un forfait gratuit très généreux (25 crédits mensuels = ~25 000 transformations ou Go de bande passante), suffisant pour un portfolio indépendant.
