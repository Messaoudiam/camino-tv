'use client';

/**
 * Page d'article de blog individuel - Route dynamique [slug]
 * Design cohérent avec le reste du projet Camino TV
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Tag,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { mockBlogPosts, mockAuthors } from '@/data/mock';
import { TwitterEmbed } from '@/components/blog/TwitterEmbed';
import { TwitterEmbedSimple } from '@/components/blog/TwitterEmbedSimple';
import { useState, useEffect } from 'react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Trouver l'article par son slug
  const post = mockBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  // Ajouter des styles personnalisés pour Twitter
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .twitter-tweet {
        margin: 0 auto !important;
        border-radius: 12px !important;
        border: 1px solid hsl(var(--border)) !important;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
      }
      
      .twitter-tweet:hover {
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        transform: translateY(-1px);
        transition: all 0.2s ease;
      }
      
      /* Responsive */
      @media (max-width: 550px) {
        .twitter-tweet {
          width: 100% !important;
          max-width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const categoryColors = {
    culture: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    streetwear: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800',
    musique: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800',
    interview: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    lifestyle: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    tendances: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  };

  // Articles recommandés (autres articles du même auteur ou de la même catégorie)
  const recommendedPosts = mockBlogPosts
    .filter(p => p.id !== post.id && (p.author.id === post.author.id || p.category === post.category))
    .slice(0, 3);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Configuration du breadcrumb personnalisé
  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/blog', label: 'Blog' },
    { href: `/blog/${post.slug}`, label: post.title }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb et navigation */}
      <section className="py-6 bg-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumb customItems={breadcrumbItems} className="mb-4" />
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="hover:bg-brand-50 dark:hover:bg-brand-950/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Button>
            </Link>
            
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="hover:bg-brand-50 dark:hover:bg-brand-950/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              
              {shareMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-10">
                  <div className="p-2 space-y-1">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors w-full text-left"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Copier le lien
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article principal */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* En-tête de l'article */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={categoryColors[post.category]}>
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Badge>
              {post.isFeature && (
                <Badge variant="default" className="bg-brand-500 text-white">
                  À la une
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            {/* Métadonnées de l'auteur */}
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{post.author.name}</p>
                  <p className="text-sm">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min de lecture</span>
                </div>
              </div>
            </div>
          </header>

          {/* Image principale */}
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>

          {/* Contenu de l'article */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {post.slug === 'thread-20-createurs-francais-belges-suivre' ? (
              <div className="leading-relaxed text-foreground">
                <h1 className="text-3xl font-bold mt-8 mb-6 text-foreground">20 Créateurs FR/BE : Les pépites qui nous inspirent</h1>
                <p>L'équipe Camino TV a partagé sur X notre sélection de créateurs français et belges qui méritent toute votre attention. Voici notre thread développé avec nos coups de cœur.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Pourquoi ce thread ?</h2>
                <p>Dans un paysage créatif en constante évolution, il est essentiel de mettre en lumière les talents qui façonnent la culture francophone. Ces créateurs apportent une vision unique, mêlant héritage culturel et innovation contemporaine.</p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Le thread complet</h2>
                
                <TwitterEmbed tweetId="1948059197062398025" className="max-w-none" />
                
                <hr className="my-8 border-border" />
                
                <p className="italic text-muted-foreground">Suivez-nous sur @CaminoTV pour plus de découvertes culturelles et threads exclusifs !</p>
              </div>
            ) : (
              <div 
                className="leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br/>').replace(/## /g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground">').replace(/# /g, '<h1 class="text-3xl font-bold mt-8 mb-6 text-foreground">')
                }} 
              />
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1 mr-2">
                <Tag className="h-3 w-3" />
                Tags :
              </span>
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:border-brand-200 dark:hover:border-brand-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Articles recommandés */}
      {recommendedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-1 w-8 bg-brand-500 rounded-full" />
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Articles recommandés
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedPosts.map((recommendedPost) => (
                <Link key={recommendedPost.id} href={`/blog/${recommendedPost.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={recommendedPost.imageUrl}
                        alt={recommendedPost.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={categoryColors[recommendedPost.category]} >
                          {recommendedPost.category.charAt(0).toUpperCase() + recommendedPost.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {recommendedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {recommendedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {recommendedPost.author.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recommendedPost.readTime} min
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}