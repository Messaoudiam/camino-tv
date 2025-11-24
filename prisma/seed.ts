import { PrismaClient } from "@prisma/client";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { bytesToHex } from "@noble/hashes/utils.js";

const prisma = new PrismaClient();

/**
 * Hash password using the EXACT same method as Better Auth
 * From: node_modules/better-auth/dist/crypto-BQxYXGGX.mjs
 */
const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
};

function hexEncode(bytes: Uint8Array): string {
  return bytesToHex(bytes);
}

async function generateKey(
  password: string,
  salt: string,
): Promise<Uint8Array> {
  return await scryptAsync(password.normalize("NFKC"), salt, {
    N: config.N,
    p: config.p,
    r: config.r,
    dkLen: config.dkLen,
    maxmem: 128 * config.N * config.r * 2,
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = hexEncode(crypto.getRandomValues(new Uint8Array(16)));
  const key = await generateKey(password, salt);
  return `${salt}:${hexEncode(key)}`;
}

async function main() {
  console.log("🌱 Starting database seed...");

  // Clean existing data (optional - comment out in production)
  console.log("🧹 Cleaning existing data...");
  await prisma.favorite.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  await prisma.verification.deleteMany();

  // ============================================
  // SEED USERS
  // ============================================
  console.log("\n👤 Creating users...");

  const password = "Admin123!@#";
  const hashedPassword = await hashPassword(password);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@camino-tv.com",
      name: "Admin Camino",
      emailVerified: true,
      role: "ADMIN",
      image: "https://i.pravatar.cc/150?img=68",
      accounts: {
        create: {
          accountId: "admin@camino-tv.com",
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  const seanUser = await prisma.user.create({
    data: {
      email: "sean@camino-tv.com",
      name: "Sean",
      emailVerified: true,
      role: "ADMIN",
      image: "https://i.pravatar.cc/150?img=12",
      accounts: {
        create: {
          accountId: "sean@camino-tv.com",
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: "demo@camino-tv.com",
      name: "Demo User",
      emailVerified: true,
      role: "USER",
      accounts: {
        create: {
          accountId: "demo@camino-tv.com",
          providerId: "credential",
          password: hashedPassword,
        },
      },
    },
  });

  console.log(`✅ Created admin: ${adminUser.email}`);
  console.log(`✅ Created sean: ${seanUser.email}`);
  console.log(`✅ Created demo user: ${demoUser.email}`);
  console.log(`   Password for all: ${password}`);

  // ============================================
  // SEED DEALS - From CaminoTV Twitter + extras
  // ============================================
  console.log("\n💰 Creating deals...");

  const deals = [
    // ========== DEALS FROM CAMINOTV TWITTER ==========

    // Nike Sale -50% (Tweet du 17 nov 2025)
    {
      title: "Nike Sale - Jusqu'à -50% sur le site Nike",
      brand: "Nike",
      originalPrice: 120.0,
      currentPrice: 60.0,
      discountPercentage: 50,
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      category: "sneakers" as const,
      affiliateUrl: "https://chck.me/yKgB",
      promoDescription: "Beaucoup de bons plans aux alentours de 60€",
      isNew: true,
      isLimited: true,
      isActive: true,
    },

    // Nike Solo Swoosh Jogging Coupe Droite (Tweet du 24 nov 2025)
    {
      title: "Nike Solo Swoosh Jogging Gris - Coupe Droite",
      brand: "Nike",
      originalPrice: 110.0,
      currentPrice: 66.0,
      discountPercentage: 40,
      imageUrl:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/ixfF",
      promoDescription: "Le meilleur jogging gris de Nike en promo",
      isNew: true,
      isLimited: false,
      isActive: true,
    },

    // Nike Solo Swoosh Jogging Resserré
    {
      title: "Nike Solo Swoosh Jogging Gris - Resserré",
      brand: "Nike",
      originalPrice: 90.0,
      currentPrice: 54.0,
      discountPercentage: 40,
      imageUrl:
        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/eSNB",
      promoDescription: "Coupe resserrée, parfait pour le quotidien",
      isNew: true,
      isLimited: false,
      isActive: true,
    },

    // Nike Solo Swoosh Jogging Premium
    {
      title: "Nike Solo Swoosh Jogging - Le + Quali",
      brand: "Nike",
      originalPrice: 140.0,
      currentPrice: 69.0,
      discountPercentage: 51,
      imageUrl:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/I21t",
      promoDescription: "La version premium du jogging Solo Swoosh",
      isNew: true,
      isLimited: true,
      isActive: true,
    },

    // Carhartt Detroit Jacket Black Friday (Tweet du 24 nov 2025)
    {
      title: "Carhartt WIP Detroit Jacket - Black Friday",
      brand: "Carhartt WIP",
      originalPrice: 250.0,
      currentPrice: 175.0,
      discountPercentage: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/HvaF",
      promoDescription:
        "Le Black Friday Carhartt a commencé ! Plusieurs coloris disponibles",
      isNew: true,
      isLimited: true,
      isActive: true,
    },

    // Carhartt Pants Camo (Tweet du 24 nov 2025)
    {
      title: "Carhartt WIP Pants - Camo Print",
      brand: "Carhartt WIP",
      originalPrice: 139.0,
      currentPrice: 97.0,
      discountPercentage: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/DWfq",
      promoDescription:
        "La coupe des pants Carhartt est dar et en promo c'est encore mieux",
      isNew: false,
      isLimited: false,
      isActive: true,
    },

    // Carhartt Pants Gris
    {
      title: "Carhartt WIP Pants - Gris",
      brand: "Carhartt WIP",
      originalPrice: 109.0,
      currentPrice: 77.0,
      discountPercentage: 29,
      imageUrl:
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/fR43",
      promoDescription: "Pantalon Carhartt coupe classique",
      isNew: false,
      isLimited: false,
      isActive: true,
    },

    // Carhartt Pants Workwear
    {
      title: "Carhartt WIP Pants - Le + Workwear",
      brand: "Carhartt WIP",
      originalPrice: 149.0,
      currentPrice: 105.0,
      discountPercentage: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://chck.me/Gw2O",
      promoDescription: "Le style workwear authentique Carhartt",
      isNew: false,
      isLimited: false,
      isActive: true,
    },

    // ========== AUTRES DEALS ==========

    // Jordan 1
    {
      title: "Jordan 1 Retro High OG - Chicago",
      brand: "Jordan",
      originalPrice: 180.0,
      currentPrice: 159.99,
      discountPercentage: 11,
      imageUrl:
        "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800",
      category: "sneakers" as const,
      affiliateUrl: "https://nike.com/jordan-1",
      isNew: false,
      isLimited: true,
      isActive: true,
    },

    // New Balance 550
    {
      title: "New Balance 550 - White Green",
      brand: "New Balance",
      originalPrice: 149.99,
      currentPrice: 119.99,
      discountPercentage: 20,
      imageUrl:
        "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
      category: "sneakers" as const,
      affiliateUrl: "https://newbalance.com/550",
      promoCode: "NB20OFF",
      promoDescription: "20% sur les 550 avec ce code",
      isNew: false,
      isLimited: false,
      isActive: true,
    },

    // Adidas Firebird (Communi-Tee collab)
    {
      title: "Adidas Firebird Jacket - Communi-Tee x Camino TV",
      brand: "Adidas",
      originalPrice: 90.0,
      currentPrice: 90.0,
      discountPercentage: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      category: "streetwear" as const,
      affiliateUrl: "https://caminotv.com/",
      promoDescription:
        "Collaboration exclusive Adidas x Camino TV - Design personnalisable",
      isNew: true,
      isLimited: true,
      isActive: true,
    },

    // Casquette New Era
    {
      title: "Casquette New Era 59FIFTY NY Yankees",
      brand: "New Era",
      originalPrice: 42.99,
      currentPrice: 29.99,
      discountPercentage: 30,
      imageUrl:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800",
      category: "accessories" as const,
      affiliateUrl: "https://neweracap.com/59fifty",
      promoCode: "CAP30",
      promoDescription: "30% sur toutes les casquettes",
      isNew: false,
      isLimited: false,
      isActive: true,
    },

    // Sony WH-1000XM5
    {
      title: "Sony WH-1000XM5 - Casque Bluetooth Premium",
      brand: "Sony",
      originalPrice: 399.99,
      currentPrice: 299.99,
      discountPercentage: 25,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      category: "electronics" as const,
      affiliateUrl: "https://sony.com/wh1000xm5",
      promoCode: "TECH25",
      promoDescription: "25% de réduction sur l'audio premium",
      isNew: true,
      isLimited: false,
      isActive: true,
    },
  ];

  for (const deal of deals) {
    await prisma.deal.create({ data: deal });
  }

  console.log(`✅ Created ${deals.length} deals`);

  // ============================================
  // SEED BLOG POSTS (10 articles)
  // ============================================
  console.log("\n📝 Creating blog posts...");

  const blogPosts = [
    // CULTURE (2)
    {
      title:
        "L'évolution de la culture sneaker en France : de la rue aux podiums",
      slug: "evolution-culture-sneaker-france",
      excerpt:
        "Retour sur 30 ans d'histoire de la sneaker culture française, de ses origines dans les cités aux défilés de haute couture.",
      content: `<h2>Introduction</h2>
<p>La culture sneaker en France a connu une transformation spectaculaire au cours des trois dernières décennies. Ce qui était autrefois un simple choix de chaussures pour les jeunes des quartiers populaires est devenu un phénomène culturel mondial, influençant la mode, l'art et même l'économie.</p>

<h2>Les années 90 : Les fondations</h2>
<p>Dans les années 90, les sneakers étaient avant tout un marqueur d'identité dans les cités françaises. Les Nike Air Max, les Reebok Classic et les Adidas Superstar étaient les modèles de prédilection. Le hip-hop américain, avec des artistes comme Run-DMC et leur hymne "My Adidas", a joué un rôle crucial dans cette adoption.</p>

<h2>Les années 2000 : La démocratisation</h2>
<p>L'arrivée d'internet a permis aux passionnés de se connecter et de partager leur passion. Les forums comme Sneakers.fr ont créé une véritable communauté. Les collaborations entre marques et artistes ont commencé à émerger, rendant certains modèles collector.</p>

<h2>Les années 2010 : L'explosion</h2>
<p>Le boom des réseaux sociaux, notamment Instagram, a propulsé la sneaker culture vers de nouveaux sommets. Les influenceurs et les célébrités ont amplifié le phénomène. Des marques de luxe comme Balenciaga et Louis Vuitton ont commencé à créer leurs propres sneakers, brouillant les frontières entre streetwear et haute couture.</p>

<h2>Aujourd'hui : Un marché mature</h2>
<p>En 2025, le marché de la revente de sneakers représente plusieurs milliards d'euros. Des plateformes comme StockX et Vinted ont facilité les transactions. La sneaker est devenue un véritable actif d'investissement pour certains collectionneurs.</p>

<h2>Conclusion</h2>
<p>La culture sneaker française continue d'évoluer, portée par une nouvelle génération de créateurs et de passionnés. Entre durabilité et innovation, les défis de demain promettent d'écrire de nouvelles pages de cette histoire fascinante.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
      category: "culture" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-01-20"),
      readTime: 10,
      tags: ["sneakers", "culture", "histoire", "france", "streetwear"],
      isFeatured: true,
      isPublished: true,
    },
    {
      title:
        "Le phénomène des collaborations : quand mode et musique fusionnent",
      slug: "phenomene-collaborations-mode-musique",
      excerpt:
        "Analyse des collaborations les plus marquantes entre artistes et marques de streetwear.",
      content: `<h2>Une tendance devenue incontournable</h2>
<p>Les collaborations entre artistes et marques de mode ne datent pas d'hier, mais elles ont pris une ampleur sans précédent ces dernières années. Du partenariat iconique entre Kanye West et Adidas à la collaboration Travis Scott x Nike, ces unions créatives redéfinissent le paysage du streetwear.</p>

<h2>Les collaborations qui ont marqué l'histoire</h2>
<h3>Pharrell Williams x Adidas</h3>
<p>Avec ses NMD Human Race aux couleurs vibrantes et ses messages positifs, Pharrell a su créer une ligne qui transcende les générations.</p>

<h3>Travis Scott x Nike</h3>
<p>Le rappeur texan a révolutionné le design des Air Jordan avec son fameux Swoosh inversé, créant une frénésie à chaque nouvelle release.</p>

<h3>A$AP Rocky x Under Armour</h3>
<p>Une collaboration inattendue qui a permis à Under Armour de gagner en crédibilité dans le monde du streetwear.</p>

<h2>L'impact économique</h2>
<p>Ces collaborations génèrent des millions d'euros et créent une économie parallèle de revente. Certaines paires atteignent des prix astronomiques sur le marché secondaire, parfois dix fois leur prix retail.</p>

<h2>L'avenir des collaborations</h2>
<p>Avec l'essor du métaverse et des NFTs, les collaborations prennent de nouvelles formes. Les marques explorent désormais les partenariats virtuels, ouvrant un nouveau chapitre dans cette histoire créative.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800",
      category: "culture" as const,
      authorName: "Marie Laurent",
      authorImage: "https://i.pravatar.cc/150?img=5",
      authorRole: "Culture Editor",
      publishedAt: new Date("2025-01-18"),
      readTime: 8,
      tags: ["collaborations", "musique", "mode", "streetwear", "artistes"],
      isFeatured: false,
      isPublished: true,
    },

    // STREETWEAR (2)
    {
      title:
        "Guide ultime : Comment construire une garde-robe streetwear minimaliste",
      slug: "guide-garde-robe-streetwear-minimaliste",
      excerpt:
        "Découvrez les pièces essentielles pour un style streetwear efficace sans encombrer votre dressing.",
      content: `<h2>Le minimalisme dans le streetwear</h2>
<p>Contrairement aux idées reçues, le streetwear ne rime pas forcément avec accumulation. Un dressing bien pensé avec des pièces de qualité peut vous offrir des possibilités infinies de looks.</p>

<h2>Les essentiels du haut</h2>
<ul>
<li><strong>T-shirts basiques</strong> : 3-4 t-shirts de qualité en blanc, noir et gris</li>
<li><strong>Hoodies</strong> : 2 sweats à capuche, un clair et un foncé</li>
<li><strong>Veste légère</strong> : Une coach jacket ou une bomber polyvalente</li>
<li><strong>Chemise oversized</strong> : Parfaite en layering ou portée seule</li>
</ul>

<h2>Les essentiels du bas</h2>
<ul>
<li><strong>Jeans</strong> : Un baggy et un slim/regular</li>
<li><strong>Cargo pants</strong> : Incontournable du style streetwear</li>
<li><strong>Jogging</strong> : Un jogging de qualité pour le confort</li>
</ul>

<h2>Les sneakers indispensables</h2>
<ul>
<li><strong>Une paire blanche</strong> : Air Force 1, Stan Smith ou Common Projects</li>
<li><strong>Une paire technique</strong> : New Balance 990 ou Nike Air Max</li>
<li><strong>Une paire statement</strong> : Jordan 1 ou Dunk pour les occasions</li>
</ul>

<h2>Les accessoires</h2>
<p>Une casquette, un bonnet pour l'hiver, et un sac crossbody complètent parfaitement ce wardrobe capsule.</p>

<h2>Conseils pour investir intelligemment</h2>
<p>Privilégiez la qualité à la quantité. Une pièce bien faite durera des années et traversera les tendances. N'hésitez pas à investir dans des basiques de qualité.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800",
      category: "streetwear" as const,
      authorName: "Lucas Moreau",
      authorImage: "https://i.pravatar.cc/150?img=33",
      authorRole: "Style Director",
      publishedAt: new Date("2025-01-15"),
      readTime: 7,
      tags: ["guide", "streetwear", "minimalisme", "mode", "conseils"],
      isFeatured: false,
      isPublished: true,
    },
    {
      title:
        "Carhartt WIP : L'histoire d'une marque devenue icône du streetwear",
      slug: "carhartt-wip-histoire-icone-streetwear",
      excerpt:
        "Comment une marque de vêtements de travail américaine est devenue un pilier de la mode urbaine européenne.",
      content: `<h2>Des origines ouvrières</h2>
<p>Fondée en 1889 à Detroit, Carhartt était à l'origine une marque de vêtements de travail robustes destinés aux ouvriers américains. Ses vestes, salopettes et accessoires étaient conçus pour durer dans les conditions les plus difficiles.</p>

<h2>La naissance de WIP</h2>
<p>En 1989, Edwin et Salomée Faeh découvrent Carhartt lors d'un voyage aux États-Unis et décident d'introduire la marque en Europe. Ils fondent Carhartt Work In Progress (WIP), une ligne adaptée au marché européen avec des coupes plus ajustées.</p>

<h2>L'adoption par la scène underground</h2>
<p>Dans les années 90, la scène skate, hip-hop et graffiti européenne s'empare de Carhartt WIP. La robustesse des vêtements, parfaite pour la pratique du skate, combinée à une esthétique authentique, séduit cette communauté.</p>

<h2>Les pièces iconiques</h2>
<h3>La veste Detroit</h3>
<p>Réinterprétation de la veste de travail originale, elle est devenue un classique intemporel.</p>

<h3>Le hoodie Chase</h3>
<p>Simple, sobre, avec le petit logo C brodé, c'est LE hoodie de référence.</p>

<h3>Le bonnet Watch Hat</h3>
<p>Probablement le bonnet le plus porté dans le monde du streetwear.</p>

<h2>Carhartt WIP aujourd'hui</h2>
<p>La marque continue d'innover tout en restant fidèle à ses valeurs d'authenticité et de qualité. Ses collaborations avec des artistes et designers maintiennent sa pertinence auprès des nouvelles générations.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      category: "streetwear" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-01-12"),
      readTime: 9,
      tags: ["carhartt", "wip", "streetwear", "histoire", "marque"],
      isFeatured: false,
      isPublished: true,
    },

    // MUSIQUE (2)
    {
      title: "Comment le rap français influence la mode streetwear en 2025",
      slug: "rap-francais-influence-mode-streetwear-2025",
      excerpt:
        "Du survêtement Lacoste aux collaborations avec les grandes maisons, le rap français façonne les tendances.",
      content: `<h2>Une relation historique</h2>
<p>Depuis les débuts du rap français dans les années 80-90, la mode a toujours été un élément central de la culture hip-hop hexagonale. De NTM à IAM, les rappeurs ont popularisé des marques et des styles qui ont marqué des générations.</p>

<h2>L'ère des survêtements</h2>
<p>Le survêtement Lacoste, porté par des artistes comme Booba dans ses débuts, est devenu un symbole du rap français des années 2000. Cette période a également vu l'essor de marques comme Sergio Tacchini et Fila.</p>

<h2>La nouvelle génération</h2>
<h3>PNL et l'esthétique sombre</h3>
<p>Le duo d'Ademo et N.O.S a imposé un style unique mêlant marques de luxe et pièces techniques, créant une esthétique mélancolique qui influence toute une génération.</p>

<h3>SCH et le luxe ostentatoire</h3>
<p>Le rappeur marseillais assume le port de grandes maisons de luxe, démontrant l'évolution du rapport entre rap et mode.</p>

<h3>Laylow et l'avant-garde</h3>
<p>Avec ses looks expérimentaux et ses références à la mode japonaise, Laylow pousse les limites du style dans le rap français.</p>

<h2>Les collaborations marquantes</h2>
<p>De plus en plus de rappeurs français créent leurs propres marques ou collaborent avec des enseignes établies. Cette tendance témoigne de l'influence grandissante du rap sur l'industrie de la mode.</p>

<h2>Impact sur les ventes</h2>
<p>Un simple post Instagram d'un rappeur populaire peut faire exploser les ventes d'une marque. Les enseignes l'ont bien compris et courtisent activement ces influenceurs d'un nouveau genre.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      category: "musique" as const,
      authorName: "Karim Benzema",
      authorImage: "https://i.pravatar.cc/150?img=59",
      authorRole: "Music Editor",
      publishedAt: new Date("2025-01-10"),
      readTime: 8,
      tags: ["rap", "france", "mode", "streetwear", "musique"],
      isFeatured: false,
      isPublished: true,
    },
    {
      title: "Les artistes à suivre en 2025 : notre sélection musicale",
      slug: "artistes-suivre-2025-selection-musicale",
      excerpt:
        "Découvrez les nouveaux talents qui vont marquer l'année musicale et influencer les tendances streetwear.",
      content: `<h2>La relève est là</h2>
<p>Chaque année, de nouveaux artistes émergent et bousculent les codes établis. En 2025, plusieurs talents prometteurs s'apprêtent à conquérir la scène française et internationale.</p>

<h2>Nos coups de cœur</h2>

<h3>Ziak</h3>
<p>Le rappeur parisien continue son ascension avec un style unique mêlant trap et sonorités africaines. Son influence sur la mode se fait déjà sentir avec des looks audacieux qui font des émules.</p>

<h3>Josman</h3>
<p>Déjà bien installé, Josman confirme son statut en 2025 avec des projets ambitieux. Son style vestimentaire décontracté mais recherché inspire une nouvelle esthétique streetwear.</p>

<h3>Lala &ce</h3>
<p>La rappeuse apporte une touche féminine unique à la scène française. Son style avant-gardiste et ses choix mode audacieux en font une artiste complète.</p>

<h3>Isha</h3>
<p>L'artiste belge poursuit son exploration sonore avec des projets toujours plus créatifs. Son approche minimaliste de la mode influence toute une génération.</p>

<h2>Les tendances musicales de 2025</h2>
<ul>
<li>Retour des sonorités années 2000</li>
<li>Fusion rap et électro de plus en plus présente</li>
<li>Collaborations internationales en hausse</li>
<li>Importance croissante du visuel dans les projets</li>
</ul>

<h2>Conclusion</h2>
<p>2025 s'annonce comme une année riche en découvertes musicales. Restez connectés sur Camino TV pour ne rien manquer !</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      category: "musique" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-01-08"),
      readTime: 6,
      tags: ["musique", "artistes", "2025", "rap", "découvertes"],
      isFeatured: false,
      isPublished: true,
    },

    // INTERVIEW (1)
    {
      title:
        "Interview exclusive : Dans les coulisses d'un créateur de sneakers français",
      slug: "interview-createur-sneakers-francais",
      excerpt:
        "Rencontre avec un designer qui fait ses preuves dans l'industrie internationale de la sneaker.",
      content: `<h2>Introduction</h2>
<p>Nous avons eu la chance de rencontrer Maxime Durand, designer sneaker français qui travaille aujourd'hui pour une grande marque internationale. Il nous raconte son parcours et partage ses conseils.</p>

<h2>Comment as-tu commencé dans le design sneaker ?</h2>
<p>"J'ai toujours été passionné par les sneakers. Gamin, je dessinais des chaussures dans mes cahiers au lieu de suivre les cours ! Après un BTS design produit, j'ai intégré une école spécialisée à Londres. C'est là que tout a vraiment commencé."</p>

<h2>Quel a été ton premier projet professionnel ?</h2>
<p>"Mon premier vrai projet était une collaboration entre une marque de skate et un artiste local. C'était petit en termes de production, mais ça m'a permis de comprendre tout le processus, de l'idée à la production."</p>

<h2>Comment se passe une journée type pour toi ?</h2>
<p>"Je commence souvent par de la veille : réseaux sociaux, blogs, magazines. L'inspiration peut venir de partout. Ensuite, je travaille sur les projets en cours, que ce soit du sketch, de la 3D ou des réunions avec les équipes techniques. Il y a beaucoup de tests et d'ajustements avant d'arriver au produit final."</p>

<h2>Quels conseils donnerais-tu aux jeunes qui veulent se lancer ?</h2>
<p>"Dessinez tous les jours, même juste 30 minutes. Construisez un portfolio solide. N'ayez pas peur de montrer votre travail et d'accepter les critiques. Et surtout, restez curieux : les meilleures idées viennent souvent d'univers qu'on n'attendait pas."</p>

<h2>Un projet dont tu es particulièrement fier ?</h2>
<p>"Sans pouvoir tout révéler, je travaille sur un projet qui sortira fin 2025. C'est une sneaker qui intègre des matériaux recyclés innovants. Allier performance, esthétique et durabilité, c'est le défi de notre génération de designers."</p>

<h2>Conclusion</h2>
<p>Merci à Maxime pour cet échange inspirant. La France regorge de talents dans l'industrie de la sneaker, et nous sommes fiers de mettre en lumière ces parcours.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=800",
      category: "interview" as const,
      authorName: "Emma Petit",
      authorImage: "https://i.pravatar.cc/150?img=23",
      authorRole: "Journalist",
      publishedAt: new Date("2025-01-05"),
      readTime: 11,
      tags: ["interview", "design", "sneakers", "carrière", "france"],
      isFeatured: false,
      isPublished: true,
    },

    // LIFESTYLE (1)
    {
      title: "Les meilleures boutiques streetwear à Paris en 2025",
      slug: "meilleures-boutiques-streetwear-paris-2025",
      excerpt:
        "Notre guide des adresses incontournables pour les passionnés de streetwear dans la capitale.",
      content: `<h2>Paris, capitale du streetwear européen</h2>
<p>Paris s'est imposée comme une destination incontournable pour les amateurs de streetwear. Entre concept stores prestigieux et boutiques indépendantes, la ville offre une diversité unique.</p>

<h2>Le Marais : le cœur du streetwear parisien</h2>

<h3>The Broken Arm</h3>
<p><strong>Adresse :</strong> 12 Rue Perrée, 75003</p>
<p>Ce concept store minimaliste propose une sélection pointue de marques avant-gardistes. Leur café intégré en fait un lieu de vie pour la communauté.</p>

<h3>Shinzo Paris</h3>
<p><strong>Adresse :</strong> 39 Rue Étienne Marcel, 75001</p>
<p>Spécialisé dans les collaborations rares et les éditions limitées, Shinzo est une institution pour les collectionneurs.</p>

<h2>Les incontournables</h2>

<h3>Opium Paris</h3>
<p><strong>Adresse :</strong> 6 Rue du Vertbois, 75003</p>
<p>Boutique historique qui a vu passer toutes les générations de passionnés. Leur sélection sneakers est impeccable.</p>

<h3>Citadium</h3>
<p><strong>Adresse :</strong> 56 Rue de Caumartin, 75009</p>
<p>Le grand magasin dédié au streetwear, parfait pour découvrir toutes les marques majeures en un seul lieu.</p>

<h2>Les nouveaux venus</h2>

<h3>Nous Paris</h3>
<p>Ce nouveau concept store mise sur les créateurs émergents et les marques responsables.</p>

<h3>L'Exception</h3>
<p>Avec sa sélection de créateurs français et européens, L'Exception défend une vision plus locale du streetwear.</p>

<h2>Conseils pratiques</h2>
<ul>
<li>Le samedi après-midi est le moment le plus animé</li>
<li>Suivez les comptes Instagram des boutiques pour les drops</li>
<li>N'hésitez pas à discuter avec les vendeurs, souvent passionnés</li>
</ul>`,
      imageUrl:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      category: "lifestyle" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-01-03"),
      readTime: 7,
      tags: ["paris", "boutiques", "streetwear", "shopping", "guide"],
      isFeatured: false,
      isPublished: true,
    },

    // TENDANCES (2)
    {
      title: "Les tendances sneakers du printemps 2025 : ce qui va cartonner",
      slug: "tendances-sneakers-printemps-2025",
      excerpt:
        "Analyse des silhouettes, coloris et marques qui domineront le marché sneakers ce printemps.",
      content: `<h2>Les silhouettes star du printemps</h2>

<h3>Le retour des runners techniques</h3>
<p>Après plusieurs saisons dominées par les modèles rétro, les runners techniques font leur grand retour. Les Asics Gel-Kayano, Salomon XT-6 et New Balance 1906 seront partout.</p>

<h3>Les low-top minimalistes</h3>
<p>Les silhouettes épurées comme la Veja V-10 ou les sneakers minimalistes type Common Projects continuent leur progression.</p>

<h2>Les coloris tendance</h2>
<ul>
<li><strong>Le beige/crème :</strong> Toujours présent, facile à porter</li>
<li><strong>Le vert olive :</strong> La couleur surprise de la saison</li>
<li><strong>Les pastels :</strong> Rose poudré et bleu ciel pour le printemps</li>
<li><strong>Le burgundy :</strong> Une alternative au noir classique</li>
</ul>

<h2>Les marques à suivre</h2>

<h3>Hoka</h3>
<p>La marque continue sa percée dans le lifestyle avec des collaborations de plus en plus créatives.</p>

<h3>Saucony</h3>
<p>Les Jazz et Shadow connaissent un regain d'intérêt, portés par des collaborations réussies.</p>

<h3>Mizuno</h3>
<p>La marque japonaise gagne du terrain auprès des connaisseurs avec ses silhouettes techniques vintage.</p>

<h2>Nos prédictions</h2>
<ol>
<li>La New Balance 1000 sera LA silhouette de la saison</li>
<li>Les collaborations avec des artistes asiatiques vont exploser</li>
<li>Le marché de la seconde main va continuer sa croissance</li>
</ol>

<h2>Comment anticiper les tendances</h2>
<p>Suivez les comptes Instagram des boutiques les plus pointues, observez ce que portent les artistes émergents, et n'ayez pas peur d'adopter une tendance avant qu'elle ne soit mainstream.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
      category: "tendances" as const,
      authorName: "Antoine Roux",
      authorImage: "https://i.pravatar.cc/150?img=52",
      authorRole: "Trend Analyst",
      publishedAt: new Date("2025-01-22"),
      readTime: 6,
      tags: ["tendances", "sneakers", "2025", "printemps", "mode"],
      isFeatured: true,
      isPublished: true,
    },
    {
      title: "Durable et stylé : le futur du streetwear éco-responsable",
      slug: "futur-streetwear-eco-responsable",
      excerpt:
        "Comment l'industrie streetwear se réinvente pour répondre aux enjeux environnementaux.",
      content: `<h2>Une prise de conscience nécessaire</h2>
<p>L'industrie de la mode est l'une des plus polluantes au monde. Le streetwear, avec ses drops fréquents et sa culture de la nouveauté, n'échappe pas à cette réalité. Mais les choses changent.</p>

<h2>Les marques pionnières</h2>

<h3>Veja</h3>
<p>La marque française est devenue le symbole du sneaker éco-responsable. Coton bio du Brésil, caoutchouc naturel d'Amazonie, cuir tanné sans chrome : chaque élément est pensé.</p>

<h3>Patagonia</h3>
<p>Avec son programme "Worn Wear" de seconde main et ses matériaux recyclés, Patagonia montre la voie depuis des années.</p>

<h3>Noah</h3>
<p>La marque new-yorkaise allie esthétique streetwear pointue et engagements environnementaux forts.</p>

<h2>Les initiatives des géants</h2>
<p>Nike avec sa ligne "Move to Zero", Adidas avec ses sneakers en plastique océanique, les grandes marques investissent massivement dans la durabilité. Même si les critiques de greenwashing existent, ces initiatives font bouger les lignes.</p>

<h2>Les matériaux d'avenir</h2>
<ul>
<li><strong>Le cuir de champignon (Mylo) :</strong> Utilisé par Stella McCartney et bientôt d'autres</li>
<li><strong>Le plastique recyclé océanique :</strong> De plus en plus courant</li>
<li><strong>Le coton régénératif :</strong> Qui restaure les sols</li>
<li><strong>Le Tencel :</strong> Fibre à base de bois certifié</li>
</ul>

<h2>Comment consommer mieux</h2>
<ol>
<li>Privilégier la qualité à la quantité</li>
<li>Acheter en seconde main (Vinted, Vestiaire Collective)</li>
<li>Réparer plutôt que jeter</li>
<li>Se renseigner sur les pratiques des marques</li>
</ol>

<h2>Conclusion</h2>
<p>Le streetwear éco-responsable n'est plus une niche. C'est une tendance de fond qui va redéfinir l'industrie dans les années à venir. Être stylé et responsable, c'est possible.</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800",
      category: "tendances" as const,
      authorName: "Claire Fontaine",
      authorImage: "https://i.pravatar.cc/150?img=44",
      authorRole: "Sustainability Editor",
      publishedAt: new Date("2025-01-01"),
      readTime: 9,
      tags: [
        "durabilité",
        "éco-responsable",
        "streetwear",
        "environnement",
        "tendances",
      ],
      isFeatured: false,
      isPublished: true,
    },

    // ========== ARTICLES CAMINOTV ==========

    // Communi-Tee Adidas x Camino TV
    {
      title:
        "Communi-Tee : Les gagnants du concours Adidas x Camino TV révélés !",
      slug: "communitee-gagnants-concours-adidas-camino-tv",
      excerpt:
        "Découvrez les 3 créateurs lauréats du concours Communi-Tee ! HTK, Garçons Jeunes et Donovann Bonnet ont conquis le jury avec leurs designs révolutionnaires de la veste Firebird.",
      content: `<h2>Le concours Communi-Tee</h2>
<p>Camino TV et Adidas ont lancé un concours de design unique : réimaginer l'iconique veste Firebird. Des centaines de créateurs ont participé, proposant leurs visions uniques de ce classique du streetwear.</p>

<h2>Le concept</h2>
<p>Les participants devaient créer un design représentant "un lieu qu'ils aiment, où ils se sentent chez eux", tout en conservant les éléments emblématiques de la Firebird : le logo trefoil et les trois bandes sur les manches.</p>

<h2>Les 3 gagnants</h2>

<h3>1er Prix - HTK</h3>
<p>Le grand gagnant remporte 2000€, un contrat de collaboration officiel avec Adidas, un pourcentage sur les ventes du produit designé, et un voyage au siège d'Adidas à Herzogenaurach en Allemagne pour la création des échantillons.</p>

<h3>2ème Prix - Garçons Jeunes</h3>
<p>Un design audacieux qui a su capturer l'esprit urbain français avec une touche de modernité.</p>

<h3>3ème Prix - Donovann Bonnet</h3>
<p>Une interprétation artistique qui mélange heritage Adidas et vision contemporaine.</p>

<h2>Et maintenant ?</h2>
<p>Les designs gagnants seront produits et disponibles prochainement. Restez connectés sur Camino TV pour ne pas manquer la sortie !</p>

<h2>Remerciements</h2>
<p>Un grand merci à tous les participants et à la communauté Camino pour avoir rendu ce projet possible. Longue vie à tous mennés !</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      category: "culture" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-01-30"),
      readTime: 5,
      tags: [
        "adidas",
        "communitee",
        "concours",
        "firebird",
        "collaboration",
        "camino",
      ],
      isFeatured: true,
      isPublished: true,
    },

    // Black Friday Carhartt & Nike
    {
      title:
        "Black Friday 2025 : Les meilleurs deals Carhartt et Nike sélectionnés par Camino",
      slug: "black-friday-2025-deals-carhartt-nike-camino",
      excerpt:
        "Le Black Friday a commencé ! On a sélectionné pour vous les meilleures promos sur Carhartt WIP et Nike. Vestes Detroit à 175€, joggings Solo Swoosh dès 54€...",
      content: `<h2>Le Black Friday Carhartt WIP</h2>
<p>Les vestes Detroit, pièces iconiques de Carhartt WIP, passent de 250€ à 175€ soit -30% ! Plusieurs coloris disponibles : Noire graphic, Gris en jean, Noire satinée, Marron satinée et Beige graphic.</p>

<h3>Les pants Carhartt en promo</h3>
<ul>
<li><strong>Le + Camo :</strong> 97€ au lieu de 139€</li>
<li><strong>Le pant Gris :</strong> 77€ au lieu de 109€</li>
<li><strong>Le pant Blanc :</strong> 62€ au lieu de 89€</li>
<li><strong>Le Rayé :</strong> 91€ au lieu de 129€</li>
<li><strong>Le + Workwear :</strong> 105€ au lieu de 149€</li>
</ul>

<h2>Nike : Jusqu'à -50% sur le site</h2>
<p>Nike frappe fort avec des réductions allant jusqu'à 50% ! On a repéré beaucoup de bons plans aux alentours de 60€.</p>

<h3>Le jogging Solo Swoosh en promo</h3>
<p>LE jogging gris de Nike, celui que tout le monde veut, est enfin en promo :</p>
<ul>
<li><strong>Coupe droite :</strong> 66€ au lieu de 110€</li>
<li><strong>Resserré :</strong> 54€ au lieu de 90€</li>
<li><strong>Le + quali :</strong> 69€ au lieu de 140€</li>
<li><strong>Rembourré :</strong> 60€ au lieu de 100€</li>
</ul>

<h2>Nos conseils</h2>
<p>Ces promos ne durent pas éternellement. Si une pièce vous plaît, n'hésitez pas trop longtemps ! Les tailles partent vite, surtout sur les classiques comme la Detroit Jacket.</p>

<h2>Liens affiliés</h2>
<p>Tous les liens sont disponibles sur notre compte Twitter @CaminoTV. En passant par nos liens, vous soutenez Camino TV tout en profitant des mêmes prix !</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800",
      category: "tendances" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-11-24"),
      readTime: 4,
      tags: ["black friday", "carhartt", "nike", "promo", "deals", "2025"],
      isFeatured: true,
      isPublished: true,
    },

    // Guide Nike Solo Swoosh
    {
      title:
        "Guide : Le jogging Nike Solo Swoosh, pourquoi tout le monde le veut",
      slug: "guide-jogging-nike-solo-swoosh",
      excerpt:
        "Le meilleur jogging gris de Nike selon la communauté. On vous explique pourquoi le Solo Swoosh est devenu un incontournable du streetwear.",
      content: `<h2>Un classique instantané</h2>
<p>Le jogging Nike Solo Swoosh est devenu en quelques années LA référence du jogging streetwear. Simple, épuré, avec juste le swoosh brodé : c'est la définition du less is more.</p>

<h2>Pourquoi ce jogging est-il si populaire ?</h2>

<h3>1. La coupe parfaite</h3>
<p>Nike propose plusieurs coupes pour satisfaire tous les styles :</p>
<ul>
<li><strong>Coupe droite :</strong> Le classique, légèrement ample, parfait pour un look décontracté</li>
<li><strong>Resserré :</strong> Plus ajusté en bas, moderne et clean</li>
<li><strong>Premium :</strong> Tissu plus épais, finitions supérieures</li>
<li><strong>Rembourré :</strong> Idéal pour l'hiver avec sa doublure</li>
</ul>

<h3>2. Le coloris gris parfait</h3>
<p>Le gris chiné du Solo Swoosh est universellement flatteur. Il se marie avec tout : sneakers blanches, noires, colorées... C'est la pièce passe-partout par excellence.</p>

<h3>3. La qualité Nike</h3>
<p>Contrairement aux joggings fast fashion, le Solo Swoosh tient dans le temps. Le tissu ne bouloche pas, les coutures sont solides, et il garde sa forme même après des dizaines de lavages.</p>

<h2>Comment le porter ?</h2>
<ul>
<li>Avec des Air Force 1 blanches pour un look classic</li>
<li>Avec des New Balance 550 pour le côté daddy shoes</li>
<li>Avec un hoodie oversize pour le confort ultime</li>
<li>Avec une veste technique pour le style gorpcore</li>
</ul>

<h2>Notre verdict</h2>
<p>Si vous n'avez qu'un seul jogging dans votre garde-robe, c'est celui-ci qu'il vous faut. Un investissement qui vaut le coup, surtout quand il est en promo !</p>`,
      imageUrl:
        "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800",
      category: "streetwear" as const,
      authorId: seanUser.id,
      authorName: "Sean",
      authorImage: "https://i.pravatar.cc/150?img=12",
      authorRole: "Fondateur",
      publishedAt: new Date("2025-11-20"),
      readTime: 5,
      tags: [
        "nike",
        "jogging",
        "solo swoosh",
        "guide",
        "streetwear",
        "essentiels",
      ],
      isFeatured: false,
      isPublished: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  console.log(`✅ Created ${blogPosts.length} blog posts`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n" + "=".repeat(50));
  console.log("✨ Seed completed successfully!");
  console.log("=".repeat(50));
  console.log("\n📊 Summary:");
  console.log(`   👤 Users: 3 (admin, sean, demo)`);
  console.log(`   💰 Deals: ${deals.length}`);
  console.log(`   📝 Blog Posts: ${blogPosts.length}`);
  console.log("\n🔐 Login credentials:");
  console.log("   Email: admin@camino-tv.com");
  console.log("   Email: sean@camino-tv.com");
  console.log("   Email: demo@camino-tv.com");
  console.log(`   Password: ${password}`);
  console.log("\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
