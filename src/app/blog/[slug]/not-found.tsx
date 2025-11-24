"use client";

/**
 * Page 404 pour les articles de blog non trouvés
 */

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="p-8">
            <CardContent>
              <div className="mb-6">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Article introuvable
                </h1>
                <p className="text-muted-foreground">
                  Désolé, l'article que vous cherchez n'existe pas ou a été
                  supprimé.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/blog">
                  <Button className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Retour au blog
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Accueil</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}
