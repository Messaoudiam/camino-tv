"use client";

import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, BookOpen, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BlogPostError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error for monitoring (could be sent to Sentry, etc.)
    console.error("Blog post error:", error);
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
                  Impossible de charger l'article
                </h1>

                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  L'article n'a pas pu être chargé. Cela peut être dû à un
                  problème temporaire de connexion. Réessayez dans quelques
                  instants.
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
                      Voir tous les articles
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
