"use client";

import { useState } from "react";
import { z } from "zod";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useUnsubscribeNewsletter } from "@/lib/queries";

// Schéma de validation Zod
const emailSchema = z
  .string()
  .min(1, "L'adresse email est requise")
  .email("L'adresse email n'est pas valide");

interface UnsubscribeFormProps {
  initialEmail?: string;
}

export function UnsubscribeForm({ initialEmail }: UnsubscribeFormProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [error, setError] = useState<string | null>(null);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { mutate: unsubscribe, isPending } = useUnsubscribeNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation côté client
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    unsubscribe(
      { email },
      {
        onSuccess: (data) => {
          setMessage(data.message);
          setIsUnsubscribed(true);
        },
        onError: (error) => {
          setError(
            error.message || "Une erreur est survenue lors de la désinscription"
          );
        },
      }
    );
  };

  if (isUnsubscribed) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Désinscription confirmée
            </h2>
            <p className="text-muted-foreground">{message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isPending}
                className="pl-10"
                aria-invalid={!!error}
                aria-describedby={error ? "unsubscribe-error" : undefined}
              />
            </div>
          </div>

          {error && (
            <div
              id="unsubscribe-error"
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Désinscription en cours...
              </>
            ) : (
              "Me désinscrire"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
