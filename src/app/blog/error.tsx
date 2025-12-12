"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, BookOpen } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for monitoring (could be sent to Sentry, etc.)
    console.error("Blog error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="border-destructive/20">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-3">
                  Oups, une erreur est survenue
                </h1>

                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Nous n'avons pas pu charger le blog. Cela peut arriver lors
                  d'une maintenance ou d'un problème temporaire.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={reset}
                    className="bg-brand-600 hover:bg-brand-700"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>

                  <Link href="/blog">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Retour au blog
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="ghost" className="w-full sm:w-auto">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Button>
                  </Link>
                </div>

                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-6">
                    Code erreur : {error.digest}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}
