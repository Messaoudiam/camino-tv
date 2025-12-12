/**
 * Types pour la démo Camino TV
 * Candidature frontend - Types stricts et bien documentés
 */

export interface Deal {
  id: string;
  title: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  discountPercentage: number;
  imageUrl: string;
  category: DealCategory;
  isNew?: boolean;
  createdAt?: string;
  isLimited?: boolean;
  affiliateUrl: string;
  promoCode?: string;
  promoDescription?: string;
  temperature?: number; // Système de vote Hot/Cold
}

export type DealCategory =
  | "sneakers"
  | "streetwear"
  | "accessories"
  | "electronics"
  | "lifestyle";

export interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  isPartner: boolean;
}

export interface SearchFilters {
  category?: DealCategory;
  brand?: string;
  maxPrice?: number;
  minDiscount?: number;
}

/**
 * Props pour les composants de navigation
 */
export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

/**
 * Props pour les composants de deals
 */
export interface DealCardProps {
  deal: Deal;
  onClick?: () => void;
  className?: string;
}

export interface DealGridProps {
  deals: Deal[];
  loading?: boolean;
  className?: string;
}

/**
 * Props pour les composants de layout
 */
export interface HeaderProps {
  className?: string;
}

export interface HeroProps {
  className?: string;
}

/**
 * Types pour les articles de blog
 */
export interface BlogPost {
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
  isFeatured?: boolean;
}

export type BlogCategory =
  | "culture"
  | "streetwear"
  | "musique"
  | "interview"
  | "lifestyle"
  | "tendances";

export interface BlogAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

/**
 * Props pour les composants de blog
 */
export interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured" | "compact";
  onClick?: () => void;
  className?: string;
}

export interface BlogGridProps {
  posts: BlogPost[];
  loading?: boolean;
  className?: string;
}
