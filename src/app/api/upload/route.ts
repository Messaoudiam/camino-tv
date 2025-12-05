import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import path from "path";

/**
 * POST /api/upload
 * Upload image file to Supabase Storage and return the public URL
 * Protected endpoint - admin only
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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 },
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Type de fichier non supporté. Utilisez JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Fichier trop volumineux. Taille maximale: 5MB." },
        { status: 400 },
      );
    }

    // Generate unique filename with path traversal protection
    const timestamp = Date.now();
    // SECURITY: Use path.basename to prevent path traversal attacks (e.g., "../../../secret.txt")
    const safeName = path.basename(file.name).replace(/\s/g, "-");
    // Additional sanitization: only allow alphanumeric, dash, underscore, and dot
    const sanitizedName = safeName.replace(/[^a-zA-Z0-9\-_.]/g, "");
    const filename = `deals/${timestamp}-${sanitizedName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage (using admin client to bypass RLS)
    const { data, error } = await supabaseAdmin.storage
      .from("camino-tv")
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: `Erreur lors de l'upload: ${error.message}` },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("camino-tv").getPublicUrl(filename);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      filename: data.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 },
    );
  }
}
