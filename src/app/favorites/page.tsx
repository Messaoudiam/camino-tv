import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import FavoritesPageClient from "./FavoritesPageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Mes Favoris - Bons Plans Sauvegardés",
  description:
    "Retrouvez tous vos bons plans sneakers et streetwear favoris. Gérez votre liste de deals préférés et ne ratez plus jamais les meilleures offres.",
  path: "/favorites",
  noIndex: true, // Page personnelle, pas d'indexation
});

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
