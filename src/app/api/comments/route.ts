import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

// Validation schema for creating a comment
const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(2000, "Le commentaire est trop long (max 2000 caractères)"),
  blogPostId: z.string().min(1, "L'ID de l'article est requis"),
});

/**
 * GET /api/comments?blogPostId=xxx
 * Get all comments for a blog post (public)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogPostId = searchParams.get("blogPostId");

    if (!blogPostId) {
      return NextResponse.json(
        { error: "blogPostId is required" },
        { status: 400 },
      );
    }

    // Verify blog post exists
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });

    if (!blogPost) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Get comments with user info
    const comments = await prisma.comment.findMany({
      where: { blogPostId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/comments
 * Create a new comment (authenticated users only)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour commenter" },
        { status: 401 },
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createCommentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { content, blogPostId } = validation.data;

    // Verify blog post exists
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });

    if (!blogPost) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        blogPostId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
