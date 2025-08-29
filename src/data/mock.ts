/**
 * Données de démonstration pour Camino TV
 * Inspiré de l'univers sneakers/streetwear français
 */

import { Deal, Brand, BlogPost, BlogAuthor } from '@/types';

export const mockBrands: Brand[] = [
  {
    id: 'nike',
    name: 'Nike',
    logoUrl: '/brands/nike.svg',
    isPartner: true,
  },
  {
    id: 'adidas', 
    name: 'Adidas',
    logoUrl: '/brands/adidas.svg',
    isPartner: true,
  },
  {
    id: 'jordan',
    name: 'Air Jordan',
    logoUrl: '/brands/jordan.svg',
    isPartner: true,
  },
  {
    id: 'newbalance',
    name: 'New Balance',
    logoUrl: '/brands/newbalance.svg',
    isPartner: false,
  },
  {
    id: 'stussy',
    name: 'Stussy',
    logoUrl: '/brands/stussy.svg',
    isPartner: true,
  },
  {
    id: 'decathlon',
    name: 'Decathlon',
    logoUrl: '/brands/decathlon.svg',
    isPartner: true,
  },
];

export const mockDeals: Deal[] = [
  {
    id: 'xiaomi-type-c-earphones',
    title: 'Xiaomi Type-C Earphones',
    brand: 'Xiaomi',
    originalPrice: 10,
    currentPrice: 10,
    discountPercentage: 0,
    imageUrl: '/Xiaomi Type-C Earphones.png',
    category: 'electronics',
    isNew: true,
    createdAt: '2025-01-26T14:00:00.000Z',
    affiliateUrl: 'https://www.mi.com/fr/product/xiaomi-type-c-earphones/?utm_campaign=loweu&utm_channel=affiliate&utm_source=awin&utm_medium=paid-affiliate&utm_type=1&aw_affid=331635&awc=22897_1756213311_9db2995485bbe3e0c6c13906f9bbf1fb',
  },
  {
    id: 'aj4-worn-blue',
    title: 'Jordan Air Jordan 4 Retro TEX Worn Blue',
    brand: 'Air Jordan',
    originalPrice: 210,
    currentPrice: 179,
    discountPercentage: 15,
    imageUrl: '/aj4.png',
    category: 'sneakers',
    isNew: true,
    createdAt: '2025-01-26T10:00:00.000Z',
    affiliateUrl: 'https://www.kickz.com/fr-FR/Jordan-Air-Jordan-4-Retro-TEX-Worn-Blue-Femmes-Blanc-C100/p/IB6716-100?awc=23153_1756132613_6e376c0b97ce7e15a0835fc14481fa84&amp;creativenumber=0&amp;creativetype=0&amp;publisherid=737541-&amp;size=36%2C5&amp;sv1=affiliate&amp;sv_campaign_id=737541&amp;utm_campaign=WhenToCop%3F+-+Le+calendrier+fran%C3%A7ais+des+sneakers&amp;utm_medium=aff&amp;utm_source=AWIN_FR&sv1=affiliate&sv_campaign_id=331635&awc=23153_1756212284_8ce920f8304d776f4af95995e8d9cb16',
    promoCode: 'WORNBLUE',
    promoDescription: 'Code valable jusqu\'au 31 mars 2025, dans la limite des stocks disponibles',
  },
  {
    id: '9',
    title: 'Veste Survêtement Decathlon AFLF',
    brand: 'Decathlon',
    originalPrice: 35,
    currentPrice: 35,
    discountPercentage: 0,
    imageUrl: '/decath-veste.jpg',
    category: 'streetwear',
    isNew: true,
    createdAt: '2025-01-15T08:00:00.000Z',
    affiliateUrl: 'https://www.decathlon.fr/p/veste-de-survetement-decathlon-aflf-marron/_/R-p-360225?mc=8959692&c=noir',
  },
  {
    id: '10', 
    title: 'Pantalon Survêtement Decathlon AFLF',
    brand: 'Decathlon',
    originalPrice: 30,
    currentPrice: 30,
    discountPercentage: 0,
    imageUrl: '/decath-bas.jpg',
    category: 'streetwear',
    isNew: true,
    createdAt: '2025-01-15T08:00:00.000Z',
    affiliateUrl: 'https://www.decathlon.fr/p/pantalon-de-survetement-decathlon-aflf-marron/_/R-p-360375?mc=8959697&c=noir',
  },
  {
    id: 'nike-bode-rec-lacing-knit',
    title: 'Nike x Bode Rec. Lacing Knit',
    brand: 'Nike',
    originalPrice: 249,
    currentPrice: 142,
    discountPercentage: 43,
    imageUrl: '/bodexnike1.jpg',
    category: 'streetwear',
    isNew: true,
    createdAt: '2025-01-29T12:00:00.000Z',
    affiliateUrl: 'https://www.asphaltgold.com/fr/products/nikex-bode-rec-lacing-knit-ecru-shadow-brown?wgu=300900_214131_17564511410979_58e815a296&wgexpiry=1787987141&utm_source=affiliate&utm_medium=track_webgains&utm_campaign=214131&source=webgains',
    promoCode: 'DESK25',
    promoDescription: 'Code promo valable sur le site Asphalt Gold',
  }
];

/**
 * Catégories pour la navigation et les filtres
 */
export const categories = [
  { id: 'sneakers', name: 'Sneakers', count: 6 },
  { id: 'streetwear', name: 'Streetwear', count: 3 },
  { id: 'accessories', name: 'Accessoires', count: 0 },
  { id: 'electronics', name: 'Tech', count: 0 },
  { id: 'lifestyle', name: 'Lifestyle', count: 1 },
] as const;

/**
 * Auteurs du blog Camino TV
 */
export const mockAuthors: BlogAuthor[] = [
  {
    id: 'sean',
    name: 'Sean',
    avatar: '/sean.jpeg',
    role: 'Fondateur & Creator',
  },
  {
    id: 'mike',
    name: 'Mike',
    avatar: '/mike.png',
    role: 'Content Creator',
  },
  {
    id: 'keusmo',
    name: 'Keusmo',
    avatar: '/keusmo.png',
    role: 'Influenceur Streetwear',
  },
  {
    id: 'elssy',
    name: 'Elssy',
    avatar: '/elssy.jpeg',
    role: 'Journaliste Mode',
  },
  {
    id: 'monroe',
    name: 'Monroe',
    avatar: '/monroe.jpeg',
    role: 'Expert Sneakers',
  },
  {
    id: 'piway',
    name: 'Piway',
    avatar: '/piway.jpeg',
    role: 'Photographe',
  },
  {
    id: 'messaoud',
    name: 'Messaoud',
    avatar: '/mess.png',
    role: 'Développeur',
  },
];

/**
 * Articles de blog pour la démonstration
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: '7',
    title: 'Thread : 20 créateurs français et belges à suivre absolument',
    slug: 'thread-20-createurs-francais-belges-suivre',
    excerpt: 'Notre sélection exclusive des pépites créatives francophones qui font vibrer la scène culturelle. De la musique au streetwear, découvrez les talents qui façonnent l\'avenir.',
    content: `<article>
      <header>
        <h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">20 Créateurs FR/BE : Les pépites qui nous inspirent</h1>
      </header>

      <p class="mb-4 text-foreground leading-relaxed">
        L'équipe Camino TV a partagé sur X notre sélection de créateurs français et belges qui méritent toute votre attention. Voici notre thread développé avec nos coups de cœur.
      </p>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Pourquoi ce thread ?</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Dans un paysage créatif en constante évolution, il est essentiel de mettre en lumière les talents qui façonnent la culture francophone. Ces créateurs apportent une vision unique, mêlant héritage culturel et innovation contemporaine.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Le thread complet</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Retrouvez ci-dessous notre thread Twitter complet avec tous les créateurs sélectionnés :
        </p>
      </section>
    </article>`,
    imageUrl: '/blog/creators-frbe.jpeg',
    category: 'culture',
    author: mockAuthors[0], // Sean
    publishedAt: '2024-01-16',
    readTime: 10,
    tags: ['créateurs', 'france', 'belgique', 'culture', 'thread'],
    isFeature: true,
  },
  {
    id: '9',
    title: 'Camino TV x Meller : La collaboration Amber qui révolutionne les lunettes',
    slug: 'caminotv-meller-collaboration-lunettes-amber',
    excerpt: 'Après 8 ans d\'aventure, Camino TV s\'associe à Meller pour créer les lunettes Amber, un design éclectique inspiré des années 90 qui rend la mode accessible à tous.',
    content: `<article>
      <header>
        <h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">Camino TV x Meller : La naissance des lunettes Amber</h1>
      </header>

      <p class="mb-4 text-foreground leading-relaxed">
        Nous sommes fiers de vous présenter notre collaboration la plus ambitieuse à ce jour : <strong class="font-semibold">Camino TV x Meller</strong>. Ensemble, nous avons conçu les <strong class="font-semibold">lunettes Amber</strong>, un modèle qui incarne parfaitement notre vision commune de rendre la mode accessible à tous.
      </p>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">L'histoire d'une rencontre</h2>

        <figure class="my-6">
          <img src="/blog/mellerxcamino/meller3.webp" alt="Processus de création Amber" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Le processus créatif derrière les lunettes Amber</figcaption>
        </figure>

        <p class="mb-4 text-foreground leading-relaxed">
          <strong class="font-semibold">Camino TV</strong> a commencé son aventure il y a 8 ans, partageant son style de vie depuis Paris et créant sa marque, <strong class="font-semibold">ENSEMBLE</strong>. Il y a un an, nous avons découvert l'univers Meller et le coup de foudre a été immédiat. Cette année, nous unissons nos forces avec une vision unique : <strong class="font-semibold">rendre la mode accessible à tous</strong>.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Cette collaboration représente bien plus qu'un simple partenariat commercial. C'est la rencontre de deux univers créatifs qui partagent les mêmes valeurs : l'authenticité, la qualité et l'accessibilité.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Les lunettes de soleil Amber : Un design intemporel</h2>

        <figure class="my-6">
          <img src="/blog/mellerxcamino/meller1.webp" alt="Design des lunettes Amber" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Le design éclectique inspiré des années 90</figcaption>
        </figure>

        <p class="mb-4 text-foreground leading-relaxed">
          D'un <strong class="font-semibold">design éclectique inspiré des années 90</strong>, les lunettes de soleil Amber sont dotées d'une branche intérieure en métal et d'une monture bicolore en acétate. Ce modèle unique combine :
        </p>

        <h3 class="text-xl font-bold mt-6 mb-3 text-foreground">Caractéristiques techniques</h3>
        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Protection UV400</strong> (Catégorie 1)</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Verres polarisés japonais TAC</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>Verres résistants aux chocs et aux rayures</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Monture en acétate bicolore</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>Branches intérieures en métal</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>Dimensions : 140mm (branches), 141mm (largeur), 42mm (hauteur)</span>
          </li>
        </ul>

        <h3 class="text-xl font-bold mt-6 mb-3 text-foreground">Un style authentique années 90</h3>
        <p class="mb-4 text-foreground leading-relaxed">
          Le design Amber puise son inspiration dans l'esthétique des années 90, une époque qui continue d'influencer la mode contemporaine. La monture bicolore en acétate apporte une touche de modernité à ce style rétro, créant un équilibre parfait entre nostalgie et innovation.
        </p>

        <figure class="my-6">
          <img src="/blog/mellerxcamino/meller4.jpg" alt="Détails de fabrication" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Les détails de fabrication soignés</figcaption>
        </figure>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Derrière le modèle Amber : Un an de collaboration</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Travaillant <strong class="font-semibold">main dans la main depuis plus d'un an</strong>, nous avons accompli ensemble toutes les étapes du processus de production. Cette collaboration intensive nous a permis de :
        </p>

        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Co-créer le design</strong> en alliant l'expertise technique de Meller et la vision créative de Camino TV</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Sélectionner les meilleurs matériaux</strong> pour garantir qualité et durabilité</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Peaufiner chaque détail</strong> pour obtenir un résultat à la hauteur de nos exigences</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Tester rigoureusement</strong> le produit final pour assurer un confort optimal</span>
          </li>
        </ul>

        <figure class="my-6">
          <img src="/blog/mellerxcamino/meller5.webp" alt="Lunettes Amber finales" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Le résultat final : les lunettes Amber</figcaption>
        </figure>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Creative Visionaries : Notre philosophie commune</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Cette collaboration s'inscrit dans notre démarche de <strong class="font-semibold">Creative Visionaries</strong>. Nous croyons fermement que la mode de qualité ne doit pas être réservée à une élite. Les lunettes Amber incarnent cette philosophie :
        </p>

        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Prix accessible</strong> : 50€ pour une qualité premium</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Style universel</strong> : Un design qui s'adapte à tous les styles</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Qualité professionnelle</strong> : Protection UV400 et verres polarisés</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Personnalisation possible</strong> : Modification des verres à votre vue chez un opticien</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Disponibilité et achat</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Les lunettes <strong class="font-semibold">Amber</strong> sont disponibles dès maintenant sur <a href="https://ensemble365.com/products/amber" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:text-brand-700 underline font-semibold">ensemble365.com</a> au prix de <strong class="font-semibold">50€</strong>.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Cette collaboration marque une étape importante dans l'évolution de Camino TV et témoigne de notre engagement à proposer des produits authentiques, accessibles et de qualité à notre communauté.
        </p>

        <p class="mb-4 text-foreground leading-relaxed font-semibold text-center italic">
          Les lunettes Amber : quand la vision rencontre la créativité.
        </p>
      </section>
    </article>`,
    imageUrl: '/blog/mellerxcamino/meller2.webp',
    category: 'lifestyle',
    author: mockAuthors[0], // Sean
    publishedAt: '2025-01-29',
    readTime: 5,
    tags: ['meller', 'collaboration', 'lunettes', 'amber', 'ensemble', 'années90'],
    isFeature: false,
  },
  {
    id: '8',
    title: 'Supraw x Uniqlo : L\'art toulousain s\'invite aux Zinzins de l\'Espace',
    slug: 'supraw-uniqlo-collaboration-zinzins-espace-toulouse',
    excerpt: 'L\'artiste toulousain Supraw collabore avec Uniqlo pour une collection exclusive inspirée des Zinzins de l\'Espace. Pop-up éphémère à Toulouse les 28/02/25 et 01/03/25.',
    content: `<article>
      <header>
        <h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">Supraw x Uniqlo : Quand l'art toulousain rencontre les Zinzins de l'Espace</h1>
      </header>

      <p class="mb-4 text-foreground leading-relaxed">
        L'univers créatif toulousain s'apprête à vivre un moment unique avec la collaboration entre <strong class="font-semibold">Supraw</strong> (Lucas Chauvin) et <strong class="font-semibold">Uniqlo</strong>. Cette collection exclusive, inspirée de la mythique série animée française "Les Zinzins de l'Espace", sera dévoilée lors d'un pop-up éphémère dans la ville rose.
      </p>

      <figure class="my-6">
        <img src="/blog/supraw2.webp" alt="Aperçu de la collaboration Supraw x Uniqlo" class="w-full h-auto rounded-lg shadow-sm" />
        <figcaption class="text-sm text-muted-foreground mt-2 text-center">Aperçu de la collaboration Supraw x Uniqlo</figcaption>
      </figure>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">L'événement incontournable du streetwear toulousain</h2>

        <div class="bg-muted/50 rounded-lg p-4 mb-4">
          <ul class="space-y-2">
            <li class="flex items-start">
              <span class="text-brand-500 mr-2">📅</span>
              <span><strong class="font-semibold">Dates :</strong> 28/02/25 et 01/03/25</span>
            </li>
            <li class="flex items-start">
              <span class="text-brand-500 mr-2">📍</span>
              <span><strong class="font-semibold">Lieu :</strong> Uniqlo Toulouse, 3 Rue du Poids de l'Huile</span>
            </li>
            <li class="flex items-start">
              <span class="text-brand-500 mr-2">⏰</span>
              <span><strong class="font-semibold">Modalités :</strong> Sur inscription, premier arrivé, premier servi</span>
            </li>
          </ul>
        </div>

        <p class="mb-4 text-foreground leading-relaxed">
          Cette collaboration marque une étape importante dans le parcours de Supraw, qui après une année 2024 riche en projets (exposition parisienne "Let me expose my art", collaboration avec Mokovel), s'associe aujourd'hui à la géante japonaise Uniqlo.
        </p>

        <figure class="my-6">
          <img src="/blog/supraw3.jpg" alt="Collection Supraw x Uniqlo Zinzins de l'Espace" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Collection Supraw x Uniqlo inspirée des Zinzins de l'Espace</figcaption>
        </figure>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Une collection qui réveille la nostalgie</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          La collection <strong class="font-semibold">Supraw x Uniqlo</strong> puise son inspiration dans l'univers déjanté des "Zinzins de l'Espace", série culte des années 90-2000 qui a marqué toute une génération. L'artiste toulousain revisite cet univers avec sa patte créative unique, proposant :
        </p>

        <h3 class="text-xl font-bold mt-6 mb-3 text-foreground">Gamme de produits</h3>
        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Denim</strong> revisité aux couleurs de l'espace</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Sweatwear</strong> avec personnalisations exclusives</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Pièces limitées colorées</strong> en quantité restreinte</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Pièces monochromes</strong> pour les amateurs de sobriété</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Service de customisation</strong> sur place</span>
          </li>
        </ul>

        <figure class="my-6">
          <img src="/blog/supraw4.jpg" alt="Pièces de la collection Supraw Uniqlo" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Pièces de la collection Supraw x Uniqlo</figcaption>
        </figure>

        <h3 class="text-xl font-bold mt-6 mb-3 text-foreground">Tarification accessible</h3>
        <p class="mb-4 text-foreground leading-relaxed">
          La collection s'inscrit dans la philosophie Uniqlo avec des prix allant de <strong class="font-semibold">34,90€ à 59,90€</strong>, rendant l'art streetwear accessible au plus grand nombre.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Un événement sous le signe de l'exclusivité</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          L'événement promet d'être un moment fort pour la communauté streetwear toulousaine :
        </p>

        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Inscription obligatoire</strong> pour garantir sa place</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Limite d'un article par personne</strong> pour une distribution équitable</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Cadeaux surprise</strong> avec distribution aléatoire de jouets</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">QR code Camino</strong> requis pour l'achat (collaboration exclusive)</span>
          </li>
        </ul>

        <figure class="my-6">
          <img src="/blog/supraw5.jpg" alt="Événement pop-up Supraw x Uniqlo Toulouse" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Événement pop-up Supraw x Uniqlo à Toulouse</figcaption>
        </figure>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Supraw : L'ascension d'un talent toulousain</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Lucas Chauvin, alias Supraw, incarne la nouvelle génération d'artistes français qui mélangent culture pop et art contemporain. Après avoir conquis Paris en 2024, il revient dans sa ville natale pour cette collaboration inédite qui promet de marquer les esprits.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Cette collaboration Supraw x Uniqlo illustre parfaitement la montée en puissance de la scène créative toulousaine et l'intérêt croissant des marques internationales pour les talents locaux français.
        </p>

        <p class="mb-4 text-foreground leading-relaxed font-semibold text-center italic">
          Rendez-vous fin février pour découvrir cette collection qui promet de réveiller l'enfant qui sommeille en nous !
        </p>
      </section>
    </article>`,
    imageUrl: '/blog/supraw.jpg',
    category: 'streetwear',
    author: mockAuthors[0], // Sean
    publishedAt: '2025-01-19',
    readTime: 6,
    tags: ['supraw', 'uniqlo', 'toulouse', 'collaboration', 'zinzins', 'art'],
    isFeature: false,
  },
];

/**
 * Catégories de blog pour la navigation
 */
export const blogCategories = [
  { id: 'culture', name: 'Culture', count: 3 },
  { id: 'streetwear', name: 'Streetwear', count: 2 },
  { id: 'musique', name: 'Musique', count: 1 },
  { id: 'interview', name: 'Interviews', count: 1 },
  { id: 'lifestyle', name: 'Lifestyle', count: 1 },
  { id: 'tendances', name: 'Tendances', count: 1 },
] as const;