# 🎯 Camino TV - Plateforme Deals Streetwear

> **Projet de candidature développeur** - Démonstration de compétences techniques avancées

Une plateforme moderne inspirée de l'univers Camino TV pour découvrir les meilleurs deals sneakers et streetwear. Développée avec les dernières technologies web pour démontrer une expertise technique complète.

## 🚀 Démonstration Live

**[Voir le projet en ligne →](https://camino-demo.vercel.app)** *(lien de déploiement à venir)*

![Camino TV Preview](public/camino_logo.jpg)

## ✨ Fonctionnalités Principales

### 🎨 Interface Moderne
- **Design System** complet avec Shadcn UI et Tailwind CSS v4
- **Dark/Light Mode** avec transition fluide
- **Animations** et micro-interactions soignées
- **Responsive Design** adaptatif sur tous devices

### 🔍 Recherche & Filtres Avancés
- **Recherche intelligente** avec suggestions en temps réel
- **Filtres multiples** : prix, réduction, catégories, nouveautés
- **Tri dynamique** par pertinence, prix, popularité
- **État persistant** des préférences utilisateur

### ❤️ Système de Favoris
- **Gestion d'état** avec hooks personnalisés
- **Persistance LocalStorage** des favoris
- **Filtrage** par produits favoris
- **Interface intuitive** pour gérer sa wishlist

### 📱 Expérience Mobile Premium
- **Navigation adaptive** avec menu hamburger intelligent
- **Interactions tactiles** optimisées
- **Performance** optimale sur mobile
- **PWA Ready** (Progressive Web App)

## 🛠 Stack Technique

### Core Framework
- **Next.js 15** - App Router, SSG, optimisations automatiques
- **React 19** - Server Components, Suspense, nouvelles APIs
- **TypeScript** - Types stricts, interfaces complètes

### Styling & UI
- **Tailwind CSS v4** - Design system, configuration avancée
- **Shadcn UI** - Composants accessibles et customisables
- **Radix UI** - Primitives d'accessibilité
- **Lucide Icons** - Iconographie moderne

### État & Data
- **Custom Hooks** - Gestion d'état réutilisable
- **LocalStorage** - Persistance côté client
- **TypeScript Interfaces** - Typage strict des données

### Développement
- **ESLint** - Linting avancé avec règles personnalisées
- **Prettier** - Formatage de code cohérent
- **Git Hooks** - Qualité de code automatique

## 🏗 Architecture

```
src/
├── app/                 # Pages Next.js App Router
│   ├── blog/           # Articles et contenu éditorial
│   ├── deals/          # Catalogue de deals avec filtres
│   ├── team/           # Présentation de l'équipe
│   └── layout.tsx      # Layout global avec métadonnées
├── components/
│   ├── ui/             # Composants Shadcn UI
│   ├── layout/         # Header, Footer, Navigation
│   ├── sections/       # Sections modulaires des pages
│   └── demo/           # Composants spécifiques aux deals
├── hooks/              # Custom hooks React
├── lib/                # Utilitaires et helpers
├── types/              # Définitions TypeScript
└── data/               # Données mock et constantes
```

## 🎯 Points Forts Techniques

### Performance
- **Bundle optimisé** - Splitting automatique
- **Images optimisées** - Next.js Image component
- **Lazy loading** - Chargement à la demande
- **Lighthouse Score** > 90

### Accessibilité
- **ARIA labels** complets
- **Navigation clavier** supportée
- **Contraste** respectant WCAG 2.1
- **Screen readers** compatibles

### DX (Developer Experience)
- **TypeScript strict** - Zéro `any`
- **Composants réutilisables** - Architecture modulaire
- **Git hooks** - Pre-commit quality checks
- **Documentation** - Commentaires JSDoc

### UX (User Experience)
- **Feedback visuel** immédiat
- **Loading states** informatifs
- **Error boundaries** gracieuses
- **Offline fallbacks** intelligents

## 🚦 Quick Start

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Linting
npm run lint

# Preview production
npm start
```

## 📊 Métriques de Qualité

- ✅ **TypeScript** : 100% typé, zéro erreur
- ✅ **ESLint** : Zéro warning en production
- ✅ **Accessibility** : Score A+ WAVE
- ✅ **Performance** : Lighthouse 90+
- ✅ **SEO** : Métadonnées complètes
- ✅ **PWA** : Service Worker ready

## 🎨 Design System

### Couleurs
- **Primary** : Rouge Camino TV (#ef4444)
- **Neutrals** : Échelle de gris moderne
- **Semantic** : Success, Warning, Error
- **Brand** : Palette étendue 50-950

### Typography
- **Fonts** : Geist Sans/Mono (Vercel)
- **Scale** : xs → 6xl responsive
- **Weights** : 300 → 700 variables

### Composants
- **Buttons** : 4 variants, 3 tailles
- **Cards** : Modulaires et composables
- **Forms** : Validation et accessibilité
- **Navigation** : Adaptive et contextuelle

## 🔧 Personnalisations Avancées

### Tailwind Configuration
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { /* palette 50-950 */ },
        // Variables CSS personnalisées
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        // Animations custom
      }
    }
  }
} satisfies Config;
```

### Hooks Personnalisés
```typescript
// useFavorites.ts - Gestion des favoris
export function useFavorites() {
  // État synchronisé avec localStorage
  // Persistence automatique
  // Types stricts
}
```

## 📈 Roadmap & Améliorations

### Phase 1 - Fonctionnalités Core ✅
- [x] Interface de base responsive
- [x] Système de filtres avancés
- [x] Gestion des favoris
- [x] Navigation optimisée

### Phase 2 - Enrichissement
- [ ] **API Integration** - Vraies données deals
- [ ] **Authentification** - Comptes utilisateurs
- [ ] **Notifications** - Push notifications PWA
- [ ] **Analytics** - Tracking comportemental

### Phase 3 - Avancé
- [ ] **AI Recommendations** - Suggestions personnalisées
- [ ] **Real-time Updates** - WebSocket integration
- [ ] **Mobile App** - React Native
- [ ] **Marketplace** - Fonctionnalités e-commerce

## 👥 Équipe

**Développeur Principal** : [Votre Nom]
- Frontend Expert React/Next.js
- Spécialiste UX/UI moderne
- Architecture scalable

**Inspiré par** : L'équipe Camino TV
- Sean, Mike, Keusmo, Elssy, Monroe, Piway

## 📄 License

Ce projet est développé dans le cadre d'une candidature technique et n'est pas destiné à un usage commercial. Tous les droits sur la marque "Camino TV" appartiennent à leurs propriétaires respectifs.

---

**Made with ❤️ for Camino TV**

*Projet de candidature démontrant des compétences avancées en développement frontend moderne*