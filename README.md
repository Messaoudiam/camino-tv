# 🎯 Camino TV - Plateforme Deals Streetwear

> **Projet de démonstration technique** - Showcase moderne avec Next.js 15 et React 19

Une plateforme élégante inspirée de l'univers Camino TV pour découvrir les meilleurs deals sneakers et streetwear. Développée avec les dernières technologies web et un focus sur l'expérience utilisateur moderne.

## 🚀 Démonstration Live

**[Voir le projet en ligne →](https://camino-demo.vercel.app)** *(déploiement Vercel)*

![Camino TV Preview](public/camino_logo.jpg)

## ✨ Fonctionnalités Principales

### 🎨 Interface Moderne
- **Design System** complet avec Shadcn UI et Tailwind CSS v4
- **Dark/Light Mode** avec transition fluide (next-themes)
- **Animations** et micro-interactions personnalisées
- **Responsive Design** mobile-first sur tous devices

### 🛍️ Catalogue Deals Interactif
- **Grille produits** responsive avec DealCard optimisées
- **Badges visuels** : Nouveau, Limité, Réductions
- **Images optimisées** Next.js avec lazy loading
- **Navigation fluide** entre les catégories

### ❤️ Système de Favoris Avancé
- **Hook personnalisé** useFavorites avec TypeScript strict
- **Persistance localStorage** synchronisée en temps réel
- **Page dédiée** /favorites pour la wishlist utilisateur
- **État global** partagé entre tous les composants

### 📝 Blog Intégré
- **Pages dynamiques** [slug] avec App Router Next.js 15
- **Rich content** avec support markdown et Twitter embeds
- **Catégorisation** par culture, streetwear, interviews, etc.
- **Équipe Camino TV** avec profils des créateurs

### 📱 Expérience Mobile Optimisée
- **Navigation responsive** avec header adaptatif
- **Performance** optimisée (React 19 + Next.js 15)
- **Interactions tactiles** natives iOS/Android
- **Bundle optimisé** avec code splitting automatique

## 🛠 Stack Technique Moderne

### Core Framework
- **Next.js 15.4.6** - App Router, Server Components, Turbopack
- **React 19.1.0** - Nouvelles APIs, performance améliorée
- **TypeScript 5** - Configuration stricte, zéro `any`

### UI & Styling
- **Tailwind CSS v4** - Design system avec variables CSS personnalisées
- **Shadcn UI** - Composants accessibles basés sur Radix UI primitives
- **next-themes 0.4.6** - Gestion dark/light mode server-safe
- **Lucide React** - Iconographie moderne et optimisée
- **class-variance-authority** - Variants de composants type-safe

### État & Hooks
- **Custom Hooks** - useFavorites avec localStorage sync
- **React 19** - Nouvelles APIs de state management
- **TypeScript Interfaces** - Types stricts pour toutes les données

### Qualité & Développement
- **ESLint 9** - Configuration Next.js avec règles modernes
- **Turbopack** - Bundler ultra-rapide en développement
- **Components.json** - Configuration Shadcn UI standardisée

## 🏗 Architecture Next.js 15 App Router

```
src/
├── app/                 # App Router Next.js 15
│   ├── blog/           # Blog avec pages dynamiques [slug]
│   │   ├── [slug]/     # Articles individuels
│   │   └── page.tsx    # Liste des articles
│   ├── deals/          # Catalogue produits avec filtres
│   ├── favorites/      # Page wishlist utilisateur
│   ├── team/           # Présentation équipe Camino TV
│   ├── layout.tsx      # Root layout avec métadonnées SEO
│   └── globals.css     # Styles globaux Tailwind + variables CSS
├── components/
│   ├── ui/             # Shadcn UI components (18 composants)
│   ├── layout/         # Header responsive, Footer
│   ├── sections/       # Hero, DealsSection modulaires
│   ├── blog/           # BlogCard, BlogGrid, TwitterEmbed
│   ├── demo/           # DealCard, DealGrid spécifiques
│   └── providers/      # ThemeProvider (next-themes)
├── hooks/              # useFavorites.ts - localStorage sync
├── lib/                # utils.ts - Tailwind merge helpers
├── types/              # index.ts - Interfaces TypeScript strictes
└── data/               # mock.ts - 10 deals + 7 articles + équipe
```

## 🎯 Points Forts Techniques

### Performance Next.js 15
- **Turbopack** - Build 700x plus rapide que Webpack
- **App Router** - Server Components + optimisations automatiques
- **Next.js Image** - Lazy loading et formats modernes (WebP, AVIF)
- **Code splitting** - Bundles optimisés par route

### Accessibilité Radix UI
- **Primitives accessibles** - ARIA patterns complets
- **Navigation clavier** - Focus management automatique
- **Screen readers** - Semantic HTML + live regions
- **Contraste WCAG 2.1** - Vérification automatique dark/light

### Developer Experience
- **TypeScript strict** - 100% typé, interfaces exhaustives
- **Shadcn UI** - Composants copy-paste customisables
- **ESLint + Next.js** - Règles optimisées React 19
- **File-based routing** - Architecture App Router intuitive

### User Experience
- **État persistant** - Favoris localStorage synchronisés
- **Navigation fluide** - Transitions et animations CSS
- **Responsive design** - Breakpoints mobile-first
- **Dark mode** - Préférence système + toggle manuel

## 🚦 Installation et Développement

```bash
# Clone et installation
git clone <repo-url>
cd camino-tv
npm install

# Développement avec Turbopack (ultra-rapide)
npm run dev --turbo

# Build production optimisé
npm run build
npm run start

# Linting Next.js ESLint
npm run lint
```

**Serveur de développement** : [http://localhost:3000](http://localhost:3000)

## 📊 Métriques de Qualité

- ✅ **Next.js 15** : App Router + React 19 + Turbopack
- ✅ **TypeScript** : Configuration stricte, 100% typé
- ✅ **Shadcn UI** : 18 composants accessibles intégrés
- ✅ **Responsive** : Mobile-first design system
- ✅ **Performance** : Optimisations automatiques Next.js
- ✅ **SEO Ready** : Métadonnées et structure sémantique

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

### ✅ Implémenté (v1.0)
- **Interface complète** - 5 pages responsives (Home, Deals, Blog, Team, Favorites)
- **Système favoris** - Hook localStorage + persistance temps réel
- **Blog dynamique** - Pages [slug] + articles riches avec Twitter embeds
- **Dark/Light mode** - Thème système + toggle manuel
- **Design system** - Shadcn UI + 18 composants + variables CSS

### 🔄 Améliorations Techniques
- **Tests** - Jest + Testing Library + Playwright E2E
- **Performance** - Bundle analyzer + Core Web Vitals monitoring
- **SEO** - Sitemap + structured data + Open Graph
- **PWA** - Service Worker + offline support

### 🚀 Évolutions Fonctionnelles
- **API Backend** - Vraies données deals avec CMS headless
- **Authentification** - Auth.js + comptes utilisateurs
- **Recherche** - Algolia ou solution full-text
- **Analytics** - Vercel Analytics + événements personnalisés

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

**🚀 Showcase Technique Next.js 15 + React 19**

*Démonstration des dernières technologies web avec focus UX/UI moderne*

**Stack** : Next.js 15 • React 19 • TypeScript • Shadcn UI • Tailwind v4