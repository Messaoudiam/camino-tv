"use client";

/**
 * Users Management Page
 * User administration and role management
 *
 * Refactoré avec TanStack Query
 */

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Trash2, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useUsers, useUpdateUser, useDeleteUser } from "@/lib/queries";

type UserType = {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: {
    favorites: number;
    sessions: number;
  };
};

export default function UsersPage() {
  // TanStack Query
  const { data: users = [], isLoading: loading } = useUsers();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();
  const { toast } = useToast();

  // Toggle user role
  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

    updateMutation.mutate(
      { id: userId, role: newRole as "USER" | "ADMIN" },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: `Rôle modifié en ${newRole}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  // Delete user
  const handleDelete = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;

    deleteMutation.mutate(userId, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion des Utilisateurs
        </h1>
        <p className="text-muted-foreground">
          Administrez les comptes utilisateurs et leurs permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs ({users.length})</CardTitle>
          <CardDescription>
            Visualisez et gérez les rôles des utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Email vérifié</TableHead>
                    <TableHead>Favoris</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Inscrit le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: UserType) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name || user.email}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">
                              {user.name || "Sans nom"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role === "ADMIN" ? (
                          <Badge className="bg-purple-500">
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <User className="mr-1 h-3 w-3" />
                            User
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <Badge variant="default" className="bg-green-500">
                            Vérifié
                          </Badge>
                        ) : (
                          <Badge variant="outline">Non vérifié</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {user._count.favorites}
                      </TableCell>
                      <TableCell className="text-center">
                        {user._count.sessions}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(user.createdAt), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleRole(user.id, user.role)
                              }
                            >
                              {user.role === "ADMIN"
                                ? "↓ Rétrograder en USER"
                                : "↑ Promouvoir en ADMIN"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
