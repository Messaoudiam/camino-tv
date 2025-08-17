# Design System Camino TV

## Identité Visuelle
- **Logo** : CAMINO en blanc sur fond noir avec point rouge signature
- **Couleurs principales** : Noir, Blanc, Rouge accent (#FF0000)
- **Style** : Minimaliste, moderne, streetwear premium
- **Inspiration** : cmno.tv, sites sneakers haut de gamme

## Palette de Couleurs
- **Background** : Noir profond ou blanc pur (mode sombre prioritaire)
- **Text** : Blanc sur noir, noir sur blanc (fort contraste)
- **Accent** : Rouge Camino (#FF0000) pour le point du logo et éléments d'action
- **Cards** : Gris très foncé ou blanc cassé selon le mode
- **Borders** : Gris subtil, presque invisible

## Typographie
- **Font principale** : `var(--font-sans)` (Geist Sans) - moderne et lisible
- **Font mono** : `var(--font-mono)` (Geist Mono) pour les prix/codes
- **Hiérarchie** :
  - Titres : Bold, contraste élevé
  - Prix : Prominent, facilement scannable
  - Marques : Mise en avant subtile

## Layout & Espacement
- **Grid produits** : Responsive, 2-4 colonnes selon l'écran
- **Cards produits** : Image + marque + prix + % réduction
- **Gaps** : Serrés mais respirants (gap-2 à gap-4)
- **Padding** : Généreux sur les côtés, minimal vertical

## Composants E-commerce
- **Cards produits** :
  - Image produit en 16:9 ou 1:1
  - Logo marque en overlay
  - Prix barré + nouveau prix
  - Badge pourcentage réduction
  - Hover effet subtil
- **Filtres** : Discrets mais accessibles
- **Search bar** : Prominent en header
- **CTA** : Rouge accent pour les actions principales

## Animations
- **Hover produits** : Légère élévation + scale subtil
- **Loading** : Skeleton screens pour les grids
- **Transitions** : Rapides (150-200ms) pour la réactivité
- **Micro-interactions** : Sur les favoris, partages

## Responsive Design
- **Mobile first** : 90% du trafic sneakers est mobile
- **Breakpoints** : 
  - xs: 2 colonnes produits
  - sm: 3 colonnes
  - lg: 4+ colonnes
- **Touch targets** : Minimum 44px pour mobile

## Performance UX
- **Images** : WebP, lazy loading, placeholder
- **Chargement** : Progressive, skeleton screens
- **Navigation** : Rapide, breadcrumbs clairs
- **Search** : Instantané, suggestions

## Patterns Streetwear/Deals
- **Prix** : Toujours prominents, couleur accent si réduction
- **Badges** : "NOUVEAU", "SOLDES", "LIMITÉ"
- **Marques** : Logos visibles mais pas intrusifs
- **Social proof** : Compteurs de vues/clics discrets

## Accessibilité
- **Contraste** : Excellent (noir/blanc)
- **Focus states** : Rouge accent
- **Alt text** : Descriptif pour tous les produits
- **Navigation clavier** : Optimisée pour les grids

## Dark Mode (Prioritaire)
- **Default** : Mode sombre (audience streetwear)
- **Toggle** : Disponible mais discret
- **Branding** : Logo blanc sur fond noir
- **Cohérence** : Même expérience que cmno.tv actuel