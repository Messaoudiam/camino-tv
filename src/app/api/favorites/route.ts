import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { z } from 'zod'

/**
 * Favorites API Routes
 * GET /api/favorites - Get user's favorites (protected)
 * POST /api/favorites - Add to favorites (protected)
 * DELETE /api/favorites - Remove from favorites (protected)
 */

const favoriteSchema = z.object({
  dealId: z.string().cuid('ID de deal invalide'),
})

/**
 * GET /api/favorites
 * Protected endpoint - get authenticated user's favorites
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        deal: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      favorites: favorites.map((fav) => ({
        ...fav.deal,
        favoritedAt: fav.createdAt,
      })),
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des favoris' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/favorites
 * Protected endpoint - add deal to favorites
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { dealId } = favoriteSchema.parse(body)

    // Check if deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal non trouvé' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Deal déjà dans les favoris' },
        { status: 409 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        dealId,
      },
      include: {
        deal: true,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout aux favoris' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/favorites
 * Protected endpoint - remove deal from favorites
 * Uses query param: ?dealId=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const dealId = searchParams.get('dealId')

    if (!dealId) {
      return NextResponse.json(
        { error: 'dealId requis' },
        { status: 400 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_dealId: {
          userId: session.user.id,
          dealId,
        },
      },
    })

    return NextResponse.json({
      message: 'Retiré des favoris avec succès',
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Favori non trouvé' },
        { status: 404 }
      )
    }

    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Erreur lors du retrait des favoris' },
      { status: 500 }
    )
  }
}
