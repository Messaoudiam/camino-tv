'use client';

import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Instagram, Youtube, Twitter } from 'lucide-react';
import { mockAuthors } from '@/data/mock';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/20 to-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800">
            Notre équipe
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            L'équipe Camino TV
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez les visages passionnés qui font de Camino TV une plateforme unique. 
            Entre expertise streetwear, créativité et passion pour la culture urbaine.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center p-6 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/20 dark:to-card rounded-2xl border border-brand-200/50 dark:border-brand-800/30">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-2">300k+</div>
            <div className="text-sm text-muted-foreground">Abonnés YouTube</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-white dark:from-pink-950/20 dark:to-card rounded-2xl border border-pink-200/50 dark:border-pink-800/30">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">560k+</div>
            <div className="text-sm text-muted-foreground">Followers Instagram</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-card rounded-2xl border border-purple-200/50 dark:border-purple-800/30">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50k+</div>
            <div className="text-sm text-muted-foreground">Followers Twitch</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/20 dark:to-card rounded-2xl border border-gray-200/50 dark:border-gray-800/30">
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">548k+</div>
            <div className="text-sm text-muted-foreground">Followers X</div>
          </div>
        </div>

        {/* Équipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockAuthors.map((member, index) => (
            <Card key={member.id} className="group overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/10 border-2 hover:border-brand-300 dark:hover:border-brand-700 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-card dark:via-card dark:to-gray-950/20 rounded-2xl">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden rounded-t-2xl">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover object-center transition-all duration-500 group-hover:scale-110 rounded-t-2xl"
                    priority={index < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20">
                        <Youtube className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-brand-600 transition-colors">
                      {member.name}
                    </h3>
                    {index === 0 && (
                      <Badge variant="secondary" className="bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                        Fondateur
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-brand-600 dark:text-brand-400 font-semibold mb-3">
                    {member.role}
                  </p>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {getmemberDescription(member.id)}
                  </p>
                  
                  <Button variant="outline" size="sm" className="w-full group/btn hover:bg-brand-50 hover:border-brand-300 dark:hover:bg-brand-950/50">
                    Voir le profil
                    <ExternalLink className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-white to-gray-50/50 dark:from-card dark:to-gray-950/10 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Authenticité</h3>
              <p className="text-muted-foreground">
                Nous restons fidèles à nos valeurs et partageons notre passion de manière authentique avec notre communauté.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-white to-gray-50/50 dark:from-card dark:to-gray-950/10 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Communauté</h3>
              <p className="text-muted-foreground">
                Notre force réside dans notre communauté. Nous créons des liens durables et partageons nos découvertes.
              </p>
            </div>
            
            <div className="p-8 bg-gradient-to-br from-white to-gray-50/50 dark:from-card dark:to-gray-950/10 rounded-2xl border border-gray-200/50 dark:border-gray-800/30 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Nous repoussons constamment les limites pour offrir le meilleur contenu et les meilleures expériences.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-brand-500/10 via-brand-600/5 to-brand-500/10 rounded-3xl p-12 border border-brand-200/50 dark:border-brand-800/30">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Rejoignez l'aventure Camino TV
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Suivez-nous sur nos réseaux sociaux pour ne rien rater de nos dernières découvertes et bons plans.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
              <a href="https://youtube.com/@CaminoTV" target="_blank" rel="noopener noreferrer">
                <Youtube className="mr-2 h-4 w-4" />
                YouTube
              </a>
            </Button>
            <Button asChild variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50 dark:border-pink-800 dark:text-pink-400 dark:hover:bg-pink-950/50">
              <a href="https://instagram.com/caminotv" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </a>
            </Button>
            <Button asChild variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-950/50">
              <a href="https://x.com/CaminoTV" target="_blank" rel="noopener noreferrer">
                <Twitter className="mr-2 h-4 w-4" />
                X (Twitter)
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}

function getmemberDescription(id: string): string {
  const descriptions: Record<string, string> = {
    sean: "Fondateur visionnaire de Camino TV, Sean allie passion pour la culture streetwear et expertise business pour créer du contenu authentique.",
    mike: "Expert en création de contenu, Mike apporte sa créativité et son œil artistique pour produire des visuels qui marquent les esprits.",
    keusmo: "Influenceur streetwear reconnu, Keusmo partage sa connaissance pointue des tendances et son style unique avec la communauté.",
    elssy: "Journaliste mode spécialisée, Elssy analyse les tendances et décrypte l'actualité streetwear avec un regard expert et passionné.",
    monroe: "Passionné de sneakers depuis toujours, Monroe déniche les meilleures opportunités et partage ses coups de cœur avec la communauté.",
    piway: "Photographe talentueux, Piway capture l'essence de la culture urbaine à travers son objectif et sublime chaque création."
  };
  
  return descriptions[id] || "Membre passionné de l'équipe Camino TV, contribuant à créer du contenu exceptionnel pour la communauté.";
}