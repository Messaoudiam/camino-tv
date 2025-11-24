import { z } from "zod";

// Schéma de base pour les barres de recherche
const baseSearchSchema = z
  .string()
  .max(100, "Recherche trop longue (max 100 caractères)")
  .regex(/^[a-zA-Z0-9\s\-À-ÿ]*$/, "Caractères spéciaux non autorisés");

// Schéma de validation pour les barres de recherche
export const searchQuerySchema = baseSearchSchema.transform((val: string) =>
  val.trim(),
);

// Schéma spécifique pour la recherche de produits/deals
export const productSearchSchema = baseSearchSchema
  .refine(
    (val: string) => !/<[^>]*>/.test(val),
    "HTML non autorisé dans la recherche",
  )
  .transform((val: string) => val.trim());

// Schéma pour la recherche d'articles de blog
export const blogSearchSchema = baseSearchSchema
  .refine(
    (val: string) => !/(javascript:|data:|vbscript:)/i.test(val),
    "Contenu dangereux détecté",
  )
  .transform((val: string) => val.trim());

// Schéma pour la recherche dans les favoris
export const favoritesSearchSchema = baseSearchSchema.transform((val: string) =>
  val.trim(),
);

// Types inférés
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type ProductSearch = z.infer<typeof productSearchSchema>;
export type BlogSearch = z.infer<typeof blogSearchSchema>;
export type FavoritesSearch = z.infer<typeof favoritesSearchSchema>;

// Helper pour valider et nettoyer les recherches
export function validateSearch(
  query: string,
  schema = searchQuerySchema,
): string {
  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // En cas d'erreur, retourner une chaîne vide plutôt que lever l'erreur
      // pour éviter de casser l'UX des barres de recherche
      return "";
    }
    return "";
  }
}

// Helper pour vérifier si une recherche est valide
export function isValidSearch(
  query: string,
  schema = searchQuerySchema,
): boolean {
  try {
    schema.parse(query);
    return true;
  } catch {
    return false;
  }
}
