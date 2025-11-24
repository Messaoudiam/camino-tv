import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Nous contacter | Camino TV",
  description:
    "Contactez l'équipe Camino TV pour vos questions, partenariats, collaborations ou suggestions. Nous répondons à tous vos messages dans les plus brefs délais.",
  keywords: [
    "contact camino tv",
    "contacter équipe camino",
    "partenariat camino tv",
    "collaboration influenceur",
    "support client camino",
    "business camino tv",
    "contact team camino",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://camino-tv.vercel.app/contact",
    title: "Contact - Nous contacter | Camino TV",
    description:
      "Envoyez un message à l'équipe Camino TV. Nous sommes à votre écoute pour toutes vos questions et propositions.",
    siteName: "Camino TV",
  },
  twitter: {
    card: "summary_large_image",
    site: "@CaminoTV",
    title: "Contact - Nous contacter | Camino TV",
    description:
      "Contactez l'équipe Camino TV pour vos questions, partenariats et collaborations.",
  },
};

export default function ContactPage() {
  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Camino TV",
    url: "https://camino-tv.vercel.app",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "French",
      areaServed: "FR",
    },
    sameAs: [
      "https://www.youtube.com/@CaminoTV",
      "https://www.instagram.com/caminotv/",
      "https://x.com/CaminoTV",
      "https://www.twitch.tv/caminotv",
      "https://www.tiktok.com/@caminotv",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData),
        }}
      />
      <div className="min-h-screen bg-background">
        <Header />

        <PageHeader
          badge={{
            icon: Mail,
            text: "Contact",
          }}
          title="Contactez-nous"
          description="Une question, une suggestion ou envie de collaborer ? Nous sommes là pour vous écouter !"
        />

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Formulaire de contact - 2/3 */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Informations de contact - 1/3 */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>

        <Footer showFullContent={false} variant="minimal" size="compact" />
      </div>
    </>
  );
}
