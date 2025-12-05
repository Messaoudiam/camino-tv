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
import { Plus, Loader2 } from "lucide-react";
import { DealsTable } from "@/components/admin/deals-table";
import { DealForm } from "@/components/admin/deal-form";
import { useToast } from "@/hooks/use-toast";

type Deal = {
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

/**
 * Deals Management Page
 * CRUD interface for managing deals
 */
export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { toast } = useToast();

  // Fetch deals
  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/deals?all=true");
      const data = await response.json();
      setDeals(data.deals || []);
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible de charger les deals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Create deal
  const handleCreate = async (data: any) => {
    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la création");
      }

      toast({
        title: "Succès",
        description: "Le deal a été créé avec succès",
      });

      setDialogOpen(false);
      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Update deal
  const handleUpdate = async (data: any) => {
    if (!editingDeal) return;

    try {
      const response = await fetch(`/api/deals/${editingDeal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la modification");
      }

      toast({
        title: "Succès",
        description: "Le deal a été modifié avec succès",
      });

      setDialogOpen(false);
      setEditingDeal(null);
      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete deal
  const handleDelete = async (dealId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce deal ?")) return;

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la suppression");
      }

      toast({
        title: "Succès",
        description: "Le deal a été supprimé avec succès",
      });

      fetchDeals();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Open edit dialog
  const handleEdit = (deal: Deal) => {
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
