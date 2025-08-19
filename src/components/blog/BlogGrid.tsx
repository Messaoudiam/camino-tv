'use client';

/**
 * BlogGrid - Grille d'articles de blog avec layout responsive
 * Design cohérent avec le DealGrid existant
 */

import { BlogGridProps } from '@/types';
import { BlogCard } from './BlogCard';
import { cn } from '@/lib/utils';

export function BlogGrid({ posts, loading = false, className }: BlogGridProps) {
  if (loading) {
    return (
      <div className={cn('grid gap-6', className)}>
        {/* Skeleton loading pour maintenir le layout */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted animate-pulse rounded-xl h-96"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <svg
            className="h-16 w-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
          <p className="text-sm">Essayez de modifier vos filtres ou revenez plus tard.</p>
        </div>
      </div>
    );
  }

  // Séparer l'article featured s'il y en a un
  const featuredPost = posts.find(post => post.isFeature);
  const regularPosts = posts.filter(post => !post.isFeature);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Article à la une */}
      {featuredPost && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-brand-500 rounded-full" />
            <h2 className="text-lg font-bold text-foreground">À la une</h2>
          </div>
          <BlogCard
            post={featuredPost}
            variant="featured"
            onClick={() => {
              window.location.href = `/blog/${featuredPost.slug}`;
            }}
          />
        </div>
      )}

      {/* Grille d'articles réguliers */}
      {regularPosts.length > 0 && (
        <div>
          {featuredPost && (
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-lg font-bold text-foreground">Derniers articles</h2>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                variant="default"
                onClick={() => {
                  window.location.href = `/blog/${post.slug}`;
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}