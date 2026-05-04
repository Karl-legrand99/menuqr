# MenuQR Changelog

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
