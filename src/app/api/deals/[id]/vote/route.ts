import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";
import { z } from "zod";

/**
 * Deal Vote API
 * POST /api/deals/[id]/vote - Vote for a deal (hot/cold)
 * GET /api/deals/[id]/vote - Get user's vote for a deal
 * DELETE /api/deals/[id]/vote - Remove vote
 */

const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

type RouteParams = { params: Promise<{ id: string }> };

/**
 * GET - Get current user's vote for this deal
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: dealId } = await params;

    // Check auth (optional - can view temperature without auth)
    const authResult = await requireAuth(request.headers);

    // Get deal with temperature
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: {
        id: true,
        temperature: true,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal non trouvé" }, { status: 404 });
    }

    // If authenticated, get user's vote
    let userVote: number | null = null;
    if (!authResult.error && authResult.session) {
      const vote = await prisma.dealVote.findUnique({
        where: {
          userId_dealId: {
            userId: authResult.session.user.id,
            dealId,
          },
        },
      });
      userVote = vote?.value ?? null;
    }

    return NextResponse.json({
      temperature: deal.temperature,
      userVote,
    });
  } catch (error) {
    console.error("Error getting vote:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du vote" },
      { status: 500 }
    );
  }
}

/**
 * POST - Vote for a deal
 * Body: { value: 1 | -1 }
 * 1 = hot (upvote), -1 = cold (downvote)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: dealId } = await params;

    // Auth required
    const authResult = await requireAuth(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.session!.user.id;
    const body = await request.json();
    const { value } = voteSchema.parse(body);

    // Check if deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal non trouvé" }, { status: 404 });
    }

    // Check for existing vote
    const existingVote = await prisma.dealVote.findUnique({
      where: {
        userId_dealId: {
          userId,
          dealId,
        },
      },
    });

    let temperatureDelta = value;

    if (existingVote) {
      if (existingVote.value === value) {
        // Same vote - no change needed
        return NextResponse.json({
          temperature: deal.temperature,
          userVote: value,
          message: "Vote déjà enregistré",
        });
      }

      // Different vote - update it
      // Delta is 2x because we're reversing the previous vote
      temperatureDelta = value * 2;

      await prisma.dealVote.update({
        where: {
          userId_dealId: {
            userId,
            dealId,
          },
        },
        data: { value },
      });
    } else {
      // New vote
      await prisma.dealVote.create({
        data: {
          userId,
          dealId,
          value,
        },
      });
    }

    // Update deal temperature
    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        temperature: {
          increment: temperatureDelta,
        },
      },
    });

    return NextResponse.json({
      temperature: updatedDeal.temperature,
      userVote: value,
      message: existingVote ? "Vote modifié" : "Vote enregistré",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Valeur de vote invalide (doit être 1 ou -1)" },
        { status: 400 }
      );
    }

    console.error("Error voting:", error);
    return NextResponse.json(
      { error: "Erreur lors du vote" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Remove vote
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: dealId } = await params;

    // Auth required
    const authResult = await requireAuth(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const userId = authResult.session!.user.id;

    // Find existing vote
    const existingVote = await prisma.dealVote.findUnique({
      where: {
        userId_dealId: {
          userId,
          dealId,
        },
      },
    });

    if (!existingVote) {
      return NextResponse.json(
        { error: "Aucun vote à supprimer" },
        { status: 404 }
      );
    }

    // Delete vote and update temperature
    await prisma.dealVote.delete({
      where: {
        userId_dealId: {
          userId,
          dealId,
        },
      },
    });

    const updatedDeal = await prisma.deal.update({
      where: { id: dealId },
      data: {
        temperature: {
          decrement: existingVote.value,
        },
      },
    });

    return NextResponse.json({
      temperature: updatedDeal.temperature,
      userVote: null,
      message: "Vote supprimé",
    });
  } catch (error) {
    console.error("Error removing vote:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du vote" },
      { status: 500 }
    );
  }
}
