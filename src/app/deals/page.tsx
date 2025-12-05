import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import DealsPageClient from "./DealsPageClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Bons Plans Sneakers & Streetwear",
  description:
    "Découvrez notre sélection de bons plans sneakers et streetwear. Nike, Adidas, Jordan et plus encore. Promotions exclusives et codes promo vérifiés par Camino TV.",
  path: "/deals",
  image: "/og-deals.jpg",
});

export default function DealsPage() {
  return <DealsPageClient />;
}
