import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Mail, 
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  Twitch
} from 'lucide-react';

export function ContactInfo() {

  return (
    <div className="space-y-6">
      {/* Informations principales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-brand-500" />
            Autres moyens de contact
          </CardTitle>
          <CardDescription>
            Vous préférez nous contacter autrement ? Voici toutes nos options.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Email direct */}
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-brand-500 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Email direct</p>
              <p className="text-sm text-muted-foreground">contact@caminotv.fr</p>
            </div>
          </div>

          {/* DM Instagram */}
          <div className="flex items-start gap-3">
            <Instagram className="h-5 w-5 text-brand-500 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">En DM sur Instagram</p>
              <p className="text-sm text-muted-foreground">@caminotv</p>
            </div>
          </div>

          {/* Localisation */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-brand-500 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Basé à</p>
              <p className="text-sm text-muted-foreground">Paris, France</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action - Style équipe */}
      <Card className="text-center p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Rejoignez l'aventure Camino TV
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Suivez-nous sur nos réseaux sociaux pour ne rien rater de nos dernières découvertes et bons plans.
        </p>
        <div className="grid grid-cols-2 gap-3">
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
          <Button asChild variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/50">
            <a href="https://www.twitch.tv/caminotv" target="_blank" rel="noopener noreferrer">
              <Twitch className="mr-2 h-4 w-4" />
              Twitch
            </a>
          </Button>
          <div className="col-span-2 flex justify-center">
            <Button asChild variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-950/50 w-full max-w-xs">
              <a href="https://www.tiktok.com/@caminotv?lang=fr" target="_blank" rel="noopener noreferrer">
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.26" clipRule="evenodd" />
                </svg>
                TikTok
              </a>
            </Button>
          </div>
        </div>
      </Card>

    </div>
  );
}