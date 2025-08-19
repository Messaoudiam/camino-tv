'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

// Configuration des routes pour les breadcrumbs
const routeConfig: Record<string, string> = {
  '/': 'Accueil',
  '/team': 'Équipe',
  '/blog': 'Blog',
  '/deals': 'Bons plans',
  '/favorites': 'Favoris',
};

// Fonction pour générer les breadcrumbs automatiquement
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  // Pour la page d'accueil, pas de breadcrumb
  if (pathSegments.length === 0) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { href: '/', label: 'Accueil' }
  ];

  let currentPath = '';
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Pour les pages de blog avec slug dynamique
    if (pathSegments[0] === 'blog' && index === 1) {
      // Pour un article de blog, on n'affiche que "Blog" et le segment sera remplacé par le titre de l'article
      breadcrumbs.push({
        href: currentPath,
        label: segment // sera remplacé par le titre de l'article via customItems
      });
    } else {
      // Pour les autres routes
      const label = routeConfig[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        href: currentPath,
        label
      });
    }
  });

  return breadcrumbs;
}

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Générer les breadcrumbs automatiquement ou utiliser les items personnalisés
  const breadcrumbItems = customItems || generateBreadcrumbs(pathname);
  
  // Ne pas afficher de breadcrumb pour la page d'accueil
  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("mb-8", className)}
    >
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" />
            )}
            
            {index === breadcrumbItems.length - 1 ? (
              // Dernier élément (page courante) - pas de lien
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            ) : (
              // Éléments précédents - avec liens
              <Link 
                href={item.href} 
                className="hover:text-foreground transition-colors duration-200 flex items-center gap-1"
              >
                {index === 0 && (
                  <Home className="h-3.5 w-3.5" />
                )}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Composant pour les pages avec breadcrumbs personnalisés (comme les articles de blog)
interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function CustomBreadcrumb({ items, className }: CustomBreadcrumbProps) {
  return <Breadcrumb customItems={items} className={className} />;
}

export default Breadcrumb;