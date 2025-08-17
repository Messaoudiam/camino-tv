# Guidelines de Développement Camino TV

## Règles Générales (Candidature)
- Toujours respecter ESLint et TypeScript
- Code propre et bien commenté pour la review
- Privilégier la lisibilité et la maintenabilité
- Démonstration des bonnes pratiques modernes
- Performance optimale pour impressionner

## TypeScript - Démo Frontend
- **Types stricts** : Démontrer la maîtrise du typage TypeScript
- **Interfaces** : Pour les props des composants, données de démo
- **Éviter `any`** : Montrer les bonnes pratiques
- **Génériques** : Pour les composants réutilisables

## React/Next.js - Showcase Moderne
- **Server Components** : Utiliser les dernières features Next.js 15
- **Client Components** : Pour l'interactivité et les animations
- **App Router** : Démontrer la maîtrise du nouveau routing
- **Hooks personnalisés** : Extraire la logique réutilisable
- **Optimizations** : Image, fonts, bundle size

## Structure Frontend Démo
```
/src/components/
  /ui/              # Shadcn components
  /layout/          # Header, Footer, Navigation
  /sections/        # Sections de la page (Hero, Products, etc.)
  /demo/            # Composants pour la démo
/src/types/
  index.ts          # Types pour la démo
/src/data/
  mock.ts           # Données de démonstration
```

## TailwindCSS v4 - Style Camino
- **Variables** : Utiliser le theme Camino (noir/blanc/rouge)
- **Grid responsive** : 2 cols mobile, 4+ desktop
- **Spacing** : Minimal pour maximiser les produits visibles
- **Hover effects** : Subtils, rapides (150ms)

## Shadcn/ui - Composants E-commerce
- **Card** : Base pour les ProductCard
- **Badge** : Pour les pourcentages de réduction
- **Button** : Rouge accent pour les CTA
- **Input** : Pour la search bar
- **Skeleton** : Pour les états de chargement

## Performance Frontend
- **Images** : Next.js Image avec optimisation automatique
- **Fonts** : Optimisation avec next/font
- **Bundle** : Tree shaking et code splitting
- **Mémoïsation** : React.memo pour les composants coûteux
- **Core Web Vitals** : LCP, FID, CLS optimisés

## Code Quality (Candidature)
- **Comments** : Code bien documenté
- **Naming** : Variables et fonctions explicites
- **Architecture** : Séparation des responsabilités
- **Patterns** : Composition over inheritance
- **Tests** : Si temps disponible, quelques tests basiques

## Démo & Portfolio
- **README** : Documentation du projet
- **Screenshots** : Captures d'écran du résultat
- **Deploy** : Lien vers la démo live
- **Git** : Commits propres avec messages clairs
- **Responsiveness** : Parfait sur tous les devices

## Mobile-First (Priorité absolue)
- **Touch targets** : 44px minimum
- **Scroll performance** : Optimisé pour les longues listes
- **Offline** : Graceful degradation si pas de réseau
- **PWA ready** : Service worker pour le cache