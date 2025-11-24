"use client";

import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ExternalLink, Twitter } from "lucide-react";

interface TwitterEmbedSimpleProps {
  tweetId: string;
  className?: string;
}

declare global {
  interface Window {
    twttr: any;
  }
}

export function TwitterEmbedSimple({
  tweetId,
  className,
}: TwitterEmbedSimpleProps) {
  useEffect(() => {
    // Charger le script Twitter s'il n'est pas déjà chargé
    if (!window.twttr) {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
    } else {
      // Si le script est déjà chargé, réinitialiser les widgets
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <div className={`my-8 flex justify-center ${className}`}>
      <div className="max-w-full">
        {/* Embed Twitter officiel avec blockquote */}
        <blockquote
          className="twitter-tweet"
          data-theme="light"
          data-width="550"
          data-conversation="none"
          data-dnt="true"
        >
          <p lang="fr" dir="ltr">
            20 pépites qu'on a kiffé chez les créateurs FR et Belges, des
            sorties bien chaudes 🔥
            <br />
            THREAD 🧵
          </p>
          <a href={`https://x.com/CaminoTV/status/${tweetId}`}>
            — LONGUE VIE À TOUS MENNÉS ❤️ (@CaminoTV) July 23, 2025
          </a>
        </blockquote>

        {/* Fallback élégant */}
        <noscript>
          <Card className="p-6 border border-border bg-muted/30 mt-4">
            <div className="flex items-center justify-center space-x-4">
              <Twitter className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground mb-2">
                  Thread Twitter
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  20 pépites qu'on a kiffé chez les créateurs FR et Belges
                </p>
                <a
                  href={`https://x.com/CaminoTV/status/${tweetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  Voir le thread complet
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </Card>
        </noscript>
      </div>
    </div>
  );
}
