import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

/**
 * Single Blog Post API Routes
 * GET /api/blog/:id - Get single blog post (public)
 * PUT /api/blog/:id - Update blog post (admin only)
 * DELETE /api/blog/:id - Delete blog post (admin only)
 */

const blogPostUpdateSchema = z.object({
  title: z.string().min(10).max(200).optional(),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  excerpt: z.string().min(50).max(500).optional(),
  content: z.string().min(100).optional(),
  imageUrl: z.string().url().optional(),
  category: z
    .enum([
      "culture",
      "streetwear",
      "musique",
      "interview",
      "lifestyle",
      "tendances",
    ])
    .optional(),
  authorName: z.string().min(2).optional(),
  authorImage: z.string().url().optional(),
  authorRole: z.string().min(2).optional(),
  publishedAt: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  readTime: z.number().min(1).max(60).optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

/**
 * GET /api/blog/:id
 * Public endpoint - get single blog post by ID or slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Try to find by ID first, then by slug
    let post = await prisma.blogPost.findUnique({
      where: { id },
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

    // If not found by ID, try by slug
    if (!post) {
      post = await prisma.blogPost.findUnique({
        where: { slug: id },
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
    }

    if (!post) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 },
      );
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'article" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/blog/:id
 * Protected endpoint - update blog post (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const { id } = await params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 },
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = blogPostUpdateSchema.parse(body);

    // If slug is being changed, check uniqueness
    if (validatedData.slug && validatedData.slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Un article avec ce slug existe déjà" },
          { status: 409 },
        );
      }
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'article" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/blog/:id
 * Protected endpoint - soft delete blog post (admin only)
 * Sets isPublished to false instead of hard deleting
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const { id } = await params;

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Article non trouvé" },
        { status: 404 },
      );
    }

    // Soft delete (set isPublished to false)
    const post = await prisma.blogPost.update({
      where: { id },
      data: { isPublished: false },
    });

    return NextResponse.json({
      message: "Article dépublié avec succès",
      post,
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'article" },
      { status: 500 },
    );
  }
}
