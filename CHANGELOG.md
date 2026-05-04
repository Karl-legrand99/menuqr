# MenuQR Changelog

## v0.4.0 — 2026-05-04

### ✅ Mode Démo complet
- Toutes les pages du dashboard fonctionnent en mode démo sans auth
- Données mock riches : restaurants, catégories, plats, commandes, réservations, analytics
- API `/api/restaurant` bypass auth avec header `x-demo-mode`
- Header `x-demo-mode` envoyé par tous les clients en mode démo

### Pages fonctionnelles en mode démo
- **Dashboard** : affiche "Le Petit Bistro" avec liens vers sous-pages
- **Menu** : 3 catégories (Entrées, Plats, Desserts) avec 8 plats, formulaires d'ajout fonctionnels
- **Commandes** : 3 commandes mock avec filtres et changement de statut
- **Réservations** : 3 réservations mock avec tables assignables
- **Analytics** : vues totales, vues journalières, plats populaires
- **Paramètres** : infos restaurant, abonnement Stripe mock, toggle commandes en ligne
- **QR Code** : QR code généré avec URL du menu, téléchargement PNG

### 🟡 En cours
- Responsive navbar (hamburger menu mobile) — CSS Tailwind v4 à vérifier
- Persistance localStorage des données créées en mode démo
- Landing page publique /r/[slug] avec vrai menu

## v0.3.1 — 2026-05-04

### Ajouts
- Composant `ImageUpload.tsx` pour Cloudinary
- API route `/api/upload` pour upload d'images

## v0.3.0 — 2026-05-04

### Tests E2E
- 5 suites de tests Playwright (14 tests)
- Tests landing, auth, API menu, dashboard, menu public

### Infrastructure
- Next.js 16 + Prisma 7 + NextAuth
- PostgreSQL local (pas de DB production)
- Cloudinary installé mais non configuré
- Stripe installé mais non configuré
