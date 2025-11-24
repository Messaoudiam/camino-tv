import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Code, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title:
    "Mentions Légales - Projet de Démonstration Technique | Camino TV Demo",
  description:
    "Mentions légales du projet de démonstration technique Camino TV. Site de portfolio développeur, non affilié au vrai Camino TV.",
  robots: "noindex, nofollow",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader
            title="Mentions Légales"
            description="Informations légales du projet de démonstration technique"
            badge={{ icon: AlertTriangle, text: "Projet Demo" }}
          />

          {/* Avertissement Important */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    ⚠️ Avertissement Important
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong>
                      Ce site n'est PAS le site officiel de Camino TV.
                    </strong>{" "}
                    Il s'agit d'un projet de démonstration technique créé par un
                    développeur pour présenter ses compétences en développement
                    web moderne. Aucune affiliation avec la vraie marque Camino
                    TV.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Nature du Projet */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold">Nature du Projet</h2>
                </div>

                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Ce site web est un{" "}
                    <strong>projet de portfolio développeur</strong> réalisé à
                    des fins de démonstration technique. Il présente une refonte
                    moderne d'un concept inspiré de Camino TV pour mettre en
                    valeur des compétences en développement web.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <Badge className="mb-2">Technologies</Badge>
                      <p className="text-sm">
                        Next.js 15, React 19, TypeScript, Shadcn UI, Tailwind
                        CSS
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <Badge className="mb-2">Objectif</Badge>
                      <p className="text-sm">
                        Démonstration de compétences en développement frontend
                        moderne
                      </p>
                    </div>
                  </div>

                  <p>
                    <strong>Aucun contenu commercial :</strong> Ce site ne vend
                    aucun produit, ne collecte aucune donnée utilisateur réelle,
                    et n'a aucune vocation commerciale.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Propriété Intellectuelle */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Propriété Intellectuelle
                </h2>

                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Marques et Contenus
                    </h3>
                    <p>
                      Tous les droits sur la marque "Camino TV", les noms des
                      créateurs (Sean, Mike, Keusmo, Elssy, Monroe, Piway,
                      Messaoud), et les contenus associés appartiennent à leurs
                      propriétaires respectifs. L'utilisation dans ce projet est
                      purement illustrative.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Code Source
                    </h3>
                    <p>
                      Le code source de ce projet de démonstration utilise des
                      technologies open source :
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Next.js (MIT License - Vercel)</li>
                      <li>Shadcn UI (MIT License - Radix UI)</li>
                      <li>Tailwind CSS (MIT License)</li>
                      <li>Lucide Icons (ISC License)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Images et Assets
                    </h3>
                    <p>
                      Les images utilisées sont soit des placeholders, soit des
                      assets libres de droits, soit utilisées dans un cadre de
                      démonstration technique non-commerciale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hébergement et Technique */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Informations Techniques
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Hébergement</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Plateforme :</strong> Vercel Inc.
                      </p>
                      <p>
                        <strong>URL :</strong> camino-tv.vercel.app
                      </p>
                      <p>
                        <strong>Région :</strong> France (fra1)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Développement</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Type :</strong> Application Next.js statique
                      </p>
                      <p>
                        <strong>Version :</strong> 1.0.0
                      </p>
                      <p>
                        <strong>Build :</strong> Production optimisée
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact et Responsabilité */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Contact et Responsabilité
                </h2>

                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Développeur
                    </h3>
                    <p>
                      Ce projet de démonstration a été réalisé par un
                      développeur indépendant dans le cadre de la présentation
                      de ses compétences techniques.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Limitation de Responsabilité
                    </h3>
                    <p>
                      Ce site étant un projet de démonstration, aucune garantie
                      n'est fournie quant au fonctionnement, à la disponibilité
                      ou à l'exactitude des informations présentées.
                      L'utilisateur reconnaît que l'utilisation se fait à ses
                      propres risques.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      Données Personnelles
                    </h3>
                    <p>
                      Ce site de démonstration ne collecte aucune donnée
                      personnelle. Les fonctionnalités de favoris utilisent
                      uniquement le stockage local du navigateur (localStorage)
                      sans transmission de données.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liens Utiles */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Liens Utiles</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://github.com/Messaoudiam/camino-tv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Code Source</p>
                      <p className="text-sm text-muted-foreground">
                        Voir le projet sur GitHub
                      </p>
                    </div>
                  </a>

                  <a
                    href="/legal/cgu"
                    className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Code className="h-5 w-5" />
                    <div>
                      <p className="font-medium">CGU</p>
                      <p className="text-sm text-muted-foreground">
                        Conditions d'utilisation
                      </p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>
              Dernière mise à jour :{" "}
              {new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className="mt-2">
              Projet de démonstration technique - Aucune affiliation avec Camino
              TV officiel
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
