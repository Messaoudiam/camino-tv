import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";

/**
 * Deals API Routes
 * GET /api/deals - List all active deals (public)
 * POST /api/deals - Create new deal (admin only)
 */

// Validation schema for creating/updating deals
const dealSchema = z.object({
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
  brand: z.string().min(2, "La marque doit contenir au moins 2 caractères"),
  originalPrice: z.number().positive("Le prix original doit être positif"),
  currentPrice: z.number().positive("Le prix actuel doit être positif"),
  discountPercentage: z
    .number()
    .min(1)
    .max(99, "La réduction doit être entre 1 et 99%"),
  imageUrl: z.string().url("URL d'image invalide"),
  category: z.enum([
    "sneakers",
    "streetwear",
    "accessories",
    "electronics",
    "lifestyle",
  ]),
  affiliateUrl: z.string().url("URL d'affiliation invalide"),
  promoCode: z.string().optional(),
  promoDescription: z.string().optional(),
  isNew: z.boolean().optional().default(false),
  isLimited: z.boolean().optional().default(false),
});

/**
 * GET /api/deals
 * Public endpoint - returns all active deals
 * Supports query params: category, limit, offset, all (for admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const all = searchParams.get("all") === "true"; // Admin: include inactive deals

    const whereClause = {
      ...(!all && { isActive: true }),
      ...(category && { category: category as any }),
    };

    const deals = await prisma.deal.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });

    const total = await prisma.deal.count({
      where: whereClause,
    });

    return NextResponse.json({
      deals,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + deals.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des deals" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/deals
 * Protected endpoint - create new deal (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check (not relying on middleware alone)
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    // Validate request body
    const body = await request.json();
    const validatedData = dealSchema.parse(body);

    // Create deal
    const deal = await prisma.deal.create({
      data: validatedData,
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du deal" },
      { status: 500 },
    );
  }
}
