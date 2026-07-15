# La Confrérie des Héritiers — PRD

## Vue d'ensemble
Application mobile compagnon (Expo React Native) pour l'univers de jeu de rôle "La Confrérie des Héritiers". Ambiance pirate / steampunk sombre (bois, laiton, or, parchemin).

## Architecture
- **Frontend** : Expo Router avec navigation par onglets. 5 onglets + écran d'accueil hors onglets.
- **Backend** : FastAPI + MongoDB. Toutes les routes sous `/api`. Seed automatique au démarrage.

## Écrans
1. **Accueil** (`/index`) — Image immersive fournie par l'utilisateur, bouton unique "Commencer l'aventure" superposé sur le bouton dessiné dans l'image. Les onglets dessinés dans l'image sont masqués par un bandeau noir.
2. **Monde** (`/(tabs)/monde`) — Cartes parchemin décrivant l'univers (intro + sections).
3. **Classes** (`/(tabs)/classes`) — Grille 2 colonnes des 10 classes. Tap = modal avec la charte complète (image + description).
4. **Quêtes** (`/(tabs)/quetes`) — Écran verrouillé par mot de passe global. Une fois déverrouillé, liste des quêtes avec difficulté / lieu / récompense.
5. **Journal** (`/(tabs)/journal`) — Chronologie inversée des entrées (bloc date + parchemin).
6. **Passeport** (`/(tabs)/passeport`) — Grille des pages téléchargeables. Prévisualisation modal + bouton de téléchargement (`expo-file-system` + `expo-sharing`).

## API Backend
- `GET /api/world` — Lore du monde
- `GET /api/classes` — 10 classes triées
- `POST /api/quests/verify` — Vérifie mot de passe et renvoie les quêtes
- `GET /api/journal` — Entrées triées par date décroissante
- `POST /api/journal` (header `X-Admin-Password`) — Créer une entrée
- `DELETE /api/journal/{id}` (header `X-Admin-Password`) — Supprimer
- `GET /api/passport` — Modèles de passeport

## Mots de passe (env `backend/.env`)
- `QUESTS_PASSWORD=kraken2026`
- `ADMIN_PASSWORD=amiral2026`

## Contenu
- 10 classes avec images intégrales des chartes fournies par l'utilisateur.
- Contenu quêtes / journal / passeport : données d'exemple placeholder à remplacer par l'utilisateur.

## À suivre (prochaines itérations possibles)
- Interface admin in-app pour créer/éditer les entrées de Journal.
- Remplacement des templates de passeport par les vrais PDF/PNG fournis.
- Contenu des quêtes personnalisé par l'utilisateur.
