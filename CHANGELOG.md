# MenuQR Changelog

## v0.3.0 - 2025-05-04 (03:38 CET)
### 🚀 Infrastructure & Déploiement
- ✅ PostgreSQL local installé et configuré (user `menuqr`, DB `menuqr`)
- ✅ Fix Prisma 7 : `prisma.config.ts` avec `dotenv/config` + `datasource.url`
- ✅ Migration Prisma initiale réussie (`20260504033545_init`)
- ✅ Variables d'environnement Vercel configurées : `DATABASE_URL`, `DIRECT_URL`
- ✅ Déploiement production réussi : https://menuqr-ten.vercel.app

### 🐛 Corrections
- Fix schema Prisma : suppression des propriétés `url`/`directUrl` obsolètes (Prisma 7)
- Fix `prisma.config.ts` : utilisation de `import "dotenv/config"` pour charger les env vars

### 📋 Prochaines étapes
- [ ] Créer un projet Supabase réel pour la production
- [ ] Tests end-to-end (Playwright)
- [ ] Upload images plats (Cloudinary)
- [ ] Système de commande en ligne (Stripe payment links)
- [ ] Réservation de tables (Premium)
- [ ] Multi-langue FR/EN/ES
- [ ] App mobile PWA

### 🐛 Known Issues
- La DB locale n'est pas accessible depuis Vercel (besoin de Supabase/Neon pour la prod)
- Stripe keys en mode test
- Pas d'upload d'images encore

## v0.2.0 - 2025-05-04 (03:15 CET)
### 🚀 Supabase + Analytics
- ✅ Configuration Supabase PostgreSQL (DATABASE_URL + DIRECT_URL)
- ✅ Prisma adapter pg avec fallback DIRECT_URL
- ✅ Modèle `MenuView` ajouté au schema Prisma (tracking vues menu/plats)
- ✅ API analytics `/api/analytics/[slug]` migrée de Map mémoire → Prisma DB
- ✅ Tracking détaillé : vues totales, vues aujourd'hui, vues semaine, plats populaires, graphique 7 jours
- ✅ Bouton "Voir détails" sur chaque plat du menu public → track itemId
- ✅ Fix TypeScript : types allergènes, useState<any[]>, stripePriceId, checkout URL fallback
- ✅ Déploiement Vercel réussi : https://menuqr-ten.vercel.app

### 📋 Prochaines étapes
- [ ] Migrations Prisma sur Supabase (push schema)
- [ ] Tests end-to-end
- [ ] Upload images plats (Cloudinary)
- [ ] Système de commande en ligne (Stripe payment links)
- [ ] Réservation de tables (Premium)
- [ ] Multi-langue FR/EN/ES
- [ ] App mobile PWA

### 🐛 Known Issues
- Stripe keys en mode test (besoin de configurer produits/prix réels)
- Supabase credentials sont des placeholders dans .env (à remplacer avec vraies valeurs)
- Pas d'upload d'images encore

## v0.1.0 - 2025-05-04 (02:30 CET)
### 🚀 Initial Release
- ✅ Architecture Next.js 14 + Prisma + PostgreSQL
- ✅ Auth avec NextAuth (email/magic link)
- ✅ Models DB : User, Restaurant, Category, MenuItem, Subscription
- ✅ API routes CRUD : restaurants, catégories, plats
- ✅ Route publique /api/menu/[slug]
- ✅ Dashboard restaurateur (layout + navigation)
- ✅ Page création restaurant (nom, slug, couleurs)
- ✅ Page gestion menu (CRUD catégories + plats)
- ✅ Page QR code (génération + téléchargement PNG)
- ✅ Menu public responsive (/r/[slug])
- ✅ Landing page complète (hero, pricing, FAQ, CTA)
- ✅ Design system : orange #FF6B35 + bleu nuit #2C3E50
- ✅ Filtre allergènes sur menu public
- ✅ Stripe checkout + webhooks + portal client
- ✅ 3 plans : Basic 9,90€ / Pro 29€ / Premium 59€
- ✅ 14 jours d'essai gratuit
