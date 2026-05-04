# MenuQR Changelog

## v0.4.0 - 2026-05-04

### ✅ PWA (Progressive Web App) — TERMINÉ
- Manifest JSON créé (`public/manifest.json`)
- Service Worker créé (`public/sw.js`) avec cache des assets statiques
- Icônes PWA créées (`public/icons/icon-192x192.svg`, `icon-512x512.svg`)
- Meta tags PWA ajoutés dans `layout.tsx` (theme-color, apple-mobile-web-app, viewport)
- Headers HTTP configurés dans `next.config.ts` pour `sw.js` et `manifest.json`
- Build Next.js stable

### ✅ Réservation de tables (Premium) — TERMINÉ
- Modèles Prisma `Table` et `Reservation` ajoutés
- API routes créées :
  - `GET /api/restaurant/[id]/tables` — lister les tables
  - `POST /api/restaurant/[id]/tables` — créer une table
  - `POST /api/reservations` — créer une réservation
  - `GET /api/reservations?restaurantId=` — lister les réservations (admin)
  - `PATCH /api/reservations/[id]` — mettre à jour statut/table
- Page publique `/r/[slug]/reserver` pour les clients
- Page dashboard `/dashboard/reservations` pour gérer tables et réservations
- Lien "Réserver une table" ajouté sur le menu public

### 🆕 Upload d'images Cloudinary — EN COURS
- Composant `ImageUpload.tsx` créé
- API route `/api/upload` créée
- Besoin : configurer les variables d'environnement Cloudinary

### 🔧 Fixes
- Nettoyage des processus Node bloqués
- Build Next.js stable

## v0.3.1 - 2026-05-04

### ✅ Tests E2E Playwright — TERMINÉ
- 14/14 tests passent
- 5 suites de tests : landing, auth, dashboard, api-menu, menu-public
- Corrections apportées :
  - Création des pages `/auth/signin` et `/auth/verify-request`
  - Protection du Dashboard avec NextAuth (redirection si non authentifié)
  - Adaptation des tests au comportement réel de l'app

## v0.3.0 - 2026-05-04

### ✅ Tests E2E Playwright — EN COURS
- Config Playwright créée
- 5 suites de tests écrites
- Problème : exécution bloquée par processus serveur

## v0.4.1 - 2026-05-04

### ✅ Multi-langue FR/EN/ES — TERMINÉ
- Système de traduction simple avec contexte React (`src/i18n/I18nContext.tsx`)
- Dictionnaires JSON créés : `fr.json`, `en.json`, `es.json`
- Hook `useTranslation` avec fallback FR
- Sélecteur de langue dans le header (`LanguageSelector.tsx`) avec drapeaux
- Landing page (`page.tsx`) entièrement traduite en FR/EN/ES
- `layout.tsx` mis à jour avec `I18nProvider` et `lang` dynamique
- Persistance de la langue dans `localStorage`

### 🚀 Déploiement Vercel
- Déployé sur https://menuqr-ten.vercel.app

## Roadmap
- [ ] Supabase production (en attente token)
- [ ] Cloudinary upload (composants créés, besoin config)
- [ ] Stripe payment links
- [x] Réservation de tables (Premium)
- [x] Multi-langue FR/EN/ES
- [x] App mobile PWA
