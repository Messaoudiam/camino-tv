import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, FileText, Shield, Eye, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: "CGU - Conditions Générales d'Utilisation | Camino TV Demo",
  description: "Conditions générales d'utilisation du projet de démonstration technique Camino TV. Site de portfolio développeur.",
  robots: "noindex, nofollow"
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <PageHeader
            title="Conditions Générales d'Utilisation"
            description="Conditions d'utilisation du projet de démonstration technique"
            badge={{ icon: FileText, text: "CGU Demo" }}
          />

          {/* Avertissement Important */}
          <Card className="mb-8 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    ⚠️ Site de Démonstration Technique
                  </h2>
                  <p className="text-orange-800 dark:text-orange-200 leading-relaxed">
                    <strong>Ce site n'est PAS le site officiel de Camino TV.</strong> Il s'agit d'un projet de portfolio développeur créé uniquement pour présenter des compétences techniques. Aucune transaction commerciale, aucune collecte de données réelles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            {/* Article 1 - Objet */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold">Article 1 - Objet et Nature du Site</h2>
                </div>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site web <strong>camino-tv.vercel.app</strong>, 
                    qui constitue un <strong>projet de démonstration technique</strong> réalisé par un développeur web.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Objectifs du Projet</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                      <li>Démonstration de compétences en développement web moderne</li>
                      <li>Présentation de technologies : Next.js 15, React 19, TypeScript</li>
                      <li>Showcase d'un design system avec Shadcn UI et Tailwind CSS</li>
                      <li>Exemple d'intégration d'APIs et de gestion d'état</li>
                    </ul>
                  </div>
                  
                  <p>
                    <strong>Aucune vocation commerciale :</strong> Ce site ne propose aucun service ou produit réel. 
                    Toutes les fonctionnalités (deals, blog, favoris) sont simulées à des fins de démonstration.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Article 2 - Accès et Utilisation */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-2xl font-bold">Article 2 - Accès et Utilisation</h2>
                </div>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.1 Accès Libre</h3>
                    <p>
                      L'accès au site est libre et gratuit. Aucune inscription n'est requise pour consulter le contenu de démonstration.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.2 Utilisation Autorisée</h3>
                    <p>Le site peut être utilisé pour :</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Consulter le projet de démonstration technique</li>
                      <li>Tester les fonctionnalités développées (navigation, thème, favoris)</li>
                      <li>Évaluer les compétences techniques du développeur</li>
                      <li>S'inspirer du code source (si accessible)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">2.3 Utilisation Interdite</h3>
                    <p>Il est strictement interdit de :</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                      <li>Utiliser le site à des fins commerciales</li>
                      <li>Reproduire le design sans autorisation</li>
                      <li>Tenter de pirater ou endommager le site</li>
                      <li>Se faire passer pour le vrai Camino TV</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 3 - Données et Confidentialité */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-2xl font-bold">Article 3 - Données et Confidentialité</h2>
                </div>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3.1 Absence de Collecte de Données</h3>
                    <p>
                      Ce site de démonstration <strong>ne collecte aucune donnée personnelle</strong>. 
                      Aucun formulaire de contact, d'inscription ou de commande n'est fonctionnel.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3.2 Stockage Local</h3>
                    <p>
                      La fonctionnalité "Favoris" utilise uniquement le localStorage de votre navigateur. 
                      Ces données restent sur votre appareil et ne sont transmises à aucun serveur.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">3.3 Cookies et Analytics</h3>
                    <p>
                      Le site peut utiliser des cookies techniques nécessaires au fonctionnement (thème sombre/clair). 
                      Aucun cookie de tracking ou d'analytics n'est implémenté.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-800 dark:text-green-200 text-sm">
                      <strong>Conformité RGPD :</strong> En l'absence de collecte de données personnelles, 
                      ce site respecte naturellement les exigences du RGPD.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 4 - Propriété Intellectuelle */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Article 4 - Propriété Intellectuelle</h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">4.1 Marques Tierces</h3>
                    <p>
                      Tous les droits sur la marque "Camino TV" et les contenus associés appartiennent à leurs propriétaires légitimes. 
                      L'utilisation dans ce projet est <strong>purement illustrative</strong> et ne constitue aucune appropriation.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">4.2 Code Source</h3>
                    <p>
                      Le code source de ce projet utilise des technologies open source (MIT, ISC licenses). 
                      Le code développé spécifiquement pour ce projet reste la propriété du développeur.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">4.3 Contenu de Démonstration</h3>
                    <p>
                      Tous les contenus (articles, produits, descriptions) sont <strong>fictifs</strong> ou utilisés à des fins de démonstration. 
                      Ils ne reflètent pas de vraies informations sur Camino TV.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 5 - Responsabilité */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Article 5 - Limitation de Responsabilité</h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">5.1 Site de Démonstration</h3>
                    <p>
                      L'utilisateur reconnaît que ce site est un projet de démonstration technique. 
                      Aucune garantie n'est fournie quant au fonctionnement, à la disponibilité ou à l'exactitude du contenu.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">5.2 Liens Externes</h3>
                    <p>
                      Les liens vers les réseaux sociaux ou sites externes sont fournis à titre informatif. 
                      Le développeur n'est pas responsable du contenu de ces sites tiers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">5.3 Utilisation à Vos Risques</h3>
                    <p>
                      L'utilisation du site se fait aux risques et périls de l'utilisateur. 
                      Aucune responsabilité ne saurait être engagée en cas de problème technique.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 6 - Modifications */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-2xl font-bold">Article 6 - Évolution du Projet</h2>
                </div>
                
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">6.1 Modifications Techniques</h3>
                    <p>
                      Ce projet de démonstration peut évoluer pour présenter de nouvelles technologies ou fonctionnalités. 
                      Les présentes CGU peuvent être mises à jour en conséquence.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">6.2 Durée de Vie</h3>
                    <p>
                      En tant que projet de portfolio, ce site peut être modifié, déplacé ou supprimé sans préavis. 
                      Il n'y a aucun engagement de maintenance permanente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article 7 - Contact */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Article 7 - Contact et Questions</h2>
                
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Pour toute question concernant ce projet de démonstration technique ou ces conditions d'utilisation, 
                    vous pouvez consulter les <a href="/legal" className="text-blue-600 dark:text-blue-400 hover:underline">mentions légales</a> 
                    qui contiennent les informations de contact du développeur.
                  </p>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm">
                      <strong>Rappel :</strong> Ce site n'a aucun lien avec le vrai Camino TV. 
                      Pour contacter l'équipe officielle Camino TV, veuillez vous rendre sur leurs canaux officiels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>CGU en vigueur depuis le {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-2">Version 1.0 - Projet de démonstration technique</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}