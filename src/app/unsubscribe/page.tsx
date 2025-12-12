import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UnsubscribeForm } from "@/components/newsletter/unsubscribe-form";
import { MailX } from "lucide-react";

export const metadata: Metadata = {
  title: "Se désinscrire de la newsletter | Camino TV",
  description: "Gérez votre inscription à la newsletter Camino TV",
  robots: "noindex, nofollow",
};

interface UnsubscribePageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { email } = await searchParams;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <MailX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Se désinscrire
            </h1>
            <p className="text-muted-foreground">
              Vous ne souhaitez plus recevoir nos emails ? Confirmez votre
              désinscription ci-dessous.
            </p>
          </div>

          <UnsubscribeForm initialEmail={email} />

          <p className="text-xs text-muted-foreground text-center mt-6">
            Vous pourrez vous réinscrire à tout moment depuis notre site.
          </p>
        </div>
      </main>

      <Footer showFullContent={false} variant="minimal" size="compact" />
    </div>
  );
}
