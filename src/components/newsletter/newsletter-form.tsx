"use client";

import { useState } from "react";
import { z } from "zod";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribeNewsletter } from "@/lib/queries";
import { toast } from "sonner";

// Schéma de validation Zod
const emailSchema = z
  .string()
  .min(1, "L'adresse email est requise")
  .email("L'adresse email n'est pas valide");

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation côté client
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    subscribe(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setEmail("");
          setConfirmationSent(true);
        },
        onError: (error) => {
          const message =
            error.message || "Une erreur est survenue lors de l'inscription";
          toast.error(message);
          setError(message);
        },
      },
    );
  };

  if (confirmationSent) {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">
          Vérifiez votre boîte mail pour confirmer votre inscription !
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={isPending}
            className="pl-10"
            aria-invalid={!!error}
            aria-describedby={error ? "newsletter-error" : undefined}
          />
        </div>
        <Button type="submit" disabled={isPending} size="default">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "S'inscrire"
          )}
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </form>
  );
}
