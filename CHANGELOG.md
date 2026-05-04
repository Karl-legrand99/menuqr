# MenuQR Changelog

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

### 📋 Prochaines étapes
- [ ] Connexion base de données Supabase
- [ ] Déploiement Vercel
- [ ] Tests end-to-end
- [ ] Système de commande en ligne (Stripe payment links)
- [ ] Analytics (vues menu, plats populaires)
- [ ] Réservation de tables (Premium)
- [ ] Multi-langue FR/EN/ES
- [ ] App mobile PWA
- [ ] Upload images plats (Cloudinary)

### 🐛 Known Issues
- Stripe keys en mode test (besoin de configurer produits/prix réels)
- DB locale uniquement (besoin Supabase)
- Pas d'upload d'images encore
