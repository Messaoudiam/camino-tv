# Camino TV - Configuration Claude

## À propos du projet

Camino TV est une plateforme moderne de deals streetwear et sneakers développée avec Next.js 15, React 19 et TypeScript. Le projet présente une interface élégante inspirée de l'univers Camino TV avec un système de favoris, des filtres avancés, un blog intégré, et une expérience utilisateur optimisée.

## Architecture du projet

```
src/
├── app/                 # Pages Next.js App Router
│   ├── blog/           # Articles de blog avec pages dynamiques
│   ├── deals/          # Catalogue de deals avec filtres
│   ├── favorites/      # Page des produits favoris  
│   ├── team/           # Présentation de l'équipe Camino TV
│   └── layout.tsx      # Layout global avec métadonnées SEO
├── components/
│   ├── ui/             # Composants Shadcn UI (Radix + Tailwind)
│   ├── layout/         # Header, Footer, Navigation responsive
│   ├── sections/       # Hero, DealsSection modulaires
│   ├── blog/           # BlogCard, BlogGrid, TwitterEmbed
│   ├── demo/           # DealCard, DealGrid spécifiques
│   └── providers/      # ThemeProvider pour dark/light mode
├── hooks/              # useFavorites.ts - gestion d'état localStorage
├── lib/                # utils.ts - utilitaires Tailwind/clsx
├── types/              # Interfaces TypeScript strictes
└── data/               # mock.ts - données de démonstration
```

## Stack technique

### Core
- **Next.js 15** - App Router, SSG, optimisations automatiques
- **React 19** - Server Components, nouvelles APIs
- **TypeScript** - Configuration stricte, zéro `any`

### Styling & UI
- **Tailwind CSS v4** - Design system avec variables CSS
- **Shadcn UI** - Composants accessibles basés sur Radix UI
- **next-themes** - Gestion dark/light mode

### Données & État
- **Custom hooks** - useFavorites pour persistance localStorage
- **Mock data** - Données structurées pour démonstration

## Fonctionnalités implémentées

### 🏠 Page d'accueil
- Hero section avec navigation CTA
- Section deals avec aperçu des meilleurs deals
- Design responsive avec animations fluides

### 🛍️ Page Deals (/deals)
- Grille de produits avec DealCard responsive
- Système de favoris avec hooks personnalisés
- Filtrage par catégorie (sneakers, streetwear, etc.)
- Affichage des réductions et badges "Nouveau"/"Limité"

### ❤️ Page Favoris (/favorites)
- Gestion des favoris via localStorage
- Interface dédiée pour la wishlist utilisateur
- Synchronisation temps réel avec le hook useFavorites

### 📝 Blog (/blog)
- Système d'articles avec pages dynamiques [slug]
- BlogGrid avec différents layouts (featured, compact)
- Intégration TwitterEmbed pour les threads
- Catégorisation et métadonnées complètes

### 👥 Page Équipe (/team)
- Présentation de l'équipe Camino TV
- Design cards avec photos et rôles

### 🎨 Design System
- Mode sombre/clair avec transition fluide
- Palette de couleurs Camino TV (rouge primary)
- Composants Shadcn UI customisés
- Animations CSS et micro-interactions

## Hooks personnalisés

### useFavorites
```typescript
// Gestion complète des favoris avec localStorage
const {
  favorites,           // string[] - IDs des favoris
  isLoading,          // boolean - État de chargement
  addToFavorites,     // (id: string) => void
  removeFromFavorites, // (id: string) => void  
  toggleFavorite,     // (id: string) => void
  isFavorite,         // (id: string) => boolean
  favoritesCount      // number - Nombre total
} = useFavorites();
```

## Types principaux

### Deal
```typescript
interface Deal {
  id: string;
  title: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  discountPercentage: number;
  imageUrl: string;
  category: DealCategory;
  isNew?: boolean;
  isLimited?: boolean;
  affiliateUrl: string;
}
```

### BlogPost
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: BlogCategory;
  author: BlogAuthor;
  publishedAt: string;
  readTime: number;
  tags: string[];
  isFeature?: boolean;
}
```

## Données de démonstration

Le fichier `src/data/mock.ts` contient :
- **mockDeals** : 10 produits (sneakers Nike, Jordan, Adidas + streetwear)
- **mockBrands** : Marques partenaires (Nike, Adidas, Jordan, New Balance, Stussy, Decathlon)
- **mockBlogPosts** : 7 articles de blog avec contenu riche
- **mockAuthors** : Équipe Camino TV (Sean, Mike, Keusmo, Elssy, Monroe, Piway)

## Scripts disponibles

```bash
npm run dev          # Développement avec Turbopack
npm run build        # Build production optimisé
npm run start        # Serveur production
npm run lint         # ESLint avec configuration Next.js
```

## Performance & Qualité

- **TypeScript strict** : 100% typé, zéro erreur
- **ESLint** : Configuration Next.js avec règles strictes
- **Accessibilité** : Composants Radix UI accessibles
- **SEO** : Métadonnées complètes, structure sémantique
- **Performance** : Images Next.js optimisées, lazy loading

## Bonnes pratiques

1. **Composants réutilisables** - Architecture modulaire
2. **Props typées** - Interfaces dédiées pour chaque composant  
3. **Hooks personnalisés** - Logique métier réutilisable
4. **Styling cohérent** - Design system Tailwind + Shadcn UI
5. **Structure claire** - Séparation des responsabilités

## Améliorations possibles

- Intégration API réelle pour les deals
- Système d'authentification utilisateur  
- PWA avec service worker
- Tests unitaires et e2e
- Analytics et tracking utilisateur
- Optimisations bundle et Core Web Vitals