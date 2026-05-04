This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tests End-to-End (Playwright)

Ce projet utilise [Playwright](https://playwright.dev) pour les tests end-to-end.

### Pré-requis

- Node.js ≥ 18
- PostgreSQL local sur `localhost:5432` (user `menuqr`)

### Lancer les tests

```bash
# Mode interactif (avec navigateur visible)
npm run test:e2e

# Mode UI (interface de debug Playwright)
npm run test:e2e:ui

# Mode CI (headless, rapide)
npm run test:e2e:ci
```

### Structure des tests

Les tests sont dans le dossier `e2e/` :

- `landing.spec.ts` — Landing page (hero, CTA, tarifs)
- `menu-public.spec.ts` — Menu public (`/r/:slug`)
- `auth.spec.ts` — Flux de connexion (NextAuth EmailProvider)
- `dashboard.spec.ts` — Protection du dashboard (redirection si non authentifié)
- `api-menu.spec.ts` — API `/api/menu/[slug]` (JSON valide, 404)

### Configuration

- `playwright.config.ts` — Configuration principale
- `baseURL` : `http://localhost:3000`
- Le serveur de dev est automatiquement démarré avant les tests (`webServer`)
- Mode headless activé en CI via la variable `CI`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
