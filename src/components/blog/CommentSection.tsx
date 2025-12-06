"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  MessageSquare,
  Send,
  Trash2,
  Loader2,
  LogIn,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface CommentUser {
  id: string;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: CommentUser;
}

interface CommentSectionProps {
  blogPostId: string;
}

export function CommentSection({ blogPostId }: CommentSectionProps) {
  const { user, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`/api/comments?blogPostId=${blogPostId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [blogPostId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          blogPostId,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de l'ajout du commentaire");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (commentId: string) => {
    setDeletingId(commentId);
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur de connexion");
    } finally {
      setDeletingId(null);
    }
  };

  const canDelete = (comment: Comment) => {
    if (!user) return false;
    return comment.user.id === user.id || isAdmin;
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: fr,
    });
  };

  // Loading skeleton while auth is loading
  if (!mounted || authLoading) {
    return (
      <section className="py-8 border-t border-border">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5" />
          <h2 className="text-xl font-bold">Commentaires</h2>
        </div>
        <div className="space-y-4">
          <div className="h-24 bg-muted animate-pulse rounded-lg" />
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-brand-600" />
        <h2 className="text-xl font-bold">
          Commentaires ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <span className="text-brand-600 dark:text-brand-400 font-medium text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <span>Commentez en tant que <strong>{user?.name || user?.email}</strong></span>
              {isAdmin && (
                <Badge variant="outline" className="text-xs border-brand-200 text-brand-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre avis sur cet article..."
              className="min-h-[100px] resize-none"
              maxLength={2000}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/2000 caractères
              </span>
              <Button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="bg-brand-600 hover:bg-brand-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publier
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Card className="mb-8 bg-muted/50">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              Connectez-vous pour laisser un commentaire
            </p>
            <Link href="/login">
              <Button variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                Se connecter
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <Card className="bg-muted/30">
          <CardContent className="py-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="group">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 dark:text-brand-400 font-medium">
                      {comment.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {comment.user.name || "Utilisateur"}
                      </span>
                      {comment.user.role === "ADMIN" && (
                        <Badge variant="outline" className="text-xs border-brand-200 text-brand-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>

                  {/* Delete button with confirmation dialog */}
                  {canDelete(comment) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          disabled={deletingId === comment.id}
                        >
                          {deletingId === comment.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le commentaire</AlertDialogTitle>
                          <AlertDialogDescription>
                            Voulez-vous vraiment supprimer ce commentaire ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(comment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
