import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Instagram, Youtube, Twitter, Twitch, Users } from 'lucide-react';
import { mockAuthors } from '@/data/mock';
import { AnimatedNumber } from '@/components/ui/animated-number';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Équipe Camino TV - Créateurs & Influenceurs Streetwear France | Camino TV",
  description: "Découvrez l'équipe passionnée de Camino TV : Sean, Mike, Keusmo, Elssy, Monroe, Piway et Messaoud. Créateurs de contenu, influenceurs et experts streetwear français qui font rayonner la culture urbaine.",
  keywords: [
    "équipe camino tv",
    "créateurs streetwear france", 
    "influenceurs streetwear français",
    "experts sneakers france",
    "content creators mode urbaine",
    "équipe youtubers streetwear",
    "sean camino tv",
    "keusmo influenceur",
    "mike content creator"
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://caminotv.com/team",
    title: "Équipe Camino TV - Créateurs & Influenceurs Streetwear",
    description: "Rencontrez les visages passionnés derrière Camino TV. De Sean le fondateur à Keusmo l'influenceur, découvrez notre équipe de créateurs streetwear français.",
    siteName: "Camino TV",
    images: [
      {
        url: "/og-team.jpg",
        width: 1200,
        height: 630,
        alt: "Équipe Camino TV - Créateurs Streetwear France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CaminoTV",
    title: "Équipe Camino TV - Créateurs Streetwear France",
    description: "Découvrez les créateurs passionnés derrière la plus grande communauté streetwear française.",
  },
};

export default function TeamPage() {
  const teamStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Camino TV",
    "url": "https://caminotv.com",
    "description": "Plateforme streetwear française et communauté de créateurs de contenu mode urbaine",
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "Sean",
        "jobTitle": "Fondateur & Creator",
        "sameAs": [
          "https://www.instagram.com/nohatesean/",
          "https://x.com/noHateSean"
        ]
      }
    ],
    "employee": mockAuthors.map(member => ({
      "@type": "Person",
      "name": member.name,
      "jobTitle": member.role,
      "worksFor": {
        "@type": "Organization",
        "name": "Camino TV"
      },
      "sameAs": [
        getSocialLink(member.id, 'instagram'),
        getSocialLink(member.id, 'twitter')
      ].filter(link => link !== '#')
    })),
    "sameAs": [
      "https://www.youtube.com/@CaminoTV",
      "https://www.instagram.com/caminotv/", 
      "https://x.com/CaminoTV",
      "https://www.twitch.tv/caminotv"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(teamStructuredData),
        }}
      />
      <div className="min-h-screen bg-background">
      <Header />
      
      <PageHeader
        badge={{
          icon: Users,
          text: 'Notre équipe'
        }}
        title="L'équipe Camino TV"
        description="Ta bande de reufs préférée. Tout à commencé il y a 10 ans..."
      />
      
      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* Équipe Grid */}
        <section aria-labelledby="team-heading">
          <h2 id="team-heading" className="sr-only">Membres de l'équipe Camino TV</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mockAuthors.map((member, index) => (
            <Card key={member.id} className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-500/10 border hover:border-brand-300 dark:hover:border-brand-700 bg-card rounded-xl">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden rounded-t-xl">
                  <Image
                    src={member.avatar}
                    alt={`${member.name}, ${member.role} chez Camino TV - Créateur de contenu streetwear français`}
                    fill
                    className="object-cover object-center transition-all duration-300 group-hover:scale-105 rounded-t-xl"
                    priority={index < 3}
                    loading={index >= 3 ? "lazy" : "eager"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Social Links Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 hover:scale-105 transition-all duration-200">
                        <a href={getSocialLink(member.id, 'instagram')} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                      {getSocialLink(member.id, 'twitter') !== '#' && (
                        <Button asChild size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/20 hover:scale-105 transition-all duration-200">
                          <a href={getSocialLink(member.id, 'twitter')} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-brand-600 transition-colors mb-3">
                    {member.name}
                  </h3>
                  
                  <p className="text-brand-600 dark:text-brand-400 font-semibold mb-3">
                    {member.role}
                  </p>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {getmemberDescription(member.id)}
                  </p>
                  
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </section>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 bg-card rounded-xl border hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-500/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-6 group-hover:scale-105 transition-all duration-300">🎯</div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-600 transition-colors duration-300">Authenticité</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                Nous restons fidèles à nos valeurs et partageons notre passion de manière authentique avec notre communauté.
              </p>
            </div>
            
            <div className="group p-8 bg-card rounded-xl border hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-500/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-6 group-hover:scale-105 transition-all duration-300">🤝</div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-600 transition-colors duration-300">Communauté</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                Notre force réside dans notre communauté. Nous créons des liens durables et partageons nos découvertes.
              </p>
            </div>
            
            <div className="group p-8 bg-card rounded-xl border hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-lg hover:shadow-brand-500/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="text-5xl mb-6 group-hover:scale-105 transition-all duration-300">⚡</div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-600 transition-colors duration-300">Innovation</h3>
              <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 leading-relaxed">
                Nous repoussons constamment les limites pour offrir le meilleur contenu et les meilleures expériences.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Notre communauté
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <a href="https://youtube.com/@CaminoTV" target="_blank" rel="noopener noreferrer" className="text-center p-8 bg-card rounded-xl border border-red-200/50 dark:border-red-800/30 hover:border-red-400 dark:hover:border-red-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 group cursor-pointer block">
            <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4 group-hover:scale-105 group-hover:text-red-500 transition-all duration-300">
              <AnimatedNumber value={300000} suffix="+" duration={2500} delay={200} />
            </div>
            <div className="flex justify-center">
              <Youtube className="h-8 w-8 text-red-600 dark:text-red-400 group-hover:scale-105 group-hover:text-red-500 transition-all duration-300" />
            </div>
          </a>
          <a href="https://instagram.com/caminotv" target="_blank" rel="noopener noreferrer" className="text-center p-8 bg-card rounded-xl border border-pink-200/50 dark:border-pink-800/30 hover:border-pink-400 dark:hover:border-pink-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 group cursor-pointer block">
            <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4 group-hover:scale-105 group-hover:text-pink-500 transition-all duration-300">
              <AnimatedNumber value={560000} suffix="+" duration={2500} delay={400} />
            </div>
            <div className="flex justify-center">
              <Instagram className="h-8 w-8 text-pink-600 dark:text-pink-400 group-hover:scale-105 group-hover:text-pink-500 transition-all duration-300" />
            </div>
          </a>
          <a href="https://www.twitch.tv/caminotv" target="_blank" rel="noopener noreferrer" className="text-center p-8 bg-card rounded-xl border border-purple-200/50 dark:border-purple-800/30 hover:border-purple-400 dark:hover:border-purple-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 group cursor-pointer block">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 group-hover:text-purple-500 transition-all duration-300">
              <AnimatedNumber value={50000} suffix="+" duration={2500} delay={600} />
            </div>
            <div className="flex justify-center">
              <Twitch className="h-8 w-8 text-purple-600 dark:text-purple-400 group-hover:scale-105 group-hover:text-purple-500 transition-all duration-300" />
            </div>
          </a>
          <a href="https://x.com/CaminoTV" target="_blank" rel="noopener noreferrer" className="text-center p-8 bg-card rounded-xl border border-gray-200/50 dark:border-gray-800/30 hover:border-gray-400 dark:hover:border-gray-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-500/10 transition-all duration-300 group cursor-pointer block">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4 group-hover:scale-105 group-hover:text-gray-600 transition-all duration-300">
              <AnimatedNumber value={548000} suffix="+" duration={2500} delay={800} />
            </div>
            <div className="flex justify-center">
              <Twitter className="h-8 w-8 text-gray-800 dark:text-gray-200 group-hover:scale-105 group-hover:text-gray-600 transition-all duration-300" />
            </div>
          </a>
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
            <Button asChild variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/50">
              <a href="https://www.twitch.tv/caminotv" target="_blank" rel="noopener noreferrer">
                <Twitch className="mr-2 h-4 w-4" />
                Twitch
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
    </>
  );
}

function getmemberDescription(id: string): string {
  const descriptions: Record<string, string> = {
    sean: "Fondateur visionnaire de Camino TV, Sean allie passion pour la culture streetwear et expertise business pour créer du contenu authentique.",
    mike: "Expert en création de contenu, Mike apporte sa créativité et son œil artistique pour produire des visuels qui marquent les esprits.",
    keusmo: "Influenceur streetwear reconnu, Keusmo partage sa connaissance pointue des tendances et son style unique avec la communauté.",
    elssy: "Journaliste mode spécialisée, Elssy analyse les tendances et décrypte l'actualité streetwear avec un regard expert et passionné.",
    monroe: "Passionné de sneakers depuis toujours, Monroe déniche les meilleures opportunités et partage ses coups de cœur avec la communauté.",
    piway: "Photographe talentueux, Piway capture l'essence de la culture urbaine à travers son objectif et sublime chaque création.",
    messaoud: "Développeur passionné du pôle IT. Messaoud, avec Adlane et Alexis, crée et maintient les plateformes techniques qui permettent à Camino TV de rayonner à travers le monde et jusqu'à l'infini.",
  };
  
  return descriptions[id] || "Membre passionné de l'équipe Camino TV, contribuant à créer du contenu exceptionnel pour la communauté.";
}

function getSocialLink(memberId: string, platform: 'instagram' | 'twitter'): string {
  const socialLinks: Record<string, Record<string, string>> = {
    sean: {
      instagram: 'https://www.instagram.com/nohatesean/',
      twitter: 'https://x.com/noHateSean'
    },
    mike: {
      instagram: 'https://www.instagram.com/mikeswd/',
      twitter: 'https://x.com/MikeLSDLV'
    },
    keusmo: {
      instagram: 'https://www.instagram.com/keusmo/',
      twitter: 'https://x.com/keusmo'
    },
    elssy: {
      instagram: 'https://www.instagram.com/elssy_ctv/',
      twitter: 'https://x.com/ElssyCTV'
    },
    monroe: {
      instagram: 'https://www.instagram.com/monroejesuis/',
      twitter: 'https://x.com/monroejesuis'
    },
    piway: {
      instagram: 'https://www.instagram.com/piwayseven/',
      twitter: 'https://x.com/Piwayseven'
    },
    messaoud: {
      instagram: 'https://www.instagram.com/messaoudiam/',
      twitter: '#'
    }
  };
  
  return socialLinks[memberId]?.[platform] || '#';
}