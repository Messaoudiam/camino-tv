"use client";

/**
 * User Messages Page
 * View contact message history and admin replies
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  ArrowLeft,
  ChevronRight,
  Inbox,
  Loader2,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useUserMessages, type UserMessage } from "@/lib/queries";
import { useAuth } from "@/lib/auth-client";
import Link from "next/link";

const categoryLabels: Record<string, string> = {
  general: "Question générale",
  partnership: "Partenariat",
  collaboration: "Collaboration",
  technical: "Support technique",
  press: "Relations presse",
  other: "Autre",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: "Envoyé", color: "bg-blue-500" },
  READ: { label: "Lu", color: "bg-yellow-500" },
  REPLIED: { label: "Répondu", color: "bg-green-500" },
  ARCHIVED: { label: "Traité", color: "bg-gray-500" },
};

export default function UserMessagesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(
    null
  );

  const { data, isLoading } = useUserMessages();

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login?redirect=/messages");
    return null;
  }

  const messages = data?.messages || [];
  const stats = data?.stats || { total: 0, unread: 0 };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Mes messages</h1>
        <p className="text-muted-foreground">
          Historique de vos échanges avec l&apos;équipe Camino TV
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total des messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nouvelles réponses
            </CardTitle>
            <Mail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.unread}
            </div>
            {stats.unread > 0 && (
              <p className="text-xs text-green-600 font-medium">
                Réponses non lues
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* New Message Button */}
      <div className="mb-6">
        <Button asChild>
          <Link href="/contact">
            <Send className="h-4 w-4 mr-2" />
            Nouveau message
          </Link>
        </Button>
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des messages</CardTitle>
          <CardDescription>
            {messages.length} message{messages.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun message envoyé</p>
              <Button asChild className="mt-4">
                <Link href="/contact">Contacter l&apos;équipe</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    message.status === "REPLIED" && message.replies.length > 0
                      ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
                      : ""
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={statusLabels[message.status].color}>
                          {statusLabels[message.status].label}
                        </Badge>
                        <Badge variant="outline">
                          {categoryLabels[message.category] || message.category}
                        </Badge>
                        {message.replies.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          >
                            {message.replies.length} réponse
                            {message.replies.length > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold truncate">
                        {message.subject}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Envoyé le{" "}
                        {format(
                          new Date(message.createdAt),
                          "dd MMMM yyyy à HH:mm",
                          { locale: fr }
                        )}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge
                className={statusLabels[selectedMessage?.status || "NEW"].color}
              >
                {statusLabels[selectedMessage?.status || "NEW"].label}
              </Badge>
              {selectedMessage?.subject}
            </DialogTitle>
            <DialogDescription>
              Catégorie :{" "}
              {categoryLabels[selectedMessage?.category || ""] ||
                selectedMessage?.category}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Original Message */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Envoyé le{" "}
                {selectedMessage &&
                  format(
                    new Date(selectedMessage.createdAt),
                    "dd MMMM yyyy à HH:mm",
                    { locale: fr }
                  )}
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Votre message :</p>
                <p className="whitespace-pre-wrap text-sm">
                  {selectedMessage?.message}
                </p>
              </div>
            </div>

            {/* Replies */}
            {selectedMessage?.replies && selectedMessage.replies.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Réponses de l&apos;équipe
                </h4>
                {selectedMessage.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-900"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {reply.admin.name?.charAt(0) || "A"}
                        </span>
                      </div>
                      <span className="text-sm font-medium">
                        {reply.admin.name || "Admin"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(reply.createdAt), "dd MMM à HH:mm", {
                          locale: fr,
                        })}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* No Reply Yet */}
            {(!selectedMessage?.replies ||
              selectedMessage.replies.length === 0) && (
              <div className="text-center py-4 text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Pas encore de réponse. Notre équipe vous répondra bientôt.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
