# 🎯 Camino TV - Plateforme Deals Streetwear

> **Application Full-Stack en Production** - Next.js 15, React 19, PostgreSQL & Better Auth

Une plateforme complète inspirée de l'univers Camino TV pour découvrir et gérer les meilleurs deals sneakers et streetwear. Développée avec les dernières technologies web, un backend complet et un système d'authentification avancé.

## 🚀 Démonstration Live

**[Voir le projet en ligne →](https://camino-tv.vercel.app)** *(déploiement Vercel)*

![Camino TV Preview](public/camino_logo.jpg)

## ✨ Fonctionnalités Principales

### 🔐 Authentification & Sécurité
- **Better Auth** intégré avec Prisma adapter
- **Email/Password** + Google OAuth (social login)
- **Sessions sécurisées** stockées en base de données
- **Middleware de protection** pour les routes admin
- **Role-based access** (USER/ADMIN) avec gestion fine

### 🎨 Interface Moderne
- **Design System** complet avec Shadcn UI et Tailwind CSS v4
- **Dark/Light Mode** avec transition fluide (next-themes)
- **24+ composants** Shadcn UI personnalisés
- **Responsive Design** mobile-first sur tous devices

### 🛍️ Catalogue Deals Dynamique
- **API RESTful** avec endpoints CRUD complets
- **Base de données** PostgreSQL avec Prisma ORM
- **Grille produits** avec données en temps réel
- **Filtres avancés** par catégorie, statut, recherche
- **Pagination** et lazy loading optimisés

### ❤️ Système de Favoris API-First
- **Integration API** avec fallback localStorage
- **Authentification requise** pour la persistance
- **Synchronisation** temps réel entre devices
- **Page dédiée** /favorites avec gestion complète

### 🎛️ Dashboard Admin Complet
- **KPI en temps réel** : deals, users, favorites, engagement
- **CRUD Deals** : création, édition, suppression avec validation Zod
- **Upload d'images** vers Supabase Storage (5MB max)
- **Gestion utilisateurs** : rôles, statuts, recherche
- **Interface moderne** avec Shadcn Sidebar et tables

### 📝 Blog & Contenu
- **Pages dynamiques** [slug] avec App Router
- **Rich content** avec Twitter embeds
- **Catégorisation** et profils équipe
- **Gestion admin** (création/édition en cours)

### 📱 Performance & UX
- **React 19** + **Next.js 15** avec Turbopack
- **Server Components** et optimisations automatiques
- **Bundle optimisé** avec code splitting
- **SEO complet** : sitemap, robots.txt, metadata

## 🛠 Stack Technique Full-Stack

### Frontend
- **Next.js 15.5.2** - App Router, Server Components, Turbopack
- **React 19.1.0** - Dernières APIs et optimisations
- **TypeScript 5** - Configuration stricte end-to-end
- **Tailwind CSS v4** - Design system avec CSS variables
- **Shadcn UI (24+ composants)** - Radix UI primitives accessibles
- **next-themes 0.4.6** - Dark/Light mode persistant
- **Lucide React** - Icons modernes SVG optimisés

### Backend & Database
- **PostgreSQL** - Base de données production (Supabase)
- **Prisma 6.16.3** - ORM type-safe avec migrations
- **Better Auth 1.3.26** - Authentication moderne avec sessions DB
- **Supabase Storage** - Stockage d'images sécurisé
- **Zod 4.1.5** - Validation schemas côté serveur/client

### API & Security
- **Next.js Route Handlers** - API RESTful type-safe
- **Middleware protection** - Routes admin sécurisées
- **Role-based access** - Gestion permissions USER/ADMIN
- **Session management** - Better Auth + Prisma adapter
- **CSRF protection** - Sécurité built-in

### DevOps & Testing
- **Jest 30** - Tests unitaires et intégration
- **Testing Library** - Tests composants React
- **ESLint 9** - Linting Next.js + TypeScript
- **Prisma Migrate** - Versioning schéma database
- **Vercel** - CI/CD automatique + preview deployments

## 🏗 Architecture Full-Stack

```
src/
├── app/
│   ├── (public)/           # Routes publiques
│   │   ├── page.tsx        # Homepage
│   │   ├── blog/           # Blog dynamique [slug]
│   │   ├── deals/          # Catalogue deals
│   │   ├── favorites/      # Wishlist utilisateur
│   │   ├── team/           # Équipe Camino TV
│   │   ├── contact/        # Formulaire contact
│   │   └── legal/          # Pages légales
│   │
│   ├── (auth)/             # Routes authentification
│   │   ├── login/          # Connexion
│   │   └── signup/         # Inscription
│   │
│   ├── (admin)/            # Dashboard admin protégé
│   │   └── admin/
│   │       ├── dashboard/  # KPI stats temps réel
│   │       ├── deals/      # CRUD deals + upload
│   │       ├── blog/       # Gestion articles
│   │       └── users/      # Administration users
│   │
│   └── api/                # API RESTful
│       ├── auth/[...all]/  # Better Auth endpoints
│       ├── deals/          # GET/POST/PUT/DELETE
│       ├── favorites/      # Gestion favoris
│       ├── users/          # Admin users API
│       └── upload/         # Upload Supabase Storage
│
├── components/
│   ├── ui/                 # 24+ Shadcn UI components
│   ├── admin/              # DealForm, DealsTable, Sidebar
│   ├── layout/             # Header, Footer, AuthButton
│   ├── sections/           # Hero, DealsSection
│   └── providers/          # ThemeProvider
│
├── lib/
│   ├── auth.ts             # Better Auth config server
│   ├── auth-client.ts      # Better Auth client + hooks
│   ├── db.ts               # Prisma client singleton
│   └── supabase.ts         # Supabase client (storage)
│
├── hooks/                  # useFavorites (API + localStorage)
├── types/                  # TypeScript interfaces
└── data/                   # Mock data (migration reference)

prisma/
├── schema.prisma           # Models: User, Deal, Favorite, etc.
└── migrations/             # Database migrations history
```

## 🎯 Points Forts Techniques

### Backend Architecture
- **Type-safety end-to-end** - Prisma → API → Frontend
- **RESTful API** - Endpoints CRUD avec Zod validation
- **Session management** - Better Auth avec database persistence
- **Role-based access** - Middleware protection + permissions
- **Image upload** - Supabase Storage avec validation (5MB, formats)
- **Database migrations** - Prisma versioning avec rollback support

### Performance & Optimization
- **Turbopack** - Build 700x plus rapide que Webpack
- **Server Components** - Rendering optimisé côté serveur
- **API Route Handlers** - Streaming et edge-ready
- **Database pooling** - Supabase connection pooling
- **Image optimization** - Next.js Image + Supabase CDN
- **Code splitting** - Automatic bundle optimization

### Security & Authentication
- **Better Auth** - Modern auth avec social login support
- **Middleware protection** - Route guards automatiques
- **CSRF protection** - Built-in security headers
- **Environment variables** - Secrets management Vercel
- **SQL injection safe** - Prisma parameterized queries
- **XSS protection** - React automatic escaping

### Developer Experience
- **Full-stack TypeScript** - Types partagés DB → UI
- **Prisma Studio** - GUI pour gérer la database
- **Hot reload** - Turbopack instant updates
- **API testing** - Type-safe endpoints avec autocomplete
- **Database seeding** - Scripts de données de test
- **Error handling** - Consistent API error responses

### User Experience
- **Real-time updates** - API sync avec optimistic UI
- **Persistent state** - Favoris API + localStorage fallback
- **Admin dashboard** - Interface complète de gestion
- **Responsive design** - Mobile-first breakpoints
- **Dark mode** - System preference + manual toggle
- **Accessibility** - WCAG 2.1 + Radix UI primitives

## 🚦 Installation et Développement

```bash
# Clone et installation
git clone https://github.com/Messaoudiam/camino-tv.git
cd camino-tv
npm install

# Configuration environnement
cp .env.example .env
# Éditer .env avec tes credentials Supabase

# Base de données (Prisma local dev)
npx prisma dev              # Démarre serveur PostgreSQL local
npm run db:generate         # Génère Prisma Client
npm run db:migrate          # Applique les migrations
npm run db:studio           # Ouvre GUI Prisma Studio

# Développement avec Turbopack
npm run dev

# Build production
npm run build
npm run start

# Tests
npm test
npm run test:watch

# Linting
npm run lint
```

**Serveur de développement** : [http://localhost:3000](http://localhost:3000)
**Prisma Studio** : [http://localhost:5555](http://localhost:5555)

## 📊 Métriques de Qualité

### Frontend
- ✅ **Next.js 15.5.2** : App Router + React 19 + Turbopack
- ✅ **TypeScript** : 100% typé, strict mode, 0 erreurs
- ✅ **Shadcn UI** : 24+ composants accessibles
- ✅ **ESLint** : Code clean avec standards Next.js
- ✅ **Bundle Size** : ~175KB First Load JS optimisé
- ✅ **Responsive** : Mobile-first design system

### Backend
- ✅ **PostgreSQL + Prisma** : Base de données production-ready
- ✅ **Better Auth** : Authentification complète + OAuth
- ✅ **API RESTful** : 8+ endpoints avec validation Zod
- ✅ **Supabase Storage** : Upload d'images sécurisé
- ✅ **Middleware** : Protection routes + role-based access
- ✅ **Migrations** : Database versioning avec Prisma

### Production
- ✅ **Vercel** : Déployé avec CI/CD automatique
- ✅ **Environment** : Variables sécurisées (Supabase, Auth)
- ✅ **Performance** : Server Components + optimizations
- ✅ **SEO** : Metadata complètes + sitemap + robots.txt
- ✅ **Security** : Headers sécurisés + CSRF protection
- ✅ **Monitoring** : Ready pour analytics et error tracking

## 🎨 Design System Tailwind + Shadcn

### Palette de Couleurs
- **Brand Red** : #ef4444 (Camino TV) avec échelle 50-950
- **CSS Variables** : Mode sombre/clair via HSL variables
- **Semantic Colors** : Destructive, Muted, Accent avec foreground
- **Neutral Scale** : Border, Input, Ring pour cohérence UI

### Typographie Moderne
- **Geist Font Family** : Sans + Mono (Vercel optimisées)
- **Responsive Scale** : xs (0.75rem) → 6xl (3.75rem)
- **Line Heights** : Calculées pour lisibilité optimale

### Composants Shadcn UI
- **18 UI Components** : Button, Card, Dialog, Sheet, etc.
- **Radix Primitives** : Accessibilité et interactions natives
- **Variants System** : class-variance-authority pour type-safety
- **Customization** : Variables CSS pour thème cohérent

## 🔧 Configurations Techniques

### Tailwind CSS v4 Configuration
```typescript
// tailwind.config.ts - Configuration étendue
const config: Config = {
  darkMode: 'class', // next-themes integration
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Shadcn UI CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Camino TV brand palette
        brand: { 50: '#fef2f2', 500: '#ef4444', 950: '#450a0a' }
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)']
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'scale-in': 'scale-in 0.2s ease-out'
      }
    }
  }
};
```

### Hook useFavorites TypeScript
```typescript
// src/hooks/useFavorites.ts - Gestion d'état localStorage
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  
  return {
    favorites,           // string[] - IDs favoris
    toggleFavorite,     // (id: string) => void
    isFavorite,         // (id: string) => boolean
    favoritesCount      // number - Total
  };
}
```

## 📈 État Actuel et Roadmap

### ✅ Implémenté (v2.0) - **PRODUCTION FULL-STACK**
- **Backend complet** - PostgreSQL + Prisma + Better Auth
- **API RESTful** - 8+ endpoints CRUD avec validation Zod
- **Authentification** - Email/password + Google OAuth + sessions DB
- **Admin Dashboard** - KPI, CRUD deals, gestion users, upload images
- **Base de données** - Migrations Prisma + models (User, Deal, Favorite, etc.)
- **Storage** - Supabase Storage pour images avec API upload
- **Sécurité** - Middleware protection + role-based access
- **Interface complète** - 10+ pages (public + auth + admin)
- **Favoris API** - Integration backend avec fallback localStorage
- **Blog dynamique** - Pages [slug] + articles riches
- **Dark/Light mode** - Persistant avec next-themes
- **Design system** - Shadcn UI (24+ composants) + Tailwind v4
- **SEO & Performance** - Optimisé Next.js 15 + Server Components

### 🔄 Améliorations Prévues
- **Tests E2E** - Playwright pour scénarios complets admin
- **Blog Backend** - API CRUD pour création articles
- **Search** - Full-text search PostgreSQL ou Algolia
- **Email** - Transactional emails (welcome, reset password)
- **Analytics** - Vercel Analytics + custom events
- **Monitoring** - Sentry pour error tracking
- **Cache** - Redis pour sessions et API responses
- **Rate limiting** - Protection API endpoints

### 🚀 Évolutions Fonctionnelles
- **Social features** - Comments, reviews, ratings
- **Notifications** - Push notifications pour nouveaux deals
- **Mobile App** - React Native avec API partagée
- **CMS Integration** - Sanity ou Strapi pour contenu
- **Multi-langue** - i18n support FR/EN
- **Payment** - Stripe pour abonnements premium

## 👥 Équipe et Crédits

**Développement** : Démonstration technique moderne
- **Framework** : Next.js 15 + React 19 + TypeScript
- **Design System** : Shadcn UI + Tailwind CSS v4
- **Architecture** : App Router + Server Components

**Inspiré par l'équipe Camino TV** :
- **Sean** - Fondateur & Creator (profil intégré)
- **Mike** - Content Creator (articles de style)
- **Keusmo** - Influenceur Streetwear (collections)
- **Elssy** - Journaliste Mode (interviews)
- **Monroe** - Expert Sneakers (guides produits)
- **Piway** - Photographe (shooting photos)

## 📄 License et Utilisation

Projet de démonstration technique utilisant des technologies open source :
- **Next.js 15** - MIT License (Vercel)
- **Shadcn UI** - MIT License (composants Radix UI)
- **Tailwind CSS** - MIT License

Tous les droits sur la marque "Camino TV" appartiennent à leurs propriétaires respectifs.

---

## 🌟 Résumé du Projet

**🚀 Application Full-Stack Production-Ready - Next.js 15 + PostgreSQL + Better Auth**

*Plateforme complète de deals streetwear avec backend, authentification, admin dashboard et API*

**✅ Live Demo** : [https://camino-tv.vercel.app](https://camino-tv.vercel.app)

**🛠 Stack Complète** :
- **Frontend** : Next.js 15 • React 19 • TypeScript • Shadcn UI • Tailwind v4
- **Backend** : PostgreSQL • Prisma • Better Auth • Supabase Storage
- **API** : RESTful endpoints • Zod validation • Role-based access

**📊 Audit Technique** :
- ✅ **Build** : Réussi avec 0 erreurs TypeScript
- ✅ **Database** : Migrations Prisma + 6 models relationnels
- ✅ **Auth** : Email/password + Google OAuth opérationnels
- ✅ **API** : 8+ endpoints CRUD sécurisés
- ✅ **Admin** : Dashboard complet (deals, users, stats)
- ✅ **Storage** : Upload images vers Supabase (5MB max)
- ✅ **Security** : Middleware + CSRF + headers sécurisés
- ✅ **SEO** : Metadata complètes + sitemap + robots.txt

**🎯 Version 2.0 Full-Stack** - Production-ready avec backend complet !