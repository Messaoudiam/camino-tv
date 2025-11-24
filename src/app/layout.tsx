import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://camino-tv.vercel.app"),
  title: "Camino TV - We The Mouvement",
  description:
    "Découvrez les meilleurs deals sneakers en temps réel. Nike, Adidas, Jordan et bien plus encore. Plus de 100k passionnés nous font confiance.",
  keywords: [
    "sneakers",
    "deals",
    "nike",
    "adidas",
    "jordan",
    "réductions",
    "bons plans",
  ],
  authors: [{ name: "Camino TV" }],
  creator: "Camino TV",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://camino-tv.vercel.app",
    title: "Camino TV - Bons Plans Premium Sneakers",
    description:
      "La plateforme de référence pour dénicher les meilleurs deals sneakers en France.",
    siteName: "Camino TV",
  },
  twitter: {
    card: "summary_large_image",
    title: "Camino TV - Bons Plans Premium Sneakers",
    description:
      "La plateforme de référence pour dénicher les meilleurs deals sneakers en France.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans antialiased bg-background text-foreground min-h-screen"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
