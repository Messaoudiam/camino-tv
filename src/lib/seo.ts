import type { Metadata } from "next";

const baseUrl = "https://camino-tv.vercel.app";

/**
 * Configuration SEO centralisée pour Camino TV
 */
export const siteConfig = {
  name: "Camino TV",
  description:
    "Découvrez les meilleurs deals sneakers et streetwear en temps réel. Nike, Adidas, Jordan et bien plus encore. Plus de 100k passionnés nous font confiance.",
  url: baseUrl,
  ogImage: "/og-default.jpg",
  twitterHandle: "@CaminoTV",
  locale: "fr_FR",
};

/**
 * Génère les métadonnées par défaut du site
 */
export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Camino TV - We The Mouvement",
      template: "%s | Camino TV",
    },
    description: siteConfig.description,
    keywords: [
      "sneakers",
      "deals",
      "streetwear",
      "nike",
      "adidas",
      "jordan",
      "réductions",
      "bons plans",
      "mode urbaine",
      "camino tv",
    ],
    authors: [{ name: "Camino TV" }],
    creator: "Camino TV",
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: "Camino TV - We The Mouvement",
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: "Camino TV - Bons Plans Sneakers & Streetwear",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      creator: siteConfig.twitterHandle,
      title: "Camino TV - We The Mouvement",
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Génère les métadonnées pour une page spécifique
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${baseUrl}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

/**
 * Génère les métadonnées pour un article de blog
 */
export function generateBlogPostMetadata({
  title,
  description,
  slug,
  image,
  publishedAt,
  author,
  tags,
}: {
  title: string;
  description: string;
  slug: string;
  image: string;
  publishedAt: string;
  author: string;
  tags?: string[];
}): Metadata {
  const url = `${baseUrl}/blog/${slug}`;

  return {
    title,
    description,
    keywords: tags,
    authors: [{ name: author }],
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      publishedTime: publishedAt,
      authors: [author],
      tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Génère les métadonnées pour un deal
 */
export function generateDealMetadata({
  title,
  brand,
  currentPrice,
  originalPrice,
  discountPercentage,
  image,
  dealId,
}: {
  title: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  dealId: string;
}): Metadata {
  const url = `${baseUrl}/deals/${dealId}`;
  const description = `${brand} - ${title}. ${discountPercentage}% de réduction ! Prix: ${currentPrice}€ au lieu de ${originalPrice}€. Découvrez ce bon plan sur Camino TV.`;

  return {
    title: `${brand} - ${title} (-${discountPercentage}%)`,
    description,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: `${brand} - ${title}`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${brand} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.twitterHandle,
      title: `${brand} - ${title} (-${discountPercentage}%)`,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}
