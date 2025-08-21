'use client';

/**
 * Landing Page Camino TV - Page d'accueil moderne
 * Design moderne avec Hero + Sections + CTA
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Zap, Users, TrendingUp, Star, Play, Mic, Youtube, Instagram, Twitter, Twitch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedNumber } from '@/components/ui/animated-number';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />

      {/* Nos missions Section */}
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800">
              <Users className="h-3 w-3 mr-1" />
              Nos missions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Notre vision. Notre mission.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Les valeurs qui nous guident et définissent notre approche unique du contenu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Vivre de notre passion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Parler de ce qu'on aime et vivre de notre passion avec la communauté
                </p>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Partager l'aventure</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Partager l'aventure de notre collectif et créer des liens authentiques
                </p>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Faire avancer le mouvement</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Contribuer activement à l'évolution et au développement du mouvement
                </p>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Mettre en lumière</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mettre en lumière les acteurs de la culture francophone pour créer un espace où chacun peut se sentir libre de s'exprimer
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nos émissions Section */}
      <section id="nos-emissions" className="py-20 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800">
              <Play className="h-3 w-3 mr-1" />
              Nos émissions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Découvrez nos futurs projets
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des émissions authentiques pour partager notre passion et créer des liens avec la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Play className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">*en amis proches</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Moments intimistes avec tes artistes préférés qu'ils ne partagent pas, qu'en amis proches.
                </p>
                <a 
                  href="https://www.youtube.com/@enamisproches" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-300 group/btn hover:scale-105"
                >
                  Découvrir sur YouTube
                </a>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Mic className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">✈️ Dans le cockpit</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Voila notre podcast, des avis géniaux ou débiles, ça dépend mais au moins t'es en premiere classe avec nous. En live sur Twitch tous les lundi, mercredis et vendredis matins.
                </p>
                <a 
                  href="https://www.youtube.com/@caminotv_replay" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-300 group/btn hover:scale-105"
                >
                  Voir les replays
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Réseaux sociaux Section */}
      <section id="reseaux-sociaux" className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800">
              <Users className="h-3 w-3 mr-1" />
              Réseaux sociaux
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Suivez-nous partout
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Rejoignez notre communauté sur toutes les plateformes pour ne rien rater de l'aventure Camino TV
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50/50 dark:from-red-950/20 dark:via-card dark:to-red-950/10 border border-red-200/50 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700 hover:shadow-xl hover:shadow-red-500/10 dark:hover:shadow-red-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Youtube className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">YouTube</h3>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  <AnimatedNumber value={300000} suffix="+" duration={2500} delay={200} />
                </p>
                <p className="text-sm text-muted-foreground mb-6">abonnés</p>
                <a 
                  href="https://www.youtube.com/@CaminoTV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all duration-300 group/btn hover:scale-105"
                >
                  Suivre
                </a>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-50/50 dark:from-pink-950/20 dark:via-card dark:to-pink-950/10 border border-pink-200/50 dark:border-pink-800/30 hover:border-pink-300 dark:hover:border-pink-700 hover:shadow-xl hover:shadow-pink-500/10 dark:hover:shadow-pink-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Instagram</h3>
                <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                  <AnimatedNumber value={560000} suffix="+" duration={2500} delay={400} />
                </p>
                <p className="text-sm text-muted-foreground mb-6">abonnés</p>
                <a 
                  href="https://www.instagram.com/caminotv/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 group/btn hover:scale-105"
                >
                  Suivre
                </a>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-950/20 dark:via-card dark:to-gray-950/10 border border-gray-200/50 dark:border-gray-700/30 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-gray-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black shadow-lg shadow-gray-800/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Twitter className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">X (Twitter)</h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                  <AnimatedNumber value={548000} suffix="+" duration={2500} delay={600} />
                </p>
                <p className="text-sm text-muted-foreground mb-6">abonnés</p>
                <a 
                  href="https://x.com/CaminoTV" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-300 group/btn hover:scale-105"
                >
                  Suivre
                </a>
              </CardContent>
            </Card>

            <Card variant="default" size="lg" padding="lg" className="group relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-purple-50/50 dark:from-purple-950/20 dark:via-card dark:to-purple-950/10 border border-purple-200/50 dark:border-purple-800/30 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/5 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="relative z-10 p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Twitch className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Twitch</h3>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  <AnimatedNumber value={50000} suffix="+" duration={2500} delay={800} />
                </p>
                <p className="text-sm text-muted-foreground mb-6">abonnés</p>
                <a 
                  href="https://www.twitch.tv/caminotv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-xl transition-all duration-300 group/btn hover:scale-105"
                >
                  Suivre
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
