import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const baseUrl = "https://camino-tv.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/legal`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/cgu`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Articles de blog depuis la base de données
  let blogPosts: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        isFeatured: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: post.isFeatured ? 0.9 : 0.8,
    }));
  } catch {
    // En cas d'erreur DB (build sans connexion), retourner un sitemap vide pour les posts
    console.error("Sitemap: Could not fetch blog posts from database");
  }

  // Deals depuis la base de données
  let dealPages: MetadataRoute.Sitemap = [];
  try {
    const deals = await prisma.deal.findMany({
      where: { isActive: true },
      select: {
        id: true,
        updatedAt: true,
        isNew: true,
        isLimited: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Ajouter les pages de deals individuelles si elles existent
    dealPages = deals.map((deal) => ({
      url: `${baseUrl}/deals/${deal.id}`,
      lastModified: deal.updatedAt,
      changeFrequency: "weekly" as const,
      priority: deal.isNew || deal.isLimited ? 0.8 : 0.7,
    }));
  } catch {
    console.error("Sitemap: Could not fetch deals from database");
  }

  return [...staticPages, ...blogPosts, ...dealPages];
}
