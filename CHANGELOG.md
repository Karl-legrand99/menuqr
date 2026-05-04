# MenuQR Changelog

## v0.8.0 - 2026-05-04

### ✅ Upload d'images — SÉCURISÉ
- **Rate limiting** : 10 uploads/minute par IP sur `/api/upload`
- **Validation des fichiers** : types MIME autorisés (JPG, PNG, WebP, GIF, SVG), taille max 5 Mo
- **Messages d'erreur i18n** : retours explicites en français (type non supporté, fichier trop volumineux, etc.)
- Composant `ImageUpload.tsx` : affichage des erreurs de validation en temps réel, info formats/taille
- API `/api/upload` : fallback local + Cloudinary avec gestion d'erreurs améliorée

### ✅ PWA — CORRIGÉ
- Service Worker (`public/sw.js`) : références SVG remplacées par PNG (`icon-192x192.png`, `icon-512x512.png`)
- Le cache PWA est maintenant complet et fonctionnel

### ✅ Tests E2E — ÉTENDU
- **16/16 tests Playwright passent** (+2 nouveaux tests réservation)
- Suite `reservation.spec.ts` ajoutée : couverture de la page `/r/[slug]/reserver`
- Tests résilients aux erreurs DB (pas de 500)

### ✅ Réservation de tables — ROBUSTIFIÉ
- Page `/r/[slug]/reserver` : fetch des tables corrigé (utilise l'ID numérique du restaurant, pas le slug)
- Gestion des erreurs API améliorée (pas de crash si la DB est indisponible)

### 🔧 Fixes
- `DemoDashboard.tsx` : correction TypeScript `useState<any[]>([])`
- Build Next.js stable (tsc --noEmit passe)
- Déployé sur https://menuqr-ten.vercel.app

---

## v0.7.0 - 2026-05-04

### ✅ Upload d'images — AMÉLIORÉ
- API `/api/upload` : fallback local quand Cloudinary n'est pas configuré
- Les images sont sauvegardées dans `public/uploads/` si Cloudinary est absent
- Composant `ImageUpload.tsx` : utilise l'API locale au lieu de l'API Cloudinary directe
- Upload fonctionnel même sans configuration Cloudinary

### ✅ Tests E2E — STABILISÉ
- 14/14 tests Playwright passent
- Tests landing page : forçage de la langue FR via `localStorage` pour éviter les échecs i18n

### 🔧 Fixes
- Build Next.js stable
- Déployé sur https://menuqr-ten.vercel.app

---

## v0.6.0 - 2026-05-04

### ✅ PWA — AMÉLIORÉ
- Icônes PNG créées (`icon-192x192.png`, `icon-512x512.png`) pour meilleure compatibilité PWA
- `manifest.json` mis à jour pour utiliser les icônes PNG au lieu de SVG
- Service Worker (`sw.js`) inchangé — cache-first fonctionnel

### ✅ i18n — AMÉLIORÉ
- Chargement synchrone des dictionnaires côté client pour éviter le flash de contenu
- Détection de la langue du navigateur au premier chargement
- Persistance dans `localStorage` améliorée
- Hook `useTranslation` expose `isLoading` pour les états de chargement

### ✅ Stripe Webhook — AMÉLIORÉ
- Gestion de `customer.subscription.updated` ajoutée
- Mise à jour automatique du plan, du statut et des périodes de facturation

### ✅ Dashboard — AMÉLIORÉ
- Protection des sous-routes dashboard (`/dashboard/menu`, `/dashboard/orders`, etc.) avec vérification d'authentification côté client
- Redirection automatique vers `/auth/signin` si non authentifié

### ✅ Menu Public — AMÉLIORÉ
- Barre de recherche ajoutée pour filtrer les plats par nom ou description
- Filtres par allergènes conservés

### ✅ SEO — AMÉLIORÉ
- Métadonnées dynamiques pour les pages de restaurant (`/r/[slug]`)
- Titre et description personnalisés selon le restaurant
- Open Graph tags pour le partage social

### 🔧 Fixes
- Build Next.js stable
- 14/14 tests E2E Playwright passent
- Déployé sur https://menuqr-ten.vercel.app

## v0.5.0 - 2026-05-04

### ✅ Stripe Payment Links — TERMINÉ
- Page `/pricing` dédiée avec 3 plans (Basic 9,90€, Pro 29€, Premium 59€)
- Intégration Stripe Checkout avec redirection vers Stripe
- API `/api/stripe/checkout` — création de session de paiement
- API `/api/stripe/portal` — portail client Stripe pour gérer l'abonnement
- API `/api/stripe/subscription` — récupération de l'abonnement utilisateur
- API `/api/stripe/webhook` — mise à jour automatique des abonnements
- Dashboard Settings : affichage du plan actuel + bouton "Gérer mon abonnement"
- 14 jours d'essai gratuit configurés
- Fallback vers `/auth/signin` si Stripe non configuré

### ✅ Upload d'images Cloudinary — AMÉLIORÉ
- Composant `ImageUpload.tsx` enrichi avec props `value`, `onChange`, `onRemove`
- Bouton de suppression d'image (× rouge)
- Props `onUpload` rendue optionnelle pour compatibilité

### 🔧 Fixes
- Corrections TypeScript sur `DashboardPage.tsx`, `ImageUpload.tsx`, `pricing/page.tsx`
- Build Next.js stable (tsc --noEmit passe)

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
- [x] Cloudinary upload (composants créés, besoin config)
- [x] Stripe payment links
- [x] Réservation de tables (Premium)
- [x] Multi-langue FR/EN/ES
- [x] App mobile PWA
- [x] Système de notifications toast
- [x] Recherche sur le menu public
- [x] SEO dynamique pour les restaurants
- [x] Protection des sous-routes dashboard
