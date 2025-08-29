import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Tag,
  TrendingUp
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockBlogPosts } from '@/data/mock';
import { TwitterEmbed } from '@/components/blog/TwitterEmbed';
import { BlogInteractions } from '@/components/blog/BlogInteractions';
import { ShareButtons } from '@/components/blog/ShareButtons';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = mockBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: 'Article non trouvé | Camino TV',
      description: 'Cet article n\'existe pas ou a été supprimé.'
    };
  }

  const siteUrl = 'https://camino-tv.vercel.app';
  const articleUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.imageUrl.startsWith('/') ? `${siteUrl}${post.imageUrl}` : post.imageUrl;

  return {
    title: `${post.title} | Camino TV Blog`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author.name }],
    creator: post.author.name,
    category: post.category,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      locale: 'fr_FR',
      url: articleUrl,
      siteName: 'Camino TV',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      section: post.category,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      creator: '@CaminoTV',
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Trouver l'article par son slug
  const post = mockBlogPosts.find(p => p.slug === slug);
  
  if (!post) {
    notFound();
  }

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

  // Configuration du breadcrumb personnalisé
  const breadcrumbItems = [
    { href: '/', label: 'Accueil' },
    { href: '/blog', label: 'Blog' },
    { href: `/blog/${post.slug}`, label: post.title }
  ];

  // JSON-LD Schema pour SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl.startsWith('/') ? `https://camino-tv.vercel.app${post.imageUrl}` : post.imageUrl,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Camino TV',
      logo: {
        '@type': 'ImageObject',
        url: 'https://camino-tv.vercel.app/logo.png'
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://camino-tv.vercel.app/blog/${post.slug}`
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    wordCount: post.content.length,
    timeRequired: `PT${post.readTime}M`,
    inLanguage: 'fr-FR',
    isPartOf: {
      '@type': 'Blog',
      name: 'Camino TV Blog',
      url: 'https://camino-tv.vercel.app/blog'
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            
            <BlogInteractions post={post} />
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
            
            {/* Métadonnées */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime} min de lecture</span>
                </div>
              </div>
          </header>

          {/* Image principale */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-contain sm:object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>

          {/* Contenu de l'article - HTML sémantique direct */}
          <div className="leading-relaxed text-foreground space-y-6" style={{
            fontSize: 'clamp(1rem, 0.8rem + 0.4vw, 1.125rem)',
            lineHeight: 'clamp(1.6, 1.5 + 0.2vw, 1.8)'
          }}>
            {/* Contenu principal - HTML sémantique */}
            <div className="max-w-none">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: post.content
                }} 
              />
            </div>
            
            {/* Twitter Embed pour l'article Thread */}
            {post.slug === 'thread-20-createurs-francais-belges-suivre' && (
              <div className="my-8">
                <TwitterEmbed tweetId="1948059197062398025" className="max-w-none" />
              </div>
            )}
            
            {/* Call-to-action unifié pour TOUS les articles */}
            <div className="bg-gradient-to-r from-brand-500/10 via-brand-600/5 to-brand-500/10 rounded-xl p-6 border border-brand-200/50 dark:border-brand-800/30 mt-8">
              <p className="text-center text-sm text-muted-foreground">
                <strong className="text-foreground">Vous avez aimé cet article ?</strong> Suivez-nous sur nos réseaux sociaux pour ne rien rater de l'actualité streetwear !
              </p>
            </div>
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

          {/* Système de partage social moderne */}
          <div className="border-t border-border pt-8 mt-8" role="region" aria-label="Partage social">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Partager cet article
              </div>
              <ShareButtons post={post} />
            </div>
          </div>
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
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-500/20 cursor-pointer">
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