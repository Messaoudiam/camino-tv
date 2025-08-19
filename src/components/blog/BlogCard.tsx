'use client';

/**
 * BlogCard - Composant pour afficher un article de blog
 * Design cohérent avec les DealCard existantes
 */

import { BlogCardProps } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function BlogCard({ post, variant = 'default', onClick, className }: BlogCardProps) {
  const categoryColors = {
    culture: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    streetwear: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800',
    musique: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    interview: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    lifestyle: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    tendances: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (variant === 'featured') {
    return (
      <Card 
        variant="feature" 
        size="lg" 
        padding="none"
        className={cn(
          'group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-elevation-3 hover:scale-[1.02]',
          className
        )}
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
        </div>

        {/* Contenu en dessous de l'image */}
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-brand-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          
          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="font-medium text-foreground">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card 
        variant="interactive" 
        size="sm" 
        padding="sm"
        className={cn('group', className)}
        onClick={onClick}
      >
        <div className="flex gap-4">
          <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="80px"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            
            <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-brand-600 transition-colors mb-1">
              {post.title}
            </h4>
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {post.author.name}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {post.readTime} min
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Variant par défaut
  return (
    <Card 
      variant="interactive" 
      size="lg" 
      padding="none"
      className={cn('group overflow-hidden', className)}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
      </div>

      {/* Contenu */}
      <CardContent className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex items-center justify-between w-full">
          {/* Auteur et métadonnées */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{post.author.name}</p>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min
                </span>
              </div>
            </div>
          </div>

          {/* Bouton de lecture */}
          <Button
            variant="ghost"
            size="sm"
            className="group-hover:bg-brand-500 group-hover:text-white transition-colors"
          >
            Lire
            <ArrowRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}