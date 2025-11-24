import { Metadata } from "next";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { prisma } from "@/lib/db";

// Force dynamic rendering to avoid build-time database connection
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Camino TV | Actualité Streetwear & Culture",
  description:
    "Découvrez les dernières actualités streetwear, collaborations exclusives et tendances mode sur le blog Camino TV. Articles, interviews et analyses de la culture urbaine française.",
  keywords: [
    "blog streetwear",
    "actualité mode",
    "culture urbaine",
    "collaborations",
    "tendances",
    "sneakers",
    "fashion",
    "lifestyle",
  ],
  openGraph: {
    title: "Blog Camino TV | Actualité Streetwear & Culture",
    description:
      "Découvrez les dernières actualités streetwear, collaborations exclusives et tendances mode sur le blog Camino TV.",
    type: "website",
    locale: "fr_FR",
    url: "https://camino-tv.vercel.app/blog",
    siteName: "Camino TV",
    images: [
      {
        url: "https://camino-tv.vercel.app/blog-og.jpg",
        width: 1200,
        height: 630,
        alt: "Blog Camino TV - Actualité Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Camino TV | Actualité Streetwear & Culture",
    description:
      "Découvrez les dernières actualités streetwear, collaborations exclusives et tendances mode.",
    images: ["https://camino-tv.vercel.app/blog-og.jpg"],
    creator: "@CaminoTV",
  },
  alternates: {
    canonical: "https://camino-tv.vercel.app/blog",
  },
};

export default async function BlogPage() {
  // Fetch blog posts from database for JSON-LD
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });

  // JSON-LD Schema pour le blog
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Camino TV Blog",
    description: "Blog streetwear et culture urbaine par l'équipe Camino TV",
    url: "https://camino-tv.vercel.app/blog",
    publisher: {
      "@type": "Organization",
      name: "Camino TV",
      logo: {
        "@type": "ImageObject",
        url: "https://camino-tv.vercel.app/logo.png",
      },
    },
    inLanguage: "fr-FR",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://camino-tv.vercel.app/blog/${post.slug}`,
      datePublished: post.publishedAt.toISOString(),
      author: {
        "@type": "Person",
        name: post.authorName,
      },
      image: post.imageUrl.startsWith("/")
        ? `https://camino-tv.vercel.app${post.imageUrl}`
        : post.imageUrl,
      articleSection: post.category,
      keywords: post.tags.join(", "),
    })),
  };

  return <BlogPageClient jsonLd={jsonLd} />;
}
