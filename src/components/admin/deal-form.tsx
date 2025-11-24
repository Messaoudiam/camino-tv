"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";

const dealFormSchema = z.object({
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
  brand: z.string().min(2, "La marque doit contenir au moins 2 caractères"),
  originalPrice: z
    .union([z.number().nonnegative(), z.nan()])
    .transform((val) => (isNaN(val) ? 0 : val)),
  currentPrice: z.number().positive("Le prix actuel doit être positif"),
  discountPercentage: z
    .union([z.number().min(0).max(99), z.nan()])
    .transform((val) => (isNaN(val) ? 0 : val)),
  imageUrl: z.string().min(1, "Une image est requise"),
  category: z.enum([
    "sneakers",
    "streetwear",
    "accessories",
    "electronics",
    "lifestyle",
  ]),
  affiliateUrl: z.string().url("URL d'affiliation invalide"),
  promoCode: z.string().optional(),
  promoDescription: z.string().optional(),
  isNew: z.boolean().optional(),
  isLimited: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

type DealFormValues = z.infer<typeof dealFormSchema>;

interface DealFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DealFormValues) => Promise<void>;
  initialData?: Partial<DealFormValues>;
  mode: "create" | "edit";
}

export function DealForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: DealFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: initialData || {
      isNew: false,
      isLimited: false,
      isActive: true,
      originalPrice: 0,
      discountPercentage: 0,
    },
  });

  const category = watch("category");

  // Handle form submission with NaN conversion
  const handleFormSubmit = (data: DealFormValues) => {
    // Convert NaN to 0 for optional number fields
    const cleanedData = {
      ...data,
      originalPrice: isNaN(data.originalPrice as number)
        ? 0
        : data.originalPrice,
      discountPercentage: isNaN(data.discountPercentage as number)
        ? 0
        : data.discountPercentage,
    };
    return onSubmit(cleanedData);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'upload");
      }

      const data = await response.json();
      setUploadedImage(data.imageUrl);
      setValue("imageUrl", data.imageUrl);
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setValue("imageUrl", "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Créer un nouveau deal" : "Modifier le deal"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajoutez un nouveau deal à votre catalogue"
              : "Modifiez les informations du deal"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre du deal *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Nike Air Jordan 1 High OG 'Chicago'"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Marque */}
          <div className="space-y-2">
            <Label htmlFor="brand">Marque *</Label>
            <Input id="brand" {...register("brand")} placeholder="Ex: Nike" />
            {errors.brand && (
              <p className="text-sm text-destructive">{errors.brand.message}</p>
            )}
          </div>

          {/* Prix */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Prix original (€)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                {...register("originalPrice", {
                  setValueAs: (v) =>
                    v === "" || v === null ? 0 : parseFloat(v),
                })}
                placeholder="149.99 (optionnel)"
              />
              {errors.originalPrice && (
                <p className="text-sm text-destructive">
                  {errors.originalPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPrice">Prix actuel (€) *</Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                {...register("currentPrice", {
                  setValueAs: (v) => parseFloat(v),
                })}
                placeholder="99.99"
              />
              {errors.currentPrice && (
                <p className="text-sm text-destructive">
                  {errors.currentPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">Réduction (%)</Label>
              <Input
                id="discountPercentage"
                type="number"
                {...register("discountPercentage", {
                  setValueAs: (v) => (v === "" || v === null ? 0 : parseInt(v)),
                })}
                placeholder="33 (optionnel)"
              />
              {errors.discountPercentage && (
                <p className="text-sm text-destructive">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sneakers">Sneakers</SelectItem>
                <SelectItem value="streetwear">Streetwear</SelectItem>
                <SelectItem value="accessories">Accessoires</SelectItem>
                <SelectItem value="electronics">Électronique</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Image du produit *</Label>

            {uploadedImage ? (
              <div className="relative">
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                  <img
                    src={uploadedImage}
                    alt="Aperçu"
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={handleRemoveImage}
                >
                  <X className="mr-2 h-4 w-4" />
                  Supprimer l&apos;image
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG ou WEBP. Max 5MB.
                  </p>
                </div>
                {isUploading && (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                )}
              </div>
            )}

            {errors.imageUrl && (
              <p className="text-sm text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliateUrl">URL d&apos;affiliation *</Label>
            <Input
              id="affiliateUrl"
              {...register("affiliateUrl")}
              placeholder="https://affiliate.com/product"
            />
            {errors.affiliateUrl && (
              <p className="text-sm text-destructive">
                {errors.affiliateUrl.message}
              </p>
            )}
          </div>

          {/* Code promo */}
          <div className="space-y-2">
            <Label htmlFor="promoCode">Code promo (optionnel)</Label>
            <Input
              id="promoCode"
              {...register("promoCode")}
              placeholder="SAVE20"
            />
          </div>

          {/* Description promo */}
          <div className="space-y-2">
            <Label htmlFor="promoDescription">
              Description du promo (optionnel)
            </Label>
            <Textarea
              id="promoDescription"
              {...register("promoDescription")}
              placeholder="Utilisez le code SAVE20 pour obtenir 20% de réduction supplémentaire"
              rows={3}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isNew"
                {...register("isNew")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isNew" className="font-normal cursor-pointer">
                Nouveau
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isLimited"
                {...register("isLimited")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isLimited" className="font-normal cursor-pointer">
                Édition limitée
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isActive" className="font-normal cursor-pointer">
                Actif
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mode === "create"
                ? "Créer le deal"
                : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
