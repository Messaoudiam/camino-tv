/**
 * Section Hero - Bannière principale de la page d'accueil
 * Style Camino TV : Impact visuel, CTA rouge, message clair
 */

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroProps } from '@/types';
import { cn } from '@/lib/utils';

export function Hero({ className }: HeroProps) {
  return (
    <section className={cn(
      'relative overflow-hidden bg-gradient-to-br from-background to-muted/50',
      className
    )}>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">


          {/* Titre principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-foreground">
            Camino
            <span className="text-brand-500 font-bold">
               TV
            </span>
          </h1>

          {/* Sous-titre */}
          <h2 className="md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-bold text-4xl">
            We The Mouvement
          </h2>
        </div>
      </div>

      {/* Effet visuel de fond */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,hsl(var(--background)),transparent)] opacity-30" />
    </section>
  );
}