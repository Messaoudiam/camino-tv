import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

/**
 * Blog API Routes
 * GET /api/blog - List all published blog posts (public)
 * POST /api/blog - Create new blog post (admin only)
 */

// Validation schema for creating blog posts
const blogPostSchema = z.object({
  title: z
    .string()
    .min(10, "Le titre doit contenir au moins 10 caractères")
    .max(200),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules avec des tirets (ex: mon-article)",
    ),
  excerpt: z
    .string()
    .min(50, "L'extrait doit contenir au moins 50 caractères")
    .max(500),
  content: z
    .string()
    .min(100, "Le contenu doit contenir au moins 100 caractères"),
  imageUrl: z.string().url("URL d'image invalide"),
  category: z.enum([
    "culture",
    "streetwear",
    "musique",
    "interview",
    "lifestyle",
    "tendances",
  ]),
  authorName: z.string().min(2, "Le nom de l'auteur est requis"),
  authorImage: z.string().url("URL d'avatar invalide"),
  authorRole: z.string().min(2, "Le rôle de l'auteur est requis"),
  publishedAt: z.string().transform((val) => new Date(val)),
  readTime: z.number().min(1).max(60),
  tags: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
});

/**
 * GET /api/blog
 * Public endpoint - returns all published blog posts
 * Supports query params: category, limit, offset, featured, all (admin only - requires auth)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100); // SECURITY: Max 100 items
    const offset = parseInt(searchParams.get("offset") || "0");
    const featured = searchParams.get("featured") === "true";
    const allParam = searchParams.get("all") === "true";

    // SECURITY: ?all=true requires admin authentication to see unpublished posts
    let showAll = false;
    if (allParam) {
      const authResult = await requireAdmin(request.headers);
      if (!authResult.error) {
        showAll = true;
      }
      // If not admin, silently ignore ?all=true and show only published posts
    }

    // SECURITY: Validate category against allowed enum values
    const validCategories = [
      "culture",
      "streetwear",
      "musique",
      "interview",
      "lifestyle",
      "tendances",
    ];
    const validCategory =
      category && validCategories.includes(category) ? category : null;

    const posts = await prisma.blogPost.findMany({
      where: {
        ...(showAll ? {} : { isPublished: true }),
        ...(validCategory && { category: validCategory as any }),
        ...(featured && { isFeatured: true }),
      },
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
      skip: offset,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const total = await prisma.blogPost.count({
      where: {
        ...(showAll ? {} : { isPublished: true }),
        ...(validCategory && { category: validCategory as any }),
        ...(featured && { isFeatured: true }),
      },
    });

    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + posts.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des articles" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/blog
 * Protected endpoint - create new blog post (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = blogPostSchema.parse(body);

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: "Un article avec ce slug existe déjà" },
        { status: 409 },
      );
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: validatedData,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'article" },
      { status: 500 },
    );
  }
}
