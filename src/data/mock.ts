/**
 * Données de démonstration pour Camino TV
 * Inspiré de l'univers sneakers/streetwear français
 */

import { Deal, Brand, BlogPost, BlogAuthor } from '@/types';

export const mockBrands: Brand[] = [
  {
    id: 'nike',
    name: 'Nike',
    logoUrl: '/brands/nike.svg',
    isPartner: true,
  },
  {
    id: 'adidas', 
    name: 'Adidas',
    logoUrl: '/brands/adidas.svg',
    isPartner: true,
  },
  {
    id: 'jordan',
    name: 'Air Jordan',
    logoUrl: '/brands/jordan.svg',
    isPartner: true,
  },
  {
    id: 'newbalance',
    name: 'New Balance',
    logoUrl: '/brands/newbalance.svg',
    isPartner: false,
  },
  {
    id: 'stussy',
    name: 'Stussy',
    logoUrl: '/brands/stussy.svg',
    isPartner: true,
  },
  {
    id: 'decathlon',
    name: 'Decathlon',
    logoUrl: '/brands/decathlon.svg',
    isPartner: true,
  },
];

export const mockDeals: Deal[] = [
  {
    id: '9',
    title: 'Veste Survêtement Decathlon AFLF',
    brand: 'Decathlon',
    originalPrice: 35,
    currentPrice: 35,
    discountPercentage: 0,
    imageUrl: '/decath-veste.jpg',
    category: 'streetwear',
    isNew: true,
    affiliateUrl: 'https://www.decathlon.fr/p/veste-de-survetement-decathlon-aflf-marron/_/R-p-360225?mc=8959692&c=noir',
  },
  {
    id: '10', 
    title: 'Pantalon Survêtement Decathlon AFLF',
    brand: 'Decathlon',
    originalPrice: 30,
    currentPrice: 30,
    discountPercentage: 0,
    imageUrl: '/decath-bas.jpg',
    category: 'streetwear',
    isNew: true,
    affiliateUrl: 'https://www.decathlon.fr/p/pantalon-de-survetement-decathlon-aflf-marron/_/R-p-360375?mc=8959697&c=noir',
  }
];

/**
 * Catégories pour la navigation et les filtres
 */
export const categories = [
  { id: 'sneakers', name: 'Sneakers', count: 6 },
  { id: 'streetwear', name: 'Streetwear', count: 3 },
  { id: 'accessories', name: 'Accessoires', count: 0 },
  { id: 'electronics', name: 'Tech', count: 0 },
  { id: 'lifestyle', name: 'Lifestyle', count: 1 },
] as const;

/**
 * Auteurs du blog Camino TV
 */
export const mockAuthors: BlogAuthor[] = [
  {
    id: 'sean',
    name: 'Sean',
    avatar: '/sean.jpeg',
    role: 'Fondateur & Creator',
  },
  {
    id: 'mike',
    name: 'Mike',
    avatar: '/mike.png',
    role: 'Content Creator',
  },
  {
    id: 'keusmo',
    name: 'Keusmo',
    avatar: '/keusmo.png',
    role: 'Influenceur Streetwear',
  },
  {
    id: 'elssy',
    name: 'Elssy',
    avatar: '/elssy.jpeg',
    role: 'Journaliste Mode',
  },
  {
    id: 'monroe',
    name: 'Monroe',
    avatar: '/monroe.jpeg',
    role: 'Expert Sneakers',
  },
  {
    id: 'piway',
    name: 'Piway',
    avatar: '/piway.jpeg',
    role: 'Photographe',
  },
  {
    id: 'messaoud',
    name: 'Messaoud',
    avatar: '/mess.png',
    role: 'Développeur',
  },
];

/**
 * Articles de blog pour la démonstration
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: '7',
    title: 'Thread : 20 créateurs français et belges à suivre absolument',
    slug: 'thread-20-createurs-francais-belges-suivre',
    excerpt: 'Notre sélection exclusive des pépites créatives francophones qui font vibrer la scène culturelle. De la musique au streetwear, découvrez les talents qui façonnent l\'avenir.',
    content: `# 20 Créateurs FR/BE : Les pépites qui nous inspirent

L'équipe Camino TV a partagé sur X notre sélection de créateurs français et belges qui méritent toute votre attention. Voici notre thread développé avec nos coups de cœur.

## Pourquoi ce thread ?

Dans un paysage créatif en constante évolution, il est essentiel de mettre en lumière les talents qui façonnent la culture francophone. Ces créateurs apportent une vision unique, mêlant héritage culturel et innovation contemporaine.

## Le thread complet

Retrouvez ci-dessous notre thread Twitter complet avec tous les créateurs sélectionnés :

**Note :** Le thread Twitter est intégré automatiquement ci-dessous pour une expérience optimale.`,
    imageUrl: '/blog/creators-frbe.jpeg',
    category: 'culture',
    author: mockAuthors[0], // Sean
    publishedAt: '2024-01-16',
    readTime: 10,
    tags: ['créateurs', 'france', 'belgique', 'culture', 'thread'],
    isFeature: true,
  },
  {
    id: '8',
    title: 'Supraw x Uniqlo : L\'art toulousain s\'invite aux Zinzins de l\'Espace',
    slug: 'supraw-uniqlo-collaboration-zinzins-espace-toulouse',
    excerpt: 'L\'artiste toulousain Supraw collabore avec Uniqlo pour une collection exclusive inspirée des Zinzins de l\'Espace. Pop-up éphémère à Toulouse les 28/02/25 et 01/03/25.',
    content: `# Supraw x Uniqlo : Quand l'art toulousain rencontre les Zinzins de l'Espace

L'univers créatif toulousain s'apprête à vivre un moment unique avec la collaboration entre **Supraw** (Lucas Chauvin) et **Uniqlo**. Cette collection exclusive, inspirée de la mythique série animée française "Les Zinzins de l'Espace", sera dévoilée lors d'un pop-up éphémère dans la ville rose.

![Aperçu de la collaboration Supraw x Uniqlo](/blog/supraw2.webp)

## L'événement incontournable du streetwear toulousain

**📅 Dates :** 28/02/25 et 01/03/25  
**📍 Lieu :** Uniqlo Toulouse, 3 Rue du Poids de l'Huile  
**⏰ Modalités :** Sur inscription, premier arrivé, premier servi

Cette collaboration marque une étape importante dans le parcours de Supraw, qui après une année 2024 riche en projets (exposition parisienne "Let me expose my art", collaboration avec Mokovel), s'associe aujourd'hui à la géante japonaise Uniqlo.

![Collection Supraw x Uniqlo Zinzins de l'Espace](/blog/supraw3.jpg)

## Une collection qui réveille la nostalgie

La collection **Supraw x Uniqlo** puise son inspiration dans l'univers déjanté des "Zinzins de l'Espace", série culte des années 90-2000 qui a marqué toute une génération. L'artiste toulousain revisite cet univers avec sa patte créative unique, proposant :

### Gamme de produits
- **Denim** revisité aux couleurs de l'espace
- **Sweatwear** avec personnalisations exclusives
- **Pièces limitées colorées** en quantité restreinte  
- **Pièces monochromes** pour les amateurs de sobriété
- **Service de customisation** sur place

![Pièces de la collection Supraw Uniqlo](/blog/supraw4.jpg)

### Tarification accessible
La collection s'inscrit dans la philosophie Uniqlo avec des prix allant de **34,90€ à 59,90€**, rendant l'art streetwear accessible au plus grand nombre.

## Un événement sous le signe de l'exclusivité

L'événement promet d'être un moment fort pour la communauté streetwear toulousaine :

- **Inscription obligatoire** pour garantir sa place
- **Limite d'un article par personne** pour une distribution équitable
- **Cadeaux surprise** avec distribution aléatoire de jouets
- **QR code Camino** requis pour l'achat (collaboration exclusive)

![Événement pop-up Supraw x Uniqlo Toulouse](/blog/supraw5.jpg)

## Supraw : L'ascension d'un talent toulousain

Lucas Chauvin, alias Supraw, incarne la nouvelle génération d'artistes français qui mélangent culture pop et art contemporain. Après avoir conquis Paris en 2024, il revient dans sa ville natale pour cette collaboration inédite qui promet de marquer les esprits.

Cette collaboration Supraw x Uniqlo illustre parfaitement la montée en puissance de la scène créative toulousaine et l'intérêt croissant des marques internationales pour les talents locaux français.

**Rendez-vous fin février pour découvrir cette collection qui promet de réveiller l'enfant qui sommeille en nous !**`,
    imageUrl: '/blog/supraw.jpg',
    category: 'streetwear',
    author: mockAuthors[0], // Sean
    publishedAt: '2025-01-19',
    readTime: 6,
    tags: ['supraw', 'uniqlo', 'toulouse', 'collaboration', 'zinzins', 'art'],
    isFeature: false,
  },
];

/**
 * Catégories de blog pour la navigation
 */
export const blogCategories = [
  { id: 'culture', name: 'Culture', count: 3 },
  { id: 'streetwear', name: 'Streetwear', count: 2 },
  { id: 'musique', name: 'Musique', count: 1 },
  { id: 'interview', name: 'Interviews', count: 1 },
  { id: 'lifestyle', name: 'Lifestyle', count: 1 },
  { id: 'tendances', name: 'Tendances', count: 1 },
] as const;