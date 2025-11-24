import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Authentification - Camino TV",
  description: "Connectez-vous pour accéder à votre espace personnel Camino TV",
};

/**
 * Auth Layout
 * Layout with header/footer for authentication pages (login, signup)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">{children}</div>
      </main>
      <Footer showFullContent={false} size="compact" variant="minimal" />
    </div>
  );
}
