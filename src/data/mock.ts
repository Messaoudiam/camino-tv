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
];

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Air Jordan 1 Retro High OG "Bred Toe"',
    brand: 'Air Jordan',
    originalPrice: 169,
    currentPrice: 129,
    discountPercentage: 24,
    imageUrl: '/products/jordan-bred-toe.jpg',
    category: 'sneakers',
    isNew: true,
    affiliateUrl: '#',
  },
  {
    id: '2', 
    title: 'Nike Dunk Low "Panda"',
    brand: 'Nike',
    originalPrice: 109,
    currentPrice: 89,
    discountPercentage: 18,
    imageUrl: '/products/nike-dunk-panda.jpg',
    category: 'sneakers',
    affiliateUrl: '#',
  },
  {
    id: '3',
    title: 'Adidas Yeezy Boost 350 V2 "Zebra"',
    brand: 'Adidas',
    originalPrice: 220,
    currentPrice: 199,
    discountPercentage: 10,
    imageUrl: '/products/yeezy-zebra.jpg',
    category: 'sneakers',
    isLimited: true,
    affiliateUrl: '#',
  },
  {
    id: '4',
    title: 'New Balance 990v5 "Grey"',
    brand: 'New Balance',
    originalPrice: 185,
    currentPrice: 149,
    discountPercentage: 19,
    imageUrl: '/products/nb-990v5.jpg',
    category: 'sneakers',
    affiliateUrl: '#',
  },
  {
    id: '5',
    title: 'Stussy World Tour Hoodie',
    brand: 'Stussy',
    originalPrice: 120,
    currentPrice: 89,
    discountPercentage: 26,
    imageUrl: '/products/stussy-hoodie.jpg',
    category: 'streetwear',
    isNew: true,
    affiliateUrl: '#',
  },
  {
    id: '6',
    title: 'Nike Air Force 1 "Triple White"',
    brand: 'Nike',
    originalPrice: 109,
    currentPrice: 79,
    discountPercentage: 28,
    imageUrl: '/products/af1-white.jpg',
    category: 'sneakers',
    affiliateUrl: '#',
  },
  {
    id: '7',
    title: 'Adidas Forum Low "White Black"',
    brand: 'Adidas',
    originalPrice: 100,
    currentPrice: 69,
    discountPercentage: 31,
    imageUrl: '/products/forum-low.jpg',
    category: 'sneakers',
    affiliateUrl: '#',
  },
  {
    id: '8',
    title: 'Jordan 4 Retro "Black Cat"',
    brand: 'Air Jordan',
    originalPrice: 199,
    currentPrice: 169,
    discountPercentage: 15,
    imageUrl: '/products/jordan4-blackcat.jpg',
    category: 'sneakers',
    isLimited: true,
    affiliateUrl: '#',
  }
];

/**
 * Catégories pour la navigation et les filtres
 */
export const categories = [
  { id: 'sneakers', name: 'Sneakers', count: 6 },
  { id: 'streetwear', name: 'Streetwear', count: 1 },
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
    avatar: '/mike.jpeg',
    role: 'Content Creator',
  },
  {
    id: 'keusmo',
    name: 'Keusmo',
    avatar: '/keusmo.jpeg',
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
];

/**
 * Articles de blog pour la démonstration
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'La révolution streetwear française : Comment la nouvelle génération redéfinit les codes',
    excerpt: 'Plongée dans l\'écosystème streetwear français avec les créateurs qui façonnent l\'avenir de la mode urbaine. Entre tradition et innovation, découvrez les marques qui comptent.',
    content: `# La révolution streetwear française

Le streetwear français connaît une véritable révolution. Entre les marques historiques comme Carhartt WIP et les nouvelles créations comme Jacquemus x Nike, la France s'impose comme un acteur majeur de la mode urbaine mondiale.

## L'émergence des nouveaux créateurs

Les créateurs français apportent une vision unique, mêlant l'héritage de la haute couture française avec l'énergie brute du streetwear américain.

## Les collaborations qui marquent

- Nike x Jacquemus
- Adidas x Kith Paris
- Stone Island x Supreme Paris

Cette nouvelle génération repense complètement les codes du streetwear, créant un style authentiquement français.`,
    imageUrl: '/blog/streetwear-france.jpg',
    category: 'streetwear',
    author: mockAuthors[0], // Sean
    publishedAt: '2024-01-15',
    readTime: 8,
    tags: ['streetwear', 'france', 'mode', 'créateurs'],
    isFeature: true,
  },
  {
    id: '2',
    title: 'Interview exclusive : Sean nous raconte les coulisses de Camino TV',
    excerpt: 'Rencontre avec le fondateur de Camino TV qui nous dévoile sa vision de la culture streetwear et ses projets pour l\'avenir de la plateforme.',
    content: `# Sean, fondateur de Camino TV

Dans cette interview exclusive, Sean nous raconte son parcours et sa vision de la culture streetwear française.

## Les débuts de l'aventure

"Tout a commencé par une passion pour les sneakers et le besoin de partager les bons plans avec la communauté"

## La vision de Camino TV

L'objectif est simple : démocratiser l'accès aux meilleures pièces streetwear à des prix accessibles.`,
    imageUrl: '/blog/interview-sean.jpg',
    category: 'interview',
    author: mockAuthors[3], // Elssy
    publishedAt: '2024-01-12',
    readTime: 12,
    tags: ['interview', 'fondateur', 'camino-tv', 'streetwear'],
  },
  {
    id: '3',
    title: 'Les 10 sneakers incontournables de 2024',
    excerpt: 'Notre sélection des sneakers qui vont marquer l\'année 2024. Entre rééditions mythiques et nouveautés surprenantes, voici notre top 10.',
    content: `# Top 10 Sneakers 2024

Voici notre sélection des sneakers qui vont définir l'année 2024.

## 1. Nike Dunk Low "Panda" 2024
Retour de la coloris iconique avec des améliorations techniques.

## 2. Air Jordan 1 "Lost and Found"
Une histoire authentique derrière cette réédition exceptionnelle.

[Continue avec les 8 autres modèles...]`,
    imageUrl: '/blog/top-sneakers-2024.jpg',
    category: 'tendances',
    author: mockAuthors[4], // Monroe
    publishedAt: '2024-01-10',
    readTime: 6,
    tags: ['sneakers', '2024', 'top', 'tendances'],
  },
  {
    id: '4',
    title: 'Shooting photo : La nouvelle collection urbaine de Keusmo',
    excerpt: 'Découvrez en exclusivité les coulisses du shooting photo de la dernière collection de Keusmo, entre influences japonaises et codes parisiens.',
    content: `# Collection Urbaine Keusmo x Paris

Un shooting photo exceptionnel dans les rues de Belleville pour capturer l'essence de cette nouvelle collection.

## L'inspiration japonaise

Keusmo puise son inspiration dans la culture urbaine de Tokyo pour créer des pièces uniques.

## Le style parisien réinventé

Chaque pièce raconte une histoire, celle d'un Paris multiculturel et créatif.`,
    imageUrl: '/blog/shooting-keusmo.jpg',
    category: 'culture',
    author: mockAuthors[5], // Piway
    publishedAt: '2024-01-08',
    readTime: 5,
    tags: ['photo', 'collection', 'urbain', 'paris'],
  },
  {
    id: '5',
    title: 'L\'art du layering selon Mike : Maîtriser les superpositions streetwear',
    excerpt: 'Mike partage ses secrets pour maîtriser l\'art du layering et créer des looks streetwear sophistiqués en toutes saisons.',
    content: `# L'art du layering streetwear

Le layering est l'une des techniques les plus importantes dans le streetwear moderne.

## Les bases du layering

- Commencer par les matières fines
- Jouer sur les longueurs
- Maîtriser les couleurs

## Les erreurs à éviter

Mike nous explique les pièges classiques du layering et comment les éviter.`,
    imageUrl: '/blog/layering-guide.jpg',
    category: 'lifestyle',
    author: mockAuthors[1], // Mike
    publishedAt: '2024-01-05',
    readTime: 7,
    tags: ['layering', 'style', 'guide', 'streetwear'],
  },
  {
    id: '6',
    title: 'Playlist du moment : Les sons qui inspirent notre équipe',
    excerpt: 'Musique et streetwear vont de pair. Découvrez la playlist officielle de l\'équipe Camino TV avec nos coups de cœur du moment.',
    content: `# Playlist Camino TV

La musique fait partie intégrante de la culture streetwear. Voici notre sélection du moment.

## Hip-Hop Français

- SCH - Mode Avion
- Freeze Corleone - Desiigner
- Orelsan - L'odeur de l'essence

## International Vibes

- Travis Scott - UTOPIA
- Playboi Carti - Whole Lotta Red
- A$AP Rocky - TESTING

Cette playlist accompagne nos sessions de recherche de deals et nos shootings photo.`,
    imageUrl: '/blog/playlist-team.jpg',
    category: 'musique',
    author: mockAuthors[2], // Keusmo
    publishedAt: '2024-01-03',
    readTime: 4,
    tags: ['musique', 'playlist', 'hip-hop', 'culture'],
  },
];

/**
 * Catégories de blog pour la navigation
 */
export const blogCategories = [
  { id: 'culture', name: 'Culture', count: 2 },
  { id: 'streetwear', name: 'Streetwear', count: 2 },
  { id: 'musique', name: 'Musique', count: 1 },
  { id: 'interview', name: 'Interviews', count: 1 },
  { id: 'lifestyle', name: 'Lifestyle', count: 1 },
  { id: 'tendances', name: 'Tendances', count: 1 },
] as const;