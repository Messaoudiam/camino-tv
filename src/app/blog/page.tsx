'use client';

/**
 * Page Blog Camino TV - Articles et contenu éditorial
 * Design cohérent avec la page principale et l'identité Camino TV
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/ui/page-header';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Calendar,
  Clock,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockBlogPosts, blogCategories, mockAuthors } from '@/data/mock';
import { BlogCategory } from '@/types';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'all'>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string | 'all'>('all');

  // Filtrage des articles
  const filteredPosts = useMemo(() => {
    return mockBlogPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      const matchesAuthor = selectedAuthor === 'all' || post.author.id === selectedAuthor;
      
      return matchesSearch && matchesCategory && matchesAuthor;
    });
  }, [searchQuery, selectedCategory, selectedAuthor]);

  // Stats pour l'affichage
  const stats = {
    totalPosts: mockBlogPosts.length,
    categories: blogCategories.length,
    authors: mockAuthors.length,
    avgReadTime: Math.round(mockBlogPosts.reduce((acc, post) => acc + post.readTime, 0) / mockBlogPosts.length)
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageHeader
        badge={{
          icon: BookOpen,
          text: 'Blog Camino TV'
        }}
        title="Culture & Streetwear"
        description="Plongez dans l'univers streetwear avec nos articles, interviews exclusives et guides tendances. Découvrez les coulisses de la Culture avec l'équipe Camino TV."
      />

      {/* Filtres et recherche */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            
            {/* Barre de recherche */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un article..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Filtres :
              </span>
              
              {/* Catégories */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs"
                >
                  Toutes
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id as BlogCategory)}
                    className="text-xs"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Nombre de résultats */}
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Articles */}
            <div className="lg:col-span-3">
              <BlogGrid 
                posts={filteredPosts}
                loading={false}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              {/* Équipe d'auteurs */}
              <Card variant="feature" size="lg" padding="lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-brand-500" />
                    Notre équipe
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-3">
                    {mockAuthors.map((author) => (
                      <div 
                        key={author.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedAuthor === author.id ? 'bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedAuthor(selectedAuthor === author.id ? 'all' : author.id)}
                      >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{author.name}</p>
                          <p className="text-xs text-muted-foreground">{author.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setSelectedAuthor('all')}
                  >
                    Voir tous les auteurs
                  </Button>
                </CardContent>
              </Card>

              {/* Articles populaires */}
              <Card variant="feature" size="lg" padding="lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-brand-500" />
                    Articles populaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-4">
                    {mockBlogPosts
                      .filter(post => post.isFeature || post.readTime > 6)
                      .slice(0, 3)
                      .map((post, index) => (
                        <div 
                          key={post.id}
                          className="flex gap-3 group cursor-pointer"
                        >
                          <div className="flex items-center justify-center w-6 h-6 bg-brand-500 text-white rounded text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime} min
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags populaires */}
              <Card variant="feature" size="lg" padding="lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5 text-brand-500" />
                    Tags populaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="flex flex-wrap gap-2">
                    {/* Extraire les tags les plus populaires */}
                    {Array.from(
                      new Set(mockBlogPosts.flatMap(post => post.tags))
                    ).slice(0, 10).map((tag) => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="text-xs cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:border-brand-200 dark:hover:border-brand-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}