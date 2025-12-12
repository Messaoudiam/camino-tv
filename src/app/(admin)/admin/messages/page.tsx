"use client";

/**
 * Contact Messages Management Page
 * View and manage contact form submissions with reply functionality
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Archive,
  CheckCircle,
  Eye,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  MessageSquare,
  Reply,
  Search,
  Send,
  Trash2,
  User,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  useContactMessages,
  useUpdateMessageStatus,
  useDeleteMessage,
  useReplyToMessage,
  type ContactMessage,
} from "@/lib/queries";

const categoryLabels: Record<string, string> = {
  general: "Question générale",
  partnership: "Partenariat",
  collaboration: "Collaboration",
  technical: "Support technique",
  press: "Relations presse",
  other: "Autre",
};

const statusLabels: Record<string, { label: string; color: string }> = {
  NEW: { label: "Nouveau", color: "bg-blue-500" },
  READ: { label: "Lu", color: "bg-yellow-500" },
  REPLIED: { label: "Répondu", color: "bg-green-500" },
  ARCHIVED: { label: "Archivé", color: "bg-gray-500" },
};

export default function MessagesAdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // TanStack Query
  const { data, isLoading } = useContactMessages(
    statusFilter === "ALL" ? undefined : statusFilter
  );
  const updateStatusMutation = useUpdateMessageStatus();
  const deleteMutation = useDeleteMessage();
  const replyMutation = useReplyToMessage();
  const { toast } = useToast();

  const messages = data?.messages || [];
  const stats = data?.stats || {
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  };

  // Filter by search query
  const filteredMessages = messages.filter(
    (msg) =>
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle status update
  const handleStatusUpdate = (id: string, status: ContactMessage["status"]) => {
    updateStatusMutation.mutate(
      { id, status },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Statut mis à jour",
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  // Handle reply
  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return;

    setIsReplying(true);
    replyMutation.mutate(
      { messageId: selectedMessage.id, content: replyContent },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Réponse envoyée",
          });
          setReplyContent("");
          // Update selected message with new reply
          setSelectedMessage(null);
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        },
        onSettled: () => {
          setIsReplying(false);
        },
      }
    );
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      return;
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Message supprimé",
        });
        setSelectedMessage(null);
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Open message detail and mark as read
  const handleOpenMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyContent("");
    if (message.status === "NEW") {
      handleStatusUpdate(message.id, "READ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Messages de contact
          </h1>
          <p className="text-muted-foreground">
            Gérez les messages reçus via le formulaire de contact
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
            <Mail className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            {stats.new > 0 && (
              <p className="text-xs text-blue-600 font-medium">
                À traiter en priorité
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lus</CardTitle>
            <MailOpen className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.read}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Répondus</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.replied}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Archivés</CardTitle>
            <Archive className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.archived}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des messages</CardTitle>
          <CardDescription>
            {filteredMessages.length} message
            {filteredMessages.length > 1 ? "s" : ""} affiché
            {filteredMessages.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou sujet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="NEW">Nouveaux</SelectItem>
                <SelectItem value="READ">Lus</SelectItem>
                <SelectItem value="REPLIED">Répondus</SelectItem>
                <SelectItem value="ARCHIVED">Archivés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun message trouvé</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expéditeur</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message: ContactMessage) => (
                    <TableRow
                      key={message.id}
                      className={
                        message.status === "NEW"
                          ? "bg-blue-50 dark:bg-blue-950/20"
                          : ""
                      }
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {message.userId && (
                            <span title="Utilisateur inscrit">
                              <User className="h-4 w-4 text-primary" />
                            </span>
                          )}
                          <div>
                            <p
                              className={`font-medium ${message.status === "NEW" ? "font-bold" : ""}`}
                            >
                              {message.firstName} {message.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {message.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <p
                            className={`truncate max-w-[200px] ${message.status === "NEW" ? "font-semibold" : ""}`}
                          >
                            {message.subject}
                          </p>
                          {message.replies && message.replies.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {message.replies.length} rép.
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {categoryLabels[message.category] || message.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusLabels[message.status].color}>
                          {statusLabels[message.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(message.createdAt), "dd MMM yyyy", {
                          locale: fr,
                        })}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), "HH:mm")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenMessage(message)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Reply className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(message.id, "READ")
                                }
                              >
                                <MailOpen className="mr-2 h-4 w-4" />
                                Marquer comme lu
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(message.id, "REPLIED")
                                }
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marquer comme répondu
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusUpdate(message.id, "ARCHIVED")
                                }
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Archiver
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(message.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Badge
                className={statusLabels[selectedMessage?.status || "NEW"].color}
              >
                {statusLabels[selectedMessage?.status || "NEW"].label}
              </Badge>
              {selectedMessage?.subject}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              De {selectedMessage?.firstName} {selectedMessage?.lastName} (
              {selectedMessage?.email})
              {selectedMessage?.userId && (
                <Badge variant="secondary" className="ml-2">
                  <User className="h-3 w-3 mr-1" />
                  Utilisateur inscrit
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                Catégorie:{" "}
                {categoryLabels[selectedMessage?.category || ""] ||
                  selectedMessage?.category}
              </span>
              <span>
                Reçu le{" "}
                {selectedMessage &&
                  format(
                    new Date(selectedMessage.createdAt),
                    "dd MMMM yyyy à HH:mm",
                    {
                      locale: fr,
                    }
                  )}
              </span>
            </div>

            {/* Original Message */}
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                Message original :
              </p>
              <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>

            {/* Previous Replies */}
            {selectedMessage?.replies && selectedMessage.replies.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Historique des réponses ({selectedMessage.replies.length})
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

            {/* Reply Form */}
            {selectedMessage?.userId && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-sm flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Répondre au message
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Cette réponse sera visible par l&apos;utilisateur dans son espace &quot;Mes messages&quot;
                </p>
                <Textarea
                  placeholder="Écrivez votre réponse..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                  className="mb-3"
                />
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim() || isReplying}
                >
                  {isReplying ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  Envoyer la réponse
                </Button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    `mailto:${selectedMessage?.email}?subject=Re: ${encodeURIComponent(selectedMessage?.subject || "")}`,
                    "_blank"
                  )
                }
              >
                <Mail className="mr-2 h-4 w-4" />
                Répondre par email
              </Button>
              {selectedMessage?.status !== "REPLIED" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedMessage) {
                      handleStatusUpdate(selectedMessage.id, "REPLIED");
                    }
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marquer comme répondu
                </Button>
              )}
              {selectedMessage?.status !== "ARCHIVED" && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedMessage) {
                      handleStatusUpdate(selectedMessage.id, "ARCHIVED");
                      setSelectedMessage(null);
                    }
                  }}
                >
                  <Archive className="mr-2 h-4 w-4" />
                  Archiver
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
