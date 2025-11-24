/**
 * Section Hero - Bannière principale de la page d'accueil
 * Style Camino TV : Impact visuel, CTA rouge, message clair
 */

import { HeroProps } from "@/types";
import { cn } from "@/lib/utils";

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden min-h-[80vh] flex items-center justify-center",
        "bg-gradient-to-br from-background via-muted/30 to-background",
        className,
      )}
    >
      {/* Effets visuels de fond */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,hsl(var(--background)),transparent)] opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-red-600/5 rounded-full blur-2xl" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Titre principal avec animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-foreground">
            <span className="inline-block hover:scale-105 transition-transform duration-300">
              Camino
            </span>
            <span className="text-brand-500 font-bold inline-block hover:scale-105 transition-transform duration-300 ml-2 text-red-500">
              TV
            </span>
          </h1>

          {/* Sous-titre avec style moderne */}
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              We The Mouvement
            </span>
          </h2>

          {/* Description engageante */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Créateurs de contenu authentique pour la Culture francophone.
            <br />
            <span className="font-semibold text-foreground">
              Passion, communauté et création sans limites.
            </span>
          </p>

          {/* Statistiques impressionnantes */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-red-500 mb-1">
                2.2M+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Abonnés total
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-1">
                300K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                YouTube
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-red-400 mb-1">
                560K+
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                Instagram
              </div>
            </div>
          </div>

          {/* CTA modernisé */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#nos-emissions"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
            >
              Découvrir nos émissions
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#reseaux-sociaux"
              className="group inline-flex items-center px-8 py-4 border-2 border-red-200/40 hover:border-red-400/60 text-foreground hover:text-red-600 font-bold rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:bg-red-50/50 dark:hover:bg-red-950/20"
            >
              Nous suivre
              <svg
                className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
