import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { z } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Single User API Routes
 * PUT /api/users/:id - Update user role (admin only)
 * DELETE /api/users/:id - Delete user (admin only)
 */

const userUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]),
});

/**
 * PUT /api/users/:id
 * Protected endpoint - update user role (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const { role } = userUpdateSchema.parse(body);

    // Update user role
    const { id } = await params;
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides", details: error.issues },
        { status: 400 },
      );
    }

    // Handle user not found (Prisma P2025 error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/users/:id
 * Protected endpoint - delete user (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // CRITICAL SECURITY: Multi-layered auth check (not relying on middleware alone)
    const authResult = await requireAdmin(request.headers);
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    // Prevent self-deletion
    const { id } = await params;
    if (id === authResult.session.user.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 },
      );
    }

    // Delete user (cascade deletes favorites and sessions)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    // Handle user not found (Prisma P2025 error)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 },
    );
  }
}
