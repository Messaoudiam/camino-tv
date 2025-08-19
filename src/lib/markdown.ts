/**
 * Utilitaire pour convertir le Markdown en HTML
 * Utilisé dans les articles de blog de Camino TV
 */

export function markdownToHtml(content: string): string {
  return content
    // Headings
    .replace(/### /g, '<h3 class="text-xl font-bold mt-6 mb-3 text-foreground">')
    .replace(/## /g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">')
    .replace(/# /g, '<h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">')
    
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]*)\)/g, '<img src="$2" alt="$1" class="w-full h-auto rounded-lg my-6 shadow-sm" />')
    
    // Bold text
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 my-1">• $1</li>')
    
    // Paragraphs: double line breaks become paragraph breaks
    .replace(/\n\n/g, '</p><p class="mb-4 text-foreground leading-relaxed">')
    
    // Single line breaks become br tags
    .replace(/\n/g, '<br/>')
    
    // Wrap everything in paragraph tags
    .replace(/^/, '<p class="mb-4 text-foreground leading-relaxed">')
    .replace(/$/, '</p>');
}