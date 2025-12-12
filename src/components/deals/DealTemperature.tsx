"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDealVote, useVoteDeal, useRemoveVote } from "@/lib/queries";
import { useAuth } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface DealTemperatureProps {
  dealId: string;
  initialTemperature?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Calcule la couleur de la température
 * - Négatif (cold) → Bleu (#3B82F6)
 * - Neutre (0) → Gris (#6B7280)
 * - Positif (hot) → Rouge/Orange (#EF4444)
 */
function getTemperatureColor(temperature: number): string {
  if (temperature <= -50) return "text-blue-500"; // Very cold
  if (temperature < 0) return "text-blue-400"; // Cold
  if (temperature === 0) return "text-gray-400"; // Neutral
  if (temperature < 50) return "text-orange-400"; // Warm
  if (temperature < 100) return "text-orange-500"; // Hot
  if (temperature < 200) return "text-red-500"; // Very hot
  return "text-red-600"; // Burning hot
}

/**
 * Calcule la couleur de fond
 */
function getTemperatureBgColor(temperature: number): string {
  if (temperature <= -50) return "bg-blue-500/10";
  if (temperature < 0) return "bg-blue-400/10";
  if (temperature === 0) return "bg-gray-400/10";
  if (temperature < 50) return "bg-orange-400/10";
  if (temperature < 100) return "bg-orange-500/10";
  if (temperature < 200) return "bg-red-500/10";
  return "bg-red-600/10";
}

export function DealTemperature({
  dealId,
  initialTemperature = 0,
  className,
  size = "md",
}: DealTemperatureProps) {
  const { isAuthenticated } = useAuth();
  const { data: voteData } = useDealVote(dealId);
  const voteMutation = useVoteDeal();
  const removeMutation = useRemoveVote();

  const temperature = voteData?.temperature ?? initialTemperature;
  const userVote = voteData?.userVote ?? null;
  const isLoading = voteMutation.isPending || removeMutation.isPending;

  const handleVote = (value: 1 | -1) => {
    if (!isAuthenticated) {
      // Could redirect to login or show a toast
      return;
    }

    if (userVote === value) {
      // Already voted this way - remove vote
      removeMutation.mutate(dealId);
    } else {
      // New vote or change vote
      voteMutation.mutate({ dealId, value });
    }
  };

  const sizeClasses = {
    sm: {
      container: "gap-0.5",
      button: "h-5 w-5",
      icon: "h-3 w-3",
      temp: "text-xs px-1.5 py-0.5",
    },
    md: {
      container: "gap-1",
      button: "h-6 w-6",
      icon: "h-4 w-4",
      temp: "text-sm px-2 py-1",
    },
    lg: {
      container: "gap-1.5",
      button: "h-8 w-8",
      icon: "h-5 w-5",
      temp: "text-base px-3 py-1.5",
    },
  };

  const sizes = sizeClasses[size];
  const tempColor = getTemperatureColor(temperature);
  const bgColor = getTemperatureBgColor(temperature);

  return (
    <div
      className={cn(
        "flex items-center rounded-full",
        bgColor,
        sizes.container,
        className,
      )}
    >
      {/* Vote Up (Hot) */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizes.button,
          "rounded-full p-0 hover:bg-orange-500/20",
          userVote === 1 && "bg-orange-500/20 text-orange-500",
          !isAuthenticated && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => handleVote(1)}
        disabled={isLoading || !isAuthenticated}
        title={isAuthenticated ? "Hot! Bon plan" : "Connectez-vous pour voter"}
      >
        <ChevronUp
          className={cn(
            sizes.icon,
            userVote === 1 ? "text-orange-500" : "text-muted-foreground",
          )}
        />
      </Button>

      {/* Temperature Display */}
      <span className={cn("font-bold tabular-nums", tempColor, sizes.temp)}>
        {temperature}°
      </span>

      {/* Vote Down (Cold) */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizes.button,
          "rounded-full p-0 hover:bg-blue-500/20",
          userVote === -1 && "bg-blue-500/20 text-blue-500",
          !isAuthenticated && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => handleVote(-1)}
        disabled={isLoading || !isAuthenticated}
        title={
          isAuthenticated
            ? "Cold! Pas intéressant"
            : "Connectez-vous pour voter"
        }
      >
        <ChevronDown
          className={cn(
            sizes.icon,
            userVote === -1 ? "text-blue-500" : "text-muted-foreground",
          )}
        />
      </Button>
    </div>
  );
}
