# Instructions pour Camino TV

## Contexte du projet

Camino TV est une plateforme de deals streetwear et sneakers inspirée de l'univers Camino TV. Le projet sert de démonstration technique avec un focus sur l'expérience utilisateur moderne et les bonnes pratiques de développement frontend.

## Guidelines de développement

### Architecture et structure

1. **Respecter l'architecture App Router** de Next.js 15
2. **Utiliser le TypeScript strict** - Éviter `any`, préférer les interfaces explicites
3. **Composants modulaires** - Séparer UI, logic et data
4. **Hooks personnalisés** - Extraire la logique réutilisable

### Styling et Design

1. **Design System Tailwind** - Utiliser les classes utilitaires cohérentes
2. **Composants Shadcn UI** - Préférer les composants existants avant d'en créer
3. **Mode sombre/clair** - Tester toujours les deux thèmes
4. **Responsive design** - Mobile-first approach obligatoire

### Performance et qualité

1. **Images optimisées** - Toujours utiliser Next.js Image component
2. **Lazy loading** - Composants et données chargés à la demande
3. **Bundle optimization** - Import dynamique pour les gros composants
4. **SEO friendly** - Métadonnées et structure sémantique

### Conventions de code

1. **Nommage explicite** - Components en PascalCase, hooks en camelCase
2. **Props typées** - Interface dédiée pour chaque composant
3. **JSDoc commentaires** - Documenter les fonctions complexes
4. **Consistent formatting** - ESLint + Prettier

## Fonctionnalités spécifiques

### Système de favoris
- Persistance localStorage obligatoire
- Synchronisation en temps réel
- Interface utilisateur intuitive (heart icon)
- Gestion des erreurs gracieuse

### Navigation et filtrage
- État des filtres dans URL (searchParams)
- Filtrage temps réel sans rechargement
- Indicateurs visuels pour les états actifs
- Reset facile des filtres

### Blog et contenu
- Pages dynamiques avec [slug]
- Rich content avec markdown support
- Métadonnées SEO complètes
- Twitter embeds fonctionnels

## Données et API

### Actuellement (Mock data)
- Utiliser `src/data/mock.ts` pour toutes les données
- Maintenir la cohérence des IDs entre composants
- Respecter les interfaces TypeScript définies

### Évolution future (API)
- Prévoir les states de loading/error
- Structure compatible avec fetch/SWR
- Pagination et infinite scroll ready

## Tests et validation

### Checklist avant commit
- [ ] TypeScript compile sans erreur
- [ ] ESLint passe sans warning  
- [ ] Design responsive testé (mobile + desktop)
- [ ] Mode sombre testé
- [ ] Accessibility basique vérifiée
- [ ] Performance acceptable (pas de lag notable)

### Tests manuels prioritaires
1. Navigation entre toutes les pages
2. Système de favoris (add/remove/persist)
3. Filtres deals (catégories, prix, etc.)
4. Toggle dark/light mode
5. Responsive breakpoints majeurs

## Bonnes pratiques spécifiques

### Gestion d'état
- useState pour état local simple
- Custom hooks pour logique complexe
- localStorage pour persistance utilisateur
- Props drilling évité avec composition

### Styling
- Classes Tailwind réutilisables
- CSS modules évités (Tailwind suffit)
- Animations subtiles et performantes
- Couleurs depuis le design system

### Performance
- Dynamic imports pour pages lourdes
- Image lazy loading par défaut
- Debounce pour search/filters
- Minimal re-renders

## Debugging et troubleshooting

### Problèmes courants
1. **Hydration mismatch** - Vérifier localStorage usage
2. **Theme flicker** - Supplier theme par défaut
3. **Images broken** - Checker les chemins public/
4. **TypeScript errors** - Vérifier les interfaces

### Outils de debug
- Next.js dev tools
- React DevTools
- Browser DevTools Performance tab
- Lighthouse pour audit qualité