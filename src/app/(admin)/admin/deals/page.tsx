"use client";

/**
 * Deals Management Page
 * CRUD interface for managing deals
 *
 * Refactoré avec TanStack Query
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
import { Plus, Loader2 } from "lucide-react";
import { DealsTable } from "@/components/admin/deals-table";
import { DealForm } from "@/components/admin/deal-form";
import { useToast } from "@/hooks/use-toast";
import {
  useDeals,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
} from "@/lib/queries";

// Type pour les deals admin (inclut isActive et _count comme retourné par l'API)
type AdminDeal = {
  id: string;
  title: string;
  brand: string;
  originalPrice: number;
  currentPrice: number;
  discountPercentage: number;
  category:
    | "sneakers"
    | "streetwear"
    | "accessories"
    | "electronics"
    | "lifestyle";
  imageUrl: string;
  affiliateUrl: string;
  promoCode: string | null;
  promoDescription: string | null;
  isActive: boolean;
  isNew: boolean;
  isLimited: boolean;
  createdAt: Date;
  _count: {
    favorites: number;
  };
};

export default function DealsPage() {
  // TanStack Query
  const { data, isLoading: loading } = useDeals({ all: true });
  // L'API retourne des deals avec isActive et _count
  const deals = (data?.deals ?? []) as unknown as AdminDeal[];

  const createMutation = useCreateDeal();
  const updateMutation = useUpdateDeal();
  const deleteMutation = useDeleteDeal();

  // UI State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<AdminDeal | null>(null);
  const { toast } = useToast();

  // Create deal
  const handleCreate = async (formData: any) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Le deal a été créé avec succès",
        });
        setDialogOpen(false);
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

  // Update deal
  const handleUpdate = async (formData: any) => {
    if (!editingDeal) return;

    updateMutation.mutate(
      { id: editingDeal.id, ...formData },
      {
        onSuccess: () => {
          toast({
            title: "Succès",
            description: "Le deal a été modifié avec succès",
          });
          setDialogOpen(false);
          setEditingDeal(null);
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

  // Delete deal
  const handleDelete = async (dealId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce deal ?")) return;

    deleteMutation.mutate(dealId, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "Le deal a été supprimé avec succès",
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

  // Open edit dialog
  const handleEdit = (deal: AdminDeal) => {
    setEditingDeal(deal);
    setDialogOpen(true);
  };

  // Open create dialog
  const handleOpenCreate = () => {
    setEditingDeal(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestion des Deals
          </h1>
          <p className="text-muted-foreground">
            Gérez les offres et promotions de votre plateforme
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un deal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des deals ({deals.length})</CardTitle>
          <CardDescription>
            Visualisez, modifiez et supprimez vos deals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <DealsTable
              deals={deals}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <DealForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={editingDeal ? handleUpdate : handleCreate}
        initialData={
          editingDeal
            ? {
                ...editingDeal,
                promoCode: editingDeal.promoCode || undefined,
                promoDescription: editingDeal.promoDescription || undefined,
              }
            : undefined
        }
        mode={editingDeal ? "edit" : "create"}
      />
    </div>
  );
}
