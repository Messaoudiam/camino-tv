'use client';

import { useEffect, useRef } from 'react';

interface TwitterEmbedProps {
  tweetId: string;
  className?: string;
}

declare global {
  interface Window {
    twttr: any;
  }
}

export function TwitterEmbed({ tweetId, className }: TwitterEmbedProps) {
  const tweetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTwitterWidget = () => {
      // Si le script Twitter n'est pas chargé, on le charge
      if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        script.onload = () => {
          createTweet();
        };
        document.body.appendChild(script);
      } else {
        // Le script est déjà là, on crée le tweet directement
        createTweet();
      }
    };

    const createTweet = () => {
      if (tweetRef.current && window.twttr && window.twttr.widgets) {
        // Nettoyer le contenu pour éviter les doublons
        tweetRef.current.innerHTML = '';
        
        window.twttr.widgets.createTweet(tweetId, tweetRef.current, {
          theme: 'light',
          align: 'center',
          conversation: 'none',
          dnt: true
        }).catch((error: any) => {
          console.log('Erreur lors du chargement du tweet:', error);
          // En cas d'erreur, on affiche le fallback
          if (containerRef.current) {
            containerRef.current.innerHTML = `
              <div class="p-6 border rounded-lg bg-gray-50 dark:bg-gray-900">
                <div class="text-center">
                  <p class="font-medium mb-2">Thread indisponible</p>
                  <a href="https://x.com/CaminoTV/status/${tweetId}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors">
                    Voir sur X
                  </a>
                </div>
              </div>
            `;
          }
        });
      }
    };

    // Petite temporisation pour s'assurer que le DOM est prêt
    const timeoutId = setTimeout(loadTwitterWidget, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [tweetId]);

  return (
    <div ref={containerRef} className={`my-8 flex justify-center ${className}`}>
      <div ref={tweetRef} className="max-w-full" />
    </div>
  );
}