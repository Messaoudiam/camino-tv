"use client";

/**
 * Carte de deal UPGRADÉE - Shadcn + fonctionnalités modernes
 * Base cmno.tv mais avec UX premium pour impressionner
 */

import { memo, useState } from "react";
import Image from "next/image";
import {
  Heart,
  ExternalLink,
  Share2,
  TrendingUp,
  Eye,
  Clock,
  Tag,
  Copy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DealCardProps } from "@/types";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { blurPlaceholders } from "@/lib/image-utils";

export const DealCard = memo(function DealCard({
  deal,
  onClick,
  className,
}: DealCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isSharing, setIsSharing] = useState(false);
  const [promoCodeCopied, setPromoCodeCopied] = useState(false);
  const isFavorited = isFavorite(deal.id);

  // Vérifier si le deal est encore "nouveau" (moins de 7 jours)
  const isRecentlyNew = () => {
    if (!deal.createdAt || !deal.isNew) return false;
    const createdDate = new Date(deal.createdAt);
    const now = new Date();
    const daysDiff =
      (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  };

  const handleClick = () => {
    onClick?.();
    // Ouvrir le lien affilié dans un nouvel onglet
    window.open(deal.affiliateUrl, "_blank", "noopener,noreferrer");
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(deal.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSharing(true);

    if (navigator.share) {
      try {
        await navigator.share({
          title: deal.title,
          text: `Deal ${deal.brand} - ${deal.currentPrice}€`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled by user - silent fail
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }

    setTimeout(() => setIsSharing(false), 500);
  };

  const handleCopyPromoCode = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deal.promoCode) {
      await navigator.clipboard.writeText(deal.promoCode);
      setPromoCodeCopied(true);
      setTimeout(() => setPromoCodeCopied(false), 2000);
    }
  };

  return (
    <TooltipProvider>
      <Card
        variant="deal"
        size="lg"
        padding="none"
        className={cn("group", className)}
      >
        <CardContent className="p-0">
          {/* Image container avec overlays modernes */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <Image
              src={deal.imageUrl}
              alt={deal.title}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL={blurPlaceholders.product}
            />

            {/* Badges améliorés */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isRecentlyNew() && (
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-bold shadow-lg border border-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  NOUVEAU
                </Badge>
              )}
            </div>

            {/* Badge réduction avec indication code promo */}
            <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
              {deal.promoCode && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs px-2.5 py-1.5 shadow-lg flex items-center gap-1 border border-red-400">
                  <Tag className="h-2.5 w-2.5" />
                  CODE PROMO
                </Badge>
              )}
              {deal.discountPercentage > 0 ? (
                <Badge className="bg-foreground text-background font-bold text-sm px-3 py-1 shadow-lg">
                  -{deal.discountPercentage}%
                </Badge>
              ) : !deal.promoCode ? (
                <Badge className="bg-blue-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
                  BON PLAN
                </Badge>
              ) : null}
            </div>

            {/* Actions overlay premium avec Dialog */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {/* Favoris avec tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-background shadow-lg"
                    onClick={handleFavorite}
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isFavorited
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isFavorited
                      ? "Retirer des favoris"
                      : "Ajouter aux favoris"}
                  </p>
                </TooltipContent>
              </Tooltip>

              {/* Partage avec tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-background/90 hover:bg-background shadow-lg"
                    onClick={handleShare}
                  >
                    <Share2
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isSharing && "scale-110",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Partager ce deal</p>
                </TooltipContent>
              </Tooltip>

              {/* Dialog détails produit */}
              <Dialog>
                <DialogTrigger asChild>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 rounded-full bg-background/90 hover:bg-background shadow-lg"
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Voir les détails</p>
                    </TooltipContent>
                  </Tooltip>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span>{deal.title}</span>
                      {deal.discountPercentage > 0 ? (
                        <Badge className="bg-brand-500">
                          -{deal.discountPercentage}%
                        </Badge>
                      ) : deal.promoCode ? (
                        <Badge className="bg-gradient-to-r from-brand-500 to-brand-600 text-white flex items-center gap-1 border border-brand-400">
                          <Tag className="h-3 w-3" />
                          CODE PROMO
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500">BON PLAN</Badge>
                      )}
                    </DialogTitle>
                    <DialogDescription>
                      Deal {deal.brand}{" "}
                      {deal.discountPercentage > 0 &&
                        `• Économisez ${(deal.originalPrice - deal.currentPrice).toFixed(0)}€`}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image du produit */}
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={deal.imageUrl}
                        alt={deal.title}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={blurPlaceholders.product}
                      />
                    </div>

                    {/* Détails */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {deal.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Par {deal.brand}
                        </p>
                      </div>

                      <Separator />

                      {/* Prix détaillé */}
                      <div className="space-y-2">
                        {deal.discountPercentage > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Prix original
                            </span>
                            <span className="line-through text-muted-foreground/70">
                              {deal.originalPrice}€
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Prix
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            {deal.currentPrice}€
                          </span>
                        </div>
                        {deal.discountPercentage > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Vous économisez
                            </span>
                            <span className="font-semibold text-red-500">
                              {(deal.originalPrice - deal.currentPrice).toFixed(
                                0,
                              )}
                              € ({deal.discountPercentage}%)
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Code promo section */}
                      {deal.promoCode && (
                        <div className="space-y-3 p-4 bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/10 rounded-xl border-2 border-brand-200 dark:border-brand-700 shadow-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-brand-700 dark:text-brand-300 flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              Code promo exclusif
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={handleCopyPromoCode}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              {promoCodeCopied ? "Copié!" : "Copier"}
                            </Button>
                          </div>
                          <div className="relative">
                            <div className="font-mono text-xl font-bold text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg border-2 border-brand-300 dark:border-brand-600 text-center shadow-inner bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                              {deal.promoCode}
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-500 rounded-full animate-ping"></div>
                          </div>
                          {deal.promoDescription && (
                            <div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-lg border border-brand-200 dark:border-brand-700">
                              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                                <span className="text-brand-700 dark:text-brand-300 font-semibold">
                                  ⚠️ Conditions:
                                </span>{" "}
                                {deal.promoDescription}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Infos deal */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Offre limitée dans le temps</span>
                        </div>
                        {isRecentlyNew() && (
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Nouveau deal</span>
                          </div>
                        )}
                      </div>

                      {/* CTA amélioré */}
                      <Button
                        onClick={handleClick}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
                        size="lg"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir l'offre sur le site
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Contenu amélioré */}
          <div className="p-4 space-y-3">
            {/* Prix avec indication code promo */}
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {deal.currentPrice}€
                  </span>
                  {deal.originalPrice !== deal.currentPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {deal.originalPrice}€
                    </span>
                  )}
                </div>
                {deal.promoCode && (
                  <button
                    onClick={handleCopyPromoCode}
                    className="text-xs text-red-600 dark:text-red-400 font-semibold hover:text-red-700 dark:hover:text-red-300 cursor-pointer transition-all duration-200 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-800/30 hover:scale-105 flex items-center gap-1"
                  >
                    avec le code{" "}
                    <span className="font-mono">{deal.promoCode}</span>
                    {promoCodeCopied ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="opacity-70">📋</span>
                    )}
                  </button>
                )}
              </div>

              {/* Économies calculées */}
              {deal.originalPrice !== deal.currentPrice && (
                <span className="text-xs text-green-600 font-medium">
                  -{(deal.originalPrice - deal.currentPrice).toFixed(0)}€
                </span>
              )}
            </div>

            {/* Titre avec meilleure lisibilité */}
            <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-tight">
              {deal.title}
            </h3>

            {/* Marque avec style amélioré */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {deal.brand}
              </p>

              {/* CTA "Voir l'offre" amélioré */}
              <button
                onClick={handleClick}
                className="text-xs bg-muted/50 hover:bg-muted px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer hover:scale-105 font-medium"
              >
                Voir l'offre
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});
