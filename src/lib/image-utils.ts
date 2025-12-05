/**
 * Utilitaires pour l'optimisation des images
 * Génération de blur placeholders et data URLs
 */

/**
 * Génère un placeholder blur en base64 pour next/image
 * Version statique - pour les images dont on connaît les couleurs dominantes
 */
export function getStaticBlurPlaceholder(color: string = "#e5e5e5"): string {
  // SVG minimaliste avec la couleur dominante
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><rect fill="${color}" width="8" height="8"/></svg>`;
  const base64 = typeof window === "undefined"
    ? Buffer.from(svg).toString("base64")
    : btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Placeholders prédéfinis pour les catégories de contenu
 */
export const blurPlaceholders = {
  // Pour les deals/produits - gris neutre
  product: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IGZpbGw9IiNlNWU1ZTUiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiLz48L3N2Zz4=",

  // Pour les avatars - teinte chair/gris
  avatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IGZpbGw9IiNkNGQ0ZDQiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiLz48L3N2Zz4=",

  // Pour les articles de blog - teinte chaude
  blog: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IGZpbGw9IiNmNWY1ZjQiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiLz48L3N2Zz4=",

  // Pour les équipes/personnes
  team: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IGZpbGw9IiNmYWZhZmEiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiLz48L3N2Zz4=",

  // Pour les marques (sneakers, streetwear)
  brand: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4IDgiPjxyZWN0IGZpbGw9IiNmMGYwZjAiIHdpZHRoPSI4IiBoZWlnaHQ9IjgiLz48L3N2Zz4=",
} as const;

/**
 * Obtient le placeholder approprié selon le type de contenu
 */
export function getBlurPlaceholder(type: keyof typeof blurPlaceholders = "product"): string {
  return blurPlaceholders[type];
}

/**
 * Configuration pour next/image avec blur placeholder
 */
export function getImageProps(type: keyof typeof blurPlaceholders = "product") {
  return {
    placeholder: "blur" as const,
    blurDataURL: blurPlaceholders[type],
  };
}

/**
 * Shimmer effect pour un loading plus dynamique (alternative au blur)
 * Génère un SVG animé avec effet shimmer
 */
export function getShimmerPlaceholder(w: number, h: number): string {
  const shimmer = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer)}`;
}
