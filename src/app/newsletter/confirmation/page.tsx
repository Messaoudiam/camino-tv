"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const reason = searchParams.get("reason");

  // Success state
  if (status === "success") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Inscription confirmée !</CardTitle>
          <CardDescription>
            Votre adresse email a été validée avec succès.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            Vous recevrez désormais nos meilleurs deals sneakers et streetwear
            directement dans votre boîte de réception.
          </p>
          <Button asChild>
            <Link href="/deals">Voir les deals</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Already confirmed state
  if (status === "already_confirmed") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Déjà confirmé</CardTitle>
          <CardDescription>
            Votre inscription a déjà été confirmée.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-muted-foreground">
            Vous êtes déjà inscrit à notre newsletter. Pas besoin de confirmer à
            nouveau !
          </p>
          <Button asChild>
            <Link href="/deals">Voir les deals</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Error states
  let errorTitle = "Une erreur est survenue";
  let errorDescription = "Impossible de confirmer votre inscription.";

  if (reason === "missing_token") {
    errorTitle = "Lien invalide";
    errorDescription = "Le lien de confirmation est incomplet.";
  } else if (reason === "invalid_token") {
    errorTitle = "Lien expiré ou invalide";
    errorDescription =
      "Ce lien de confirmation n'est plus valide. Il a peut-être déjà été utilisé ou a expiré.";
  } else if (reason === "server_error") {
    errorTitle = "Erreur serveur";
    errorDescription =
      "Une erreur technique est survenue. Veuillez réessayer plus tard.";
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl">{errorTitle}</CardTitle>
        <CardDescription>{errorDescription}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-6 text-muted-foreground">
          Si vous souhaitez vous inscrire à la newsletter, veuillez réessayer
          depuis notre site.
        </p>
        <Button asChild>
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function NewsletterConfirmationPage() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Suspense
        fallback={
          <Card className="w-full max-w-md">
            <CardContent className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </CardContent>
          </Card>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
