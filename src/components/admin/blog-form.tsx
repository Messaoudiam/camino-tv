"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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

const blogFormSchema = z.object({
  title: z
    .string()
    .min(10, "Le titre doit contenir au moins 10 caractères")
    .max(200),
  slug: z
    .string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug doit être en minuscules avec des tirets",
    ),
  excerpt: z
    .string()
    .min(50, "L'extrait doit contenir au moins 50 caractères")
    .max(500),
  content: z
    .string()
    .min(100, "Le contenu doit contenir au moins 100 caractères"),
  imageUrl: z.string().min(1, "Une image est requise"),
  category: z.enum([
    "culture",
    "streetwear",
    "musique",
    "interview",
    "lifestyle",
    "tendances",
  ]),
  authorName: z.string().min(2, "Le nom de l'auteur est requis"),
  authorImage: z.string().min(1, "L'avatar de l'auteur est requis"),
  authorRole: z.string().min(2, "Le rôle de l'auteur est requis"),
  publishedAt: z.string().min(1, "La date de publication est requise"),
  readTime: z
    .union([z.number().min(1).max(60), z.nan()])
    .transform((val) => (isNaN(val) ? 5 : val)),
  tags: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  mode: "create" | "edit";
}

export function BlogForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: BlogFormProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [authorImage, setAuthorImage] = useState<string | null>(
    initialData?.authorImage || null,
  );
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingAuthor, setIsUploadingAuthor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          publishedAt: initialData.publishedAt
            ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          tags: Array.isArray(initialData.tags)
            ? initialData.tags.join(", ")
            : "",
        }
      : {
          isFeatured: false,
          isPublished: true,
          readTime: 5,
          publishedAt: new Date().toISOString().slice(0, 16),
          tags: "",
        },
  });

  const category = watch("category");
  const title = watch("title");

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === "create" && title) {
      const generatedSlug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [title, mode, setValue]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        publishedAt: initialData.publishedAt
          ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : "",
      });
      setUploadedImage(initialData.imageUrl || null);
      setAuthorImage(initialData.authorImage || null);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: BlogFormValues) => {
    const formattedData = {
      ...data,
      publishedAt: data.publishedAt,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    return onSubmit(formattedData);
  };

  // Handle main image upload
  const handleMainImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
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
      setIsUploadingMain(false);
    }
  };

  // Handle author image upload
  const handleAuthorImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAuthor(true);
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
      setAuthorImage(data.imageUrl);
      setValue("authorImage", data.imageUrl);
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'upload");
    } finally {
      setIsUploadingAuthor(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Créer un nouvel article"
              : "Modifier l'article"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Ajoutez un nouvel article au blog"
              : "Modifiez les informations de l'article"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l&apos;article *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Les tendances sneakers de 2025"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="les-tendances-sneakers-2025"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              URL: /blog/{watch("slug") || "mon-article"}
            </p>
          </div>

          {/* Extrait */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Extrait *</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              placeholder="Un résumé accrocheur de l'article (affiché dans les listes)"
              rows={2}
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          {/* Contenu */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Le contenu complet de l'article..."
              rows={10}
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Catégorie et Temps de lecture */}
          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="streetwear">Streetwear</SelectItem>
                  <SelectItem value="musique">Musique</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="tendances">Tendances</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Temps de lecture (min) *</Label>
              <Input
                id="readTime"
                type="number"
                min="1"
                max="60"
                {...register("readTime", {
                  setValueAs: (v) => (v === "" || v === null ? 5 : parseInt(v)),
                })}
                placeholder="5"
              />
              {errors.readTime && (
                <p className="text-sm text-destructive">
                  {errors.readTime.message}
                </p>
              )}
            </div>
          </div>

          {/* Image principale */}
          <div className="space-y-2">
            <Label htmlFor="mainImage">Image principale *</Label>
            {uploadedImage ? (
              <div className="relative">
                <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                  <Image
                    src={uploadedImage}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setUploadedImage(null);
                    setValue("imageUrl", "");
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Supprimer l&apos;image
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="mainImage"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleMainImageUpload}
                    disabled={isUploadingMain}
                    className="cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG ou WEBP. Max 5MB.
                  </p>
                </div>
                {isUploadingMain && (
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

          {/* Informations auteur */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Informations auteur</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="authorName">Nom de l&apos;auteur *</Label>
                <Input
                  id="authorName"
                  {...register("authorName")}
                  placeholder="Ex: Sean"
                />
                {errors.authorName && (
                  <p className="text-sm text-destructive">
                    {errors.authorName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorRole">Rôle *</Label>
                <Input
                  id="authorRole"
                  {...register("authorRole")}
                  placeholder="Ex: Fondateur & Creator"
                />
                {errors.authorRole && (
                  <p className="text-sm text-destructive">
                    {errors.authorRole.message}
                  </p>
                )}
              </div>
            </div>

            {/* Avatar auteur */}
            <div className="space-y-2">
              <Label htmlFor="authorImageUpload">
                Avatar de l&apos;auteur *
              </Label>
              {authorImage ? (
                <div className="flex items-center gap-4">
                  <Image
                    src={authorImage}
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAuthorImage(null);
                      setValue("authorImage", "");
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Changer
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Input
                    id="authorImageUpload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAuthorImageUpload}
                    disabled={isUploadingAuthor}
                    className="cursor-pointer max-w-xs"
                  />
                  {isUploadingAuthor && (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                </div>
              )}
              {errors.authorImage && (
                <p className="text-sm text-destructive">
                  {errors.authorImage.message}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              {...register("tags")}
              placeholder="sneakers, nike, tendances"
            />
          </div>

          {/* Date de publication */}
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Date de publication *</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              {...register("publishedAt")}
            />
            {errors.publishedAt && (
              <p className="text-sm text-destructive">
                {errors.publishedAt.message}
              </p>
            )}
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                {...register("isFeatured")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label
                htmlFor="isFeatured"
                className="font-normal cursor-pointer"
              >
                Article mis en avant
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublished"
                {...register("isPublished")}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label
                htmlFor="isPublished"
                className="font-normal cursor-pointer"
              >
                Publié
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
                ? "Créer l'article"
                : "Enregistrer les modifications"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
