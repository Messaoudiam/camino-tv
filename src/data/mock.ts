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
    avatar: '/sean1.jpg',
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
    avatar: '/keuss.jpg',
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
  {
    id: 'chasseur',
    name: 'Chasseur',
    avatar: '/chasseur.jpg',
    role: 'Content Creator',
  },
  {
    id: 'saku',
    name: 'Saku',
    avatar: '/saku.jpg',
    role: 'Content Creator',
  },
  {
    id: 'souk',
    name: 'Souk',
    avatar: '/team/souk.jpg',
    role: 'Styliste',
  },
  {
    id: 'bous',
    name: 'Bous',
    avatar: '/bous.jpg',
    role: 'Social Media',
  },
  {
    id: 'wade',
    name: 'Wade',
    avatar: '/wade.jpg',
    role: 'Social Media',
  },
  {
    id: 'linda',
    name: 'Linda',
    avatar: '/linda.jpg',
    role: 'Chef de Projet',
  },
  {
    id: 'adlane',
    name: 'Adlane',
    avatar: '/team/adlane.jpg',
    role: 'Développeur',
  },
  {
    id: 'alexis',
    name: 'Alexis',
    avatar: '/alexis.jpg',
    role: 'Développeur',
  },
  {
    id: 'greed',
    name: 'Greed',
    avatar: '/greed.jpg',
    role: 'Manager',
  },
];

/**
 * Articles de blog pour la démonstration
 */
export const mockBlogPosts: BlogPost[] = [
  {
    id: '11',
    title: 'Communitee : Les gagnants du concours Adidas x Camino TV révélés !',
    slug: 'communitee-gagnants-concours-adidas-camino-tv-reveles',
    excerpt: '🏆 Découvrez les 3 créateurs lauréats du concours Communitee ! HTK, Garçons Jeunes et Donovann Bonnet ont conquis le jury avec leurs designs révolutionnaires de la veste Firebird.',
    content: `<article>
      <header>
        <h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">🏆 Communitee : Les gagnants enfin révélés !</h1>
      </header>

      <p class="mb-4 text-foreground leading-relaxed">
        Après plusieurs semaines d'attente et des centaines de créations exceptionnelles, les gagnants du concours <strong class="font-semibold">Communitee</strong> organisé par <strong class="font-semibold">Adidas</strong> et <strong class="font-semibold">Camino TV</strong> sont enfin connus !
      </p>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">🎉 L'annonce officielle</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Après plusieurs semaines d'attente et des centaines de créations exceptionnelles, découvrez l'annonce officielle des gagnants du concours Communitee :
        </p>

        <div class="flex justify-center mb-8">
          <blockquote 
            class="instagram-media" 
            data-instgrm-permalink="https://www.instagram.com/reel/DFyEB5btuai/?utm_source=ig_embed&utm_campaign=loading" 
            data-instgrm-version="14"
            style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
            <div style="padding:16px;">
              <a href="https://www.instagram.com/reel/DFyEB5btuai/?utm_source=ig_embed&utm_campaign=loading" 
                 style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" 
                 target="_blank" rel="noopener noreferrer">
                <div style="display: flex; flex-direction: row; align-items: center;">
                  <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div>
                  <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;">
                    <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div>
                    <div style="background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div>
                  </div>
                </div>
                <div style="padding: 19% 0;"></div>
                <div style="display:block; height:50px; margin:0 auto 12px; width:50px;">
                  <svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <g transform="translate(-511.000000, -20.000000)" fill="#000000">
                        <g>
                          <path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div style="padding-top: 8px;">
                  <div style="color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;">
                    Voir cette publication sur Instagram
                  </div>
                </div>
                <div style="padding: 12.5% 0;"></div>
              </a>
              <p style="color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">
                <a href="https://www.instagram.com/reel/DFyEB5btuai/?utm_source=ig_embed&utm_campaign=loading" 
                   style="color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" 
                   target="_blank" rel="noopener noreferrer">
                  Une publication partagée par Camino TV (@camino_tv)
                </a>
              </p>
            </div>
          </blockquote>
          <script async src="https://www.instagram.com/embed.js"></script>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">🎨 Les 3 créateurs lauréats</h2>

        <p class="mb-6 text-foreground leading-relaxed">
          Parmi toutes les créations soumises, trois designs se sont particulièrement distingués par leur originalité, leur respect des contraintes et leur message inspirant. <strong class="font-semibold">Les 3 gagnants sont tous ex æquo</strong> et méritent une reconnaissance égale pour leur talent exceptionnel :
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-muted/30 rounded-lg p-6 text-center">
            <div class="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="/blog/communi-tee/htk.jpg" 
                alt="HTK Logo" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="relative w-32 h-32 mx-auto mb-4">
              <img 
                src="/blog/communi-tee/htk-veste.png" 
                alt="Veste HTK" 
                class="w-full h-full object-contain"
              />
            </div>
            <h3 class="text-xl font-bold text-foreground mb-3">
              <a href="https://caminotv.com/communitee/tee/17572/Kokza" target="_blank" rel="noopener noreferrer" class="hover:text-brand-600 transition-colors">
                HTK
              </a>
            </h3>
            <div class="space-y-1">
              <a 
                href="https://www.instagram.com/htk_isthebrand/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center w-8 h-8 text-brand-600 hover:text-brand-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://caminotv.com/communitee/tee/17572/Kokza" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="block text-muted-foreground hover:text-foreground underline text-sm"
              >
                Voir l'oeuvre sur COMMUNI-TEE
              </a>
            </div>
          </div>

          <div class="bg-muted/30 rounded-lg p-6 text-center">
            <div class="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="/blog/communi-tee/garcons-jeunes.jpg" 
                alt="Garçons Jeunes" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="relative w-32 h-32 mx-auto mb-4">
              <img 
                src="/blog/communi-tee/garsons-jeunes-veste.png" 
                alt="Veste Garçons Jeunes" 
                class="w-full h-full object-contain"
              />
            </div>
            <h3 class="text-xl font-bold text-foreground mb-3">
              <a href="https://caminotv.com/communitee/tee/7777/garcsonsjeunes" target="_blank" rel="noopener noreferrer" class="hover:text-brand-600 transition-colors">
                Garçons Jeunes
              </a>
            </h3>
            <div class="space-y-1">
              <a 
                href="https://www.instagram.com/garconsjeunes/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center w-8 h-8 text-brand-600 hover:text-brand-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                </svg>
              </a>
              <a 
                href="https://caminotv.com/communitee/tee/7777/garcsonsjeunes" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="block text-muted-foreground hover:text-foreground underline text-sm"
              >
                Voir l'oeuvre sur COMMUNI-TEE
              </a>
            </div>
          </div>

          <div class="bg-muted/30 rounded-lg p-6 text-center">
            <div class="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
              <img 
                src="/blog/communi-tee/donovann.jpg" 
                alt="Donovann Bonnet" 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="relative w-32 h-32 mx-auto mb-4">
              <img 
                src="/blog/communi-tee/donovann-veste.png" 
                alt="Veste Donovann Bonnet" 
                class="w-full h-full object-contain"
              />
            </div>
            <h3 class="text-xl font-bold text-foreground mb-3">
              <a href="https://caminotv.com/communitee/tee/12945/Donovann" target="_blank" rel="noopener noreferrer" class="hover:text-brand-600 transition-colors">
                Donovann Bonnet
              </a>
            </h3>
            <div class="space-y-1">
              <a 
                href="https://www.instagram.com/donovannbonnet/" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-flex items-center justify-center w-8 h-8 text-brand-600 hover:text-brand-700 transition-colors"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://caminotv.com/communitee/tee/12945/Donovann" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="block text-muted-foreground hover:text-foreground underline text-sm"
              >
                Voir l'oeuvre sur COMMUNI-TEE
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">🌟 Ce qui a fait la différence</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Les designs gagnants ont su parfaitement incarner l'esprit du concours Communitee en alliant :
        </p>

        <ul class="mb-6 space-y-3">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-3 mt-1">✨</span>
            <span><strong class="font-semibold">Créativité authentique</strong> : Chaque création raconte une histoire personnelle unique</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-3 mt-1">🎯</span>
            <span><strong class="font-semibold">Respect des contraintes</strong> : Logo trefoil, 3 bandes et essence Firebird préservés</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-3 mt-1">💝</span>
            <span><strong class="font-semibold">Message de bienveillance</strong> : Des designs qui véhiculent des valeurs positives</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-3 mt-1">🏠</span>
            <span><strong class="font-semibold">Représentation d'un "chez-soi"</strong> : Des lieux qui ont du sens pour leurs créateurs</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">🎊 Un concours qui marque l'histoire</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Le succès du concours Communitee dépasse toutes les attentes. Avec des centaines de participations et une créativité débordante, cette première édition aura marqué un tournant dans l'histoire des collaborations entre créateurs émergents et grandes marques.
        </p>

        <div class="bg-muted/50 rounded-lg p-6 mb-6">
          <h3 class="font-bold mb-3 text-foreground">📊 Quelques chiffres clés</h3>
          <ul class="space-y-2 text-sm">
            <li class="flex justify-between">
              <span>Designs soumis</span>
              <span class="font-semibold">Centaines de créations</span>
            </li>
            <li class="flex justify-between">
              <span>Durée du concours</span>
              <span class="font-semibold">3 semaines</span>
            </li>
            <li class="flex justify-between">
              <span>Prix total</span>
              <span class="font-semibold">2000€ + collaboration</span>
            </li>
            <li class="flex justify-between">
              <span>Bonus communauté</span>
              <span class="font-semibold">500€ pour un supporter</span>
            </li>
          </ul>
        </div>

        <p class="mb-4 text-foreground leading-relaxed">
          Ce concours prouve que l'innovation peut naître de partout et que les grandes marques ont tout intérêt à s'ouvrir aux talents émergents. <strong class="font-semibold">HTK</strong>, <strong class="font-semibold">Garçons Jeunes</strong> et <strong class="font-semibold">Donovann Bonnet</strong> rejoignent ainsi le cercle très fermé des créateurs ayant collaboré avec Adidas.
        </p>

      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">🚀 Et maintenant ?</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Les trois lauréats <strong class="font-semibold">HTK</strong>, <strong class="font-semibold">Garçons Jeunes</strong> et <strong class="font-semibold">Donovann Bonnet</strong> vont maintenant entamer leurs collaborations avec Adidas. Leurs designs pourraient bientôt se retrouver en boutique, marquant le début d'aventures exceptionnelles.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Quant aux autres participants, ils peuvent être fiers d'avoir participé à cette aventure créative unique. Le succès de Communitee ouvre la voie à de futures collaborations entre <strong class="font-semibold">Camino TV</strong> et d'autres grandes marques.
        </p>

        <div class="bg-gradient-to-r from-brand-500/10 via-brand-600/5 to-brand-500/10 rounded-xl p-6 border border-brand-200/50 dark:border-brand-800/30 mt-8">
          <p class="text-center font-semibold text-foreground mb-2">
            🔥 Restez connectés !
          </p>
          <p class="text-center text-sm text-muted-foreground mb-3">
            Suivez <strong class="text-foreground">Camino TV</strong> pour ne manquer aucune future opportunité créative. Le prochain concours pourrait être le vôtre !
          </p>
          <p class="text-center text-xs text-muted-foreground">
            📖 <a href="/blog/communitee-concours-design-adidas-firebird-camino-tv" class="text-brand-600 hover:text-brand-700 underline">Découvrir l'article original du concours Communitee</a>
          </p>
        </div>
      </section>
    </article>`,
    imageUrl: '/blog/communi-tee/communitee1.jpg',
    category: 'culture',
    author: mockAuthors[0], // Sean
    publishedAt: '2025-01-30',
    readTime: 5,
    tags: ['communitee', 'gagnants', 'adidas', 'camino-tv', 'results', 'htk', 'garcons-jeunes', 'donovann-bonnet'],
    isFeature: true,
  },
  {
    id: '10',
    title: 'Communitee : Reimaginez la veste Firebird avec Adidas et Camino TV',
    slug: 'communitee-concours-design-adidas-firebird-camino-tv',
    excerpt: 'Participez au concours créatif Communitee ! Redesignez la mythique veste Firebird d\'Adidas et tentez de remporter 2000€, une collaboration officielle et un voyage en Allemagne.',
    content: `<article>
      <header>
        <h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">Communitee : L'opportunité créative de votre vie avec Adidas</h1>
      </header>

      <p class="mb-4 text-foreground leading-relaxed">
        <strong class="font-semibold">Adidas</strong> et <strong class="font-semibold">Camino TV</strong> s'associent pour vous offrir une opportunité unique : repenser la mythique veste <strong class="font-semibold">Firebird</strong> et potentiellement collaborer avec l'une des plus grandes marques de sportswear au monde.
      </p>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Le défi créatif Communitee</h2>

        <figure class="my-6">
          <img src="/blog/communi-tee/communitee2.png" alt="Interface de personnalisation Communitee" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">L'outil de personnalisation Communitee pour créer votre veste Firebird</figcaption>
        </figure>

        <p class="mb-4 text-foreground leading-relaxed">
          Le projet <strong class="font-semibold">Communitee</strong> vous invite à redesigner la veste Firebird avec une contrainte simple mais puissante : <strong class="font-semibold">créer une veste qui représente un lieu qui vous fait sentir chez vous</strong>.
        </p>

        <div class="bg-muted/50 rounded-lg p-4 mb-4">
          <h3 class="font-bold mb-2 text-foreground">⏰ Informations essentielles</h3>
          <ul class="space-y-2">
            <li class="flex items-start">
              <span class="text-brand-500 mr-2">📅</span>
              <span><strong class="font-semibold">Date limite :</strong> 22 décembre 2024 à 23h59</span>
            </li>
            <li class="flex items-start">
              <span class="text-brand-500 mr-2">🎨</span>
              <span><strong class="font-semibold">Thème :</strong> "Un lieu qui vous fait sentir chez vous"</span>
            </li>
            <li class="flex items-start">
              <span class="text-brand-500 mr-2">💭</span>
              <span><strong class="font-semibold">Message :</strong> Véhiculer un message de bienveillance et de vivre-ensemble</span>
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Un prix exceptionnel pour le gagnant</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Le gagnant du concours Communitee remportera un package exceptionnel :
        </p>

        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">💰</span>
            <span><strong class="font-semibold">2 000€ en cash</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">🤝</span>
            <span><strong class="font-semibold">Collaboration officielle avec Adidas</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">📈</span>
            <span><strong class="font-semibold">Pourcentage sur les ventes</strong> de votre design</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">✈️</span>
            <span><strong class="font-semibold">Voyage au siège mondial d'Adidas</strong> à Herzogenaurach, Allemagne</span>
          </li>
        </ul>

        <p class="mb-4 text-foreground leading-relaxed">
          En plus, <strong class="font-semibold">un supporter du design gagnant</strong> remportera un bon d'achat de <strong class="font-semibold">500€</strong> !
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Les règles du concours</h2>

        <h3 class="text-xl font-bold mt-6 mb-3 text-foreground">Contraintes créatives</h3>
        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>La veste doit rester <strong class="font-semibold">reconnaissable comme une Firebird</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>Utiliser le <strong class="font-semibold">logo trefoil d'Adidas</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>Intégrer le <strong class="font-semibold">design des 3 bandes sur les manches</strong></span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span>Représenter un <strong class="font-semibold">lieu significatif pour vous</strong></span>
          </li>
        </ul>

        <h3 class="text-xl font-bold mt-6 mb-3 text-foreground">Comment participer</h3>
        <ol class="mb-4 space-y-2 list-decimal list-inside">
          <li class="ml-4 my-1">
            <span>Créez votre design avec l'outil en ligne ou un logiciel externe</span>
          </li>
          <li class="ml-4 my-1">
            <span>Partagez votre création dans la galerie du projet</span>
          </li>
          <li class="ml-4 my-1">
            <span>Attendez les votes de la communauté</span>
          </li>
          <li class="ml-4 my-1">
            <span>Croisez les doigts pour la sélection finale !</span>
          </li>
        </ol>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Un message de bienveillance</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Au-delà du concours, Communitee porte un message fort : celui de la <strong class="font-semibold">bienveillance et du vivre-ensemble</strong>. Chaque participant est invité à créer un design qui non seulement représente un lieu cher à son cœur, mais qui véhicule également des valeurs positives.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Cette initiative s'inscrit parfaitement dans l'ADN de <strong class="font-semibold">Camino TV</strong>, qui depuis ses débuts prône l'authenticité, la créativité et le soutien aux talents émergents.
        </p>

        <figure class="my-8">
          <img src="/blog/communi-tee/zidane-cisse.jpg" alt="Zidane et Djibril Cissé lors du lancement de Communitee" class="w-full h-auto rounded-lg shadow-sm" />
          <figcaption class="text-sm text-muted-foreground mt-2 text-center">Zidane et Djibril Cissé présents lors du lancement de Communitee</figcaption>
        </figure>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Galerie communautaire</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          La galerie du projet permet à tous les participants de :
        </p>

        <ul class="mb-4 space-y-2">
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Découvrir</strong> les créations des autres participants</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Voter</strong> pour leurs designs favoris</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">S'inspirer</strong> mutuellement</span>
          </li>
          <li class="ml-4 my-1 flex items-start">
            <span class="text-brand-500 mr-2">•</span>
            <span><strong class="font-semibold">Créer une communauté</strong> autour de la créativité</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Une opportunité unique</h2>

        <p class="mb-4 text-foreground leading-relaxed">
          Communitee représente bien plus qu'un simple concours : c'est la chance de <strong class="font-semibold">collaborer avec une marque iconique</strong>, de voir son travail reconnu à l'échelle internationale et de rejoindre le cercle très fermé des créateurs ayant travaillé avec Adidas.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Que vous soyez designer professionnel ou amateur passionné, cette opportunité s'adresse à tous ceux qui ont une vision créative à partager.
        </p>

        <p class="mb-4 text-foreground leading-relaxed font-semibold text-center italic">
          Votre créativité pourrait bien révolutionner la prochaine Firebird !
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">Comment participer</h2>

        <div class="rounded-xl p-6 border border-border mb-6">
          <p class="text-center font-semibold text-foreground mb-2">
            🏆 Mise à jour : Les gagnants sont connus !
          </p>
          <p class="text-center text-sm text-muted-foreground mb-3">
            Le concours Communitee s'est terminé et les lauréats ont été révélés.
          </p>
          <p class="text-center">
            <a href="/blog/communitee-gagnants-concours-adidas-camino-tv-reveles" class="text-brand-600 hover:text-brand-700 underline font-semibold">
              🎉 Découvrir les gagnants du concours
            </a>
          </p>
        </div>

        <p class="mb-4 text-foreground leading-relaxed">
          <em class="text-muted-foreground">Le concours s'est terminé le 22 décembre 2024 à 23h59.</em> Pour participer aux futurs concours, restez connectés sur <a href="https://caminotv.com/communitee/" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:text-brand-700 underline font-semibold">caminotv.com/communitee</a> et suivez les réseaux sociaux de <strong class="font-semibold">Camino TV</strong>.
        </p>

        <p class="mb-4 text-foreground leading-relaxed">
          Le succès de cette première édition ouvre la voie à de nouvelles opportunités créatives !
        </p>
      </section>
    </article>`,
    imageUrl: '/blog/communi-tee/zidane.jpg',
    category: 'culture',
    author: mockAuthors[0], // Sean
    publishedAt: '2025-01-31',
    readTime: 8,
    tags: ['adidas', 'communitee', 'concours', 'design', 'firebird', 'collaboration'],
    isFeature: false,
  },
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
    isFeature: false,
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
    publishedAt: '2025-01-28',
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
  { id: 'culture', name: 'Culture', count: 5 },
  { id: 'streetwear', name: 'Streetwear', count: 2 },
  { id: 'musique', name: 'Musique', count: 1 },
  { id: 'interview', name: 'Interviews', count: 1 },
  { id: 'lifestyle', name: 'Lifestyle', count: 1 },
  { id: 'tendances', name: 'Tendances', count: 1 },
] as const;