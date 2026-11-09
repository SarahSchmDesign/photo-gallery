# 4. Authentification Sécurisée Monoutilisateur pour l'Espace Admin

## Contexte
Le site est le portfolio personnel de la photographe. Il n'a pas vocation à ouvrir des comptes visiteurs ou clients en libre-service. Un système d'authentification multi-utilisateurs complexe (base de données d'utilisateurs, confirmation d'e-mail, etc.) alourdirait inutilement la codebase.

## Décision
L'accès à l'espace `/admin` est sécurisé par un système d'authentification monoutilisateur :
- Mot de passe administrateur fort configuré via variable d'environnement (`ADMIN_PASSWORD`).
- Session sécurisée gérée via un cookie HTTP-only signé (JWT ou iron-session).
- Protection middleware Next.js sur toutes les routes `/admin/*` et endpoints API de mutation.

## Justification
Cette solution garantit une sécurité maximale, élimine toute dépendance à un service tiers d'auth (comme Auth0 ou Clerk) pour un cas d'usage purement personnel, et offre une connexion instantanée.
