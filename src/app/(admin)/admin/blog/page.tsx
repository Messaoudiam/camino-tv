"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Eye,
  Calendar,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { BlogForm } from "@/components/admin/blog-form";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  authorId: string | null;
  authorName: string;
  authorImage: string;
  authorRole: string;
  publishedAt: string;
  readTime: number;
  views: number;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Blog Management Page
 * Full CRUD with Prisma BlogPost model
 */
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryColors: Record<string, string> = {
    culture: "bg-purple-500/10 text-purple-600 border-purple-200",
    streetwear: "bg-blue-500/10 text-blue-600 border-blue-200",
    musique: "bg-green-500/10 text-green-600 border-green-200",
    interview: "bg-orange-500/10 text-orange-600 border-orange-200",
    lifestyle: "bg-pink-500/10 text-pink-600 border-pink-200",
    tendances: "bg-red-500/10 text-red-600 border-red-200",
  };

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/blog?all=true");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreate = () => {
    setSelectedPost(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/blog/${postToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      await fetchPosts();
    } catch (error: any) {
      alert(error.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      const url =
        formMode === "create" ? "/api/blog" : `/api/blog/${selectedPost?.id}`;
      const method = formMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error ||
            error.details?.[0]?.message ||
            "Erreur lors de la sauvegarde",
        );
      }

      setIsFormOpen(false);
      await fetchPosts();
    } catch (error: any) {
      alert(error.message || "Erreur lors de la sauvegarde");
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion du Blog</h1>
          <p className="text-muted-foreground">
            Gérez les articles et contenus de votre blog
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPosts} disabled={isLoading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel article
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles de blog ({posts.length})</CardTitle>
          <CardDescription>
            Tous les articles du blog (publiés et brouillons)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Aucun article pour le moment
              </p>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Créer le premier article
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Vues</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Publié le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-20 overflow-hidden rounded">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="max-w-[300px]">
                            <div className="font-medium truncate">
                              {post.title}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {post.excerpt}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            categoryColors[post.category] || "bg-gray-500/10"
                          }
                        >
                          {post.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image
                              src={post.authorImage}
                              alt={post.authorName}
                              fill
                              className="object-cover"
                              sizes="24px"
                            />
                          </div>
                          <div className="text-sm">{post.authorName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <Eye className="h-4 w-4" />
                          {post.views?.toLocaleString() || "0"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={post.isPublished ? "default" : "secondary"}
                        >
                          {post.isPublished ? "Publié" : "Brouillon"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(post.publishedAt), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(post)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blog Form Dialog */}
      <BlogForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedPost}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Dépublier cet article ?</AlertDialogTitle>
            <AlertDialogDescription>
              L&apos;article &quot;{postToDelete?.title}&quot; sera dépublié et
              n&apos;apparaîtra plus sur le site. Vous pourrez le republier plus
              tard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Dépublier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
