"use client";

/**
 * Newsletter Management Page
 * View and manage newsletter subscribers
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
import { Label } from "@/components/ui/label";
import {
  Clock,
  Download,
  Loader2,
  Mail,
  MailX,
  Search,
  Send,
  Trash2,
  Users,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import {
  useNewsletterSubscribers,
  useDeleteNewsletterSubscriber,
  useSendNewsletter,
  type NewsletterSubscriber,
} from "@/lib/queries";

export default function NewsletterAdminPage() {
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "ACTIVE" | "UNSUBSCRIBED"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sendDialogOpen, setSendDialogOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  // TanStack Query
  const { data, isLoading } = useNewsletterSubscribers(
    statusFilter === "ALL" ? undefined : statusFilter,
  );
  const deleteMutation = useDeleteNewsletterSubscriber();
  const sendMutation = useSendNewsletter();
  const { toast } = useToast();

  const subscribers = data?.subscribers || [];
  const stats = data?.stats || {
    total: 0,
    pending: 0,
    active: 0,
    unsubscribed: 0,
  };

  // Filter by search query
  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Delete subscriber
  const handleDelete = async (email: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'abonné ${email} ?`)) {
      return;
    }

    deleteMutation.mutate(email, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Abonné supprimé avec succès",
        });
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

  // Export CSV
  const handleExportCSV = () => {
    const statusParam = statusFilter === "ALL" ? "" : `&status=${statusFilter}`;
    window.open(`/api/admin/newsletter?format=csv${statusParam}`, "_blank");
  };

  // Send newsletter
  const handleSendNewsletter = () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Erreur",
        description: "Le sujet et le contenu sont requis",
        variant: "destructive",
      });
      return;
    }

    sendMutation.mutate(
      { subject, content },
      {
        onSuccess: (data: { message: string }) => {
          toast({
            title: "Succès",
            description: data.message,
          });
          setSendDialogOpen(false);
          setSubject("");
          setContent("");
        },
        onError: (error: Error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-muted-foreground">
            Gérez les abonnés à votre newsletter
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={stats.active === 0}>
                <Send className="mr-2 h-4 w-4" />
                Envoyer une newsletter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Envoyer une newsletter</DialogTitle>
                <DialogDescription>
                  Cette newsletter sera envoyée à {stats.active} abonné
                  {stats.active > 1 ? "s" : ""} actif
                  {stats.active > 1 ? "s" : ""}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input
                    id="subject"
                    placeholder="Ex: Les meilleurs deals de la semaine"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Contenu (HTML supporté)</Label>
                  <Textarea
                    id="content"
                    placeholder="Écrivez le contenu de votre newsletter..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSendDialogOpen(false)}
                  disabled={sendMutation.isPending}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleSendNewsletter}
                  disabled={
                    sendMutation.isPending || !subject.trim() || !content.trim()
                  }
                >
                  {sendMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total abonnés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.pending / stats.total) * 100)}% du total`
                : "0%"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Mail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.active / stats.total) * 100)}% du total`
                : "0%"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Désinscrits</CardTitle>
            <MailX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.unsubscribed}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? `${Math.round((stats.unsubscribed / stats.total) * 100)}% du total`
                : "0%"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des abonnés</CardTitle>
          <CardDescription>
            {filteredSubscribers.length} abonné
            {filteredSubscribers.length > 1 ? "s" : ""} affiché
            {filteredSubscribers.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(
                  value as "ALL" | "PENDING" | "ACTIVE" | "UNSUBSCRIBED",
                )
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="ACTIVE">Actifs</SelectItem>
                <SelectItem value="UNSUBSCRIBED">Désinscrits</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun abonné trouvé</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Mis à jour</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map(
                    (subscriber: NewsletterSubscriber) => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium">
                          {subscriber.email}
                        </TableCell>
                        <TableCell>
                          {subscriber.status === "ACTIVE" ? (
                            <Badge className="bg-green-500">Actif</Badge>
                          ) : subscriber.status === "PENDING" ? (
                            <Badge className="bg-yellow-500">En attente</Badge>
                          ) : (
                            <Badge variant="secondary">Désinscrit</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(subscriber.subscribedAt),
                            "dd MMM yyyy",
                            { locale: fr },
                          )}
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(subscriber.updatedAt),
                            "dd MMM yyyy",
                            { locale: fr },
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(subscriber.email)}
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
