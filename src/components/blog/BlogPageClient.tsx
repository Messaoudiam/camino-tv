"use client";

/**
 * Composant client pour la page blog avec interactivité
 * Fetches data from /api/blog (database)
 */

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/page-header";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { validateSearch, blogSearchSchema } from "@/lib/validations/search";
import {
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  Tag,
  Loader2,
} from "lucide-react";
import { blogCategories } from "@/data/mock";
import { BlogCategory, BlogPost } from "@/types";

interface BlogPageClientProps {
  jsonLd: any;
}

// Transform DB post format to frontend BlogPost format
function transformPost(dbPost: any): BlogPost {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    excerpt: dbPost.excerpt,
    content: dbPost.content,
    imageUrl: dbPost.imageUrl,
    category: dbPost.category,
    publishedAt: dbPost.publishedAt,
    readTime: dbPost.readTime,
    tags: dbPost.tags || [],
    isFeatured: dbPost.isFeatured,
    author: {
      id: dbPost.authorId || dbPost.id,
      name: dbPost.authorName,
      avatar: dbPost.authorImage,
      role: dbPost.authorRole,
    },
  };
}

export function BlogPageClient({ jsonLd }: BlogPageClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    BlogCategory | "all"
  >("all");
  const [selectedAuthor, setSelectedAuthor] = useState<string | "all">("all");

  // Fetch blog posts from API
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch("/api/blog");
        const data = await response.json();
        const transformedPosts = (data.posts || []).map(transformPost);
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Gestion sécurisée de la recherche avec Zod
  const handleSearchChange = (value: string) => {
    const validatedQuery = validateSearch(value, blogSearchSchema);
    setSearchQuery(validatedQuery);
  };

  // Filtrage des articles
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesAuthor =
        selectedAuthor === "all" || post.author.id === selectedAuthor;

      return matchesSearch && matchesCategory && matchesAuthor;
    });
  }, [posts, searchQuery, selectedCategory, selectedAuthor]);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <PageHeader
        badge={{
          icon: BookOpen,
          text: "Blog Camino TV",
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  maxLength={100}
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
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="text-xs"
                >
                  Toutes
                </Button>
                {blogCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setSelectedCategory(category.id as BlogCategory)
                    }
                    className="text-xs"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Nombre de résultats */}
            <div className="text-sm text-muted-foreground">
              {filteredPosts.length} article
              {filteredPosts.length !== 1 ? "s" : ""}
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
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Aucun article trouvé
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Essayez d'ajuster vos critères de recherche ou explorez
                    d'autres catégories
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedAuthor("all");
                    }}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Réinitialiser les filtres
                  </Button>
                </div>
              ) : (
                <BlogGrid posts={filteredPosts} />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Stats du blog */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Articles
                    </span>
                    <Badge variant="secondary">{posts.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Catégories
                    </span>
                    <Badge variant="secondary">{blogCategories.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Auteurs
                    </span>
                    <Badge variant="secondary">
                      {new Set(posts.map((p) => p.author.name)).size}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Catégories populaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Catégories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {blogCategories.map((category) => {
                      const count = posts.filter(
                        (p) => p.category === category.id,
                      ).length;
                      return (
                        <button
                          key={category.id}
                          onClick={() =>
                            setSelectedCategory(category.id as BlogCategory)
                          }
                          className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors hover:bg-muted ${
                            selectedCategory === category.id
                              ? "bg-muted text-brand-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span>{category.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
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
