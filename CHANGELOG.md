# MenuQR Changelog

## v0.3.1 - 2026-05-04

### ✅ Tests E2E Playwright — TERMINÉ
- 14/14 tests passent
- 5 suites de tests : landing, auth, dashboard, api-menu, menu-public
- Corrections apportées :
  - Création des pages `/auth/signin` et `/auth/verify-request`
  - Protection du Dashboard avec NextAuth (redirection si non authentifié)
  - Adaptation des tests au comportement réel de l'app

### 🆕 Upload d'images Cloudinary — EN COURS
- Composant `ImageUpload.tsx` créé
- API route `/api/upload` créée
- Besoin : configurer les variables d'environnement Cloudinary

### 🔧 Fixes
- Nettoyage des processus Node bloqués
- Build Next.js stable

## v0.3.0 - 2026-05-04

### ✅ Tests E2E Playwright — EN COURS
- Config Playwright créée
- 5 suites de tests écrites
- Problème : exécution bloquée par processus serveur

## Roadmap
- [ ] Supabase production (en attente token)
- [ ] Cloudinary upload (composants créés, besoin config)
- [ ] Stripe payment links
- [ ] Réservation de tables (Premium)
- [ ] Multi-langue FR/EN/ES
- [ ] App mobile PWA
