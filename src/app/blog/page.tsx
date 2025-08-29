import { Metadata } from 'next';
import { BlogPageClient } from '@/components/blog/BlogPageClient';
import { mockBlogPosts } from '@/data/mock';

export const metadata: Metadata = {
  title: 'Blog Camino TV | Actualité Streetwear & Culture',
  description: 'Découvrez les dernières actualités streetwear, collaborations exclusives et tendances mode sur le blog Camino TV. Articles, interviews et analyses de la culture urbaine française.',
  keywords: [
    'blog streetwear',
    'actualité mode',
    'culture urbaine',
    'collaborations',
    'tendances',
    'sneakers',
    'fashion',
    'lifestyle'
  ],
  openGraph: {
    title: 'Blog Camino TV | Actualité Streetwear & Culture',
    description: 'Découvrez les dernières actualités streetwear, collaborations exclusives et tendances mode sur le blog Camino TV.',
    type: 'website',
    locale: 'fr_FR',
    url: 'https://camino.tv/blog',
    siteName: 'Camino TV',
    images: [
      {
        url: 'https://camino.tv/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Camino TV - Actualité Streetwear',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Camino TV | Actualité Streetwear & Culture',
    description: 'Découvrez les dernières actualités streetwear, collaborations exclusives et tendances mode.',
    images: ['https://camino.tv/blog-og.jpg'],
    creator: '@CaminoTV',
  },
  alternates: {
    canonical: 'https://camino.tv/blog',
  },
};

export default function BlogPage() {
  // JSON-LD Schema pour le blog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Camino TV Blog',
    description: 'Blog streetwear et culture urbaine par l\'équipe Camino TV',
    url: 'https://camino.tv/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Camino TV',
      logo: {
        '@type': 'ImageObject',
        url: 'https://camino.tv/logo.png'
      }
    },
    inLanguage: 'fr-FR',
    blogPost: mockBlogPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://camino.tv/blog/${post.slug}`,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name
      },
      image: post.imageUrl.startsWith('/') ? `https://camino.tv${post.imageUrl}` : post.imageUrl,
      articleSection: post.category,
      keywords: post.tags.join(', ')
    }))
  };


  return <BlogPageClient jsonLd={jsonLd} />;
}