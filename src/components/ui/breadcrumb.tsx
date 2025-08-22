'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  className?: string;
  customItems?: BreadcrumbItem[];
}

const pathLabels: Record<string, string> = {
  '/': 'Accueil',
  '/deals': 'Bons plans',
  '/blog': 'Blog',
  '/team': 'Équipe',
  '/favorites': 'Favoris',
  '/contact': 'Contact',
  '/legal': 'Mentions légales',
  '/legal/cgu': 'CGU',
  '/cgu': 'CGU',
  '/mentions-legales': 'Mentions légales'
};

export function Breadcrumb({ className, customItems }: BreadcrumbProps) {
  const pathname = usePathname();

  // Si on est sur la page d'accueil, ne pas afficher le breadcrumb
  if (pathname === '/') {
    return null;
  }

  let items: BreadcrumbItem[] = [];

  if (customItems) {
    items = customItems;
  } else {
    // Génération automatique basée sur le pathname
    const segments = pathname.split('/').filter(Boolean);
    
    // Toujours commencer par Accueil
    items = [{ label: 'Accueil', href: '/' }];
    
    // Construire les segments
    let currentPath = '';
    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      
      // Obtenir le label depuis le mapping ou utiliser le segment
      let label = pathLabels[currentPath] || segment;
      
      // Cas spécial pour les articles de blog
      if (currentPath.startsWith('/blog/') && segment !== 'blog') {
        label = decodeURIComponent(segment).replace(/-/g, ' ');
        // Capitaliser la première lettre de chaque mot
        label = label.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
      }
      
      items.push({
        label,
        href: currentPath
      });
    });
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-8", className)}>
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === 0 && (
              <Home className="h-4 w-4 mr-1" />
            )}
            {index < items.length - 1 ? (
              <Link 
                href={item.href} 
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}