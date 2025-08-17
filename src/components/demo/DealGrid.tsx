/**
 * Layout de deals comme cmno.tv - Feed vertical scrollable
 * Pas de grid classique, mais un layout en colonnes fluide
 */

import { DealCard } from './DealCard';
import { DealGridProps } from '@/types';
import { cn } from '@/lib/utils';

export function DealGrid({ deals, loading = false, className }: DealGridProps) {
  
  if (loading) {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {/* Skeleton loaders */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2 p-4">
              <div className="h-5 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun deal trouvé</p>
      </div>
    );
  }

  return (
    <div className={cn(
      // Layout plus simple et spacieux comme le vrai site
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto',
      className
    )}>
      {deals.map((deal) => (
        <DealCard
          key={deal.id}
          deal={deal}
          onClick={() => {
            // Analytics tracking en production
            console.log('Deal clicked:', deal.id);
          }}
        />
      ))}
    </div>
  );
}