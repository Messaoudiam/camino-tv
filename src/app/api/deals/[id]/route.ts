import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Single Deal API Routes
 * GET /api/deals/:id - Get single deal (public)
 * PUT /api/deals/:id - Update deal (admin only)
 * DELETE /api/deals/:id - Delete deal (admin only)
 */

const dealUpdateSchema = z.object({
  title: z.string().min(10).optional(),
  brand: z.string().min(2).optional(),
  originalPrice: z.number().positive().optional(),
  currentPrice: z.number().positive().optional(),
  discountPercentage: z.number().min(1).max(99).optional(),
  imageUrl: z.string().url().optional(),
  category: z
    .enum(["sneakers", "streetwear", "accessories", "electronics", "lifestyle"])
    .optional(),
  affiliateUrl: z.string().url().optional(),
  promoCode: z.string().optional(),
  promoDescription: z.string().optional(),
  isNew: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

/**
 * GET /api/deals/:id
 * Public endpoint - get single deal by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal non trouvé" }, { status: 404 });
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du deal" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/deals/:id
 * Protected endpoint - update deal (admin only)
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

    // Validate request body
    const body = await request.json();
    const validatedData = dealUpdateSchema.parse(body);

    // Update deal
    const { id } = await params;
    const deal = await prisma.deal.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(deal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    // Handle deal not found (Prisma P2025 error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Deal non trouvé" }, { status: 404 });
    }

    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du deal" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/deals/:id
 * Protected endpoint - soft delete deal (admin only)
 * Sets isActive to false instead of deleting
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

    // Soft delete (set isActive to false)
    const { id } = await params;
    const deal = await prisma.deal.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Deal désactivé avec succès",
      deal,
    });
  } catch (error) {
    // Handle deal not found (Prisma P2025 error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Deal non trouvé" }, { status: 404 });
    }

    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du deal" },
      { status: 500 },
    );
  }
}
