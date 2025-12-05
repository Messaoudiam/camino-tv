import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { supabaseAdmin } from "@/lib/supabase";
import path from "path";

/**
 * SECURITY: Validate file content by checking magic bytes (file signature)
 * This prevents attackers from uploading malicious files with spoofed MIME types
 * (e.g., an executable renamed to .jpg with fake Content-Type header)
 *
 * Magic bytes are the first few bytes of a file that identify its format:
 * - JPEG: FF D8 FF
 * - PNG: 89 50 4E 47 0D 0A 1A 0A
 * - WebP: 52 49 46 46 ... 57 45 42 50 (RIFF....WEBP)
 *
 * @returns The detected MIME type or null if the file is not a valid image
 */
function validateMagicBytes(buffer: Buffer): string | null {
  // Check JPEG (FF D8 FF)
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // Check PNG (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // Check WebP (RIFF....WEBP)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

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

    // SECURITY: Validate actual file content via magic bytes
    // This prevents attackers from uploading malicious files with spoofed MIME types
    const detectedType = validateMagicBytes(buffer);
    if (!detectedType) {
      return NextResponse.json(
        {
          error:
            "Fichier invalide. Le contenu ne correspond pas à une image valide (JPG, PNG ou WEBP).",
        },
        { status: 400 },
      );
    }

    // Use the detected type (more secure than client-provided type)
    const contentType = detectedType;

    // Upload to Supabase Storage (using admin client to bypass RLS)
    const { data, error } = await supabaseAdmin.storage
      .from("camino-tv")
      .upload(filename, buffer, {
        contentType, // Use validated type from magic bytes, not client-provided
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
