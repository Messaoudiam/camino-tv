"use client";

/**
 * Footer réutilisable et cohérent pour toutes les pages
 * Design system unifié avec variants pour différents contexts
 */

import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

const footerVariants = cva("border-t bg-background/95 backdrop-blur-sm", {
  variants: {
    variant: {
      full: "bg-muted/30 border-border/50",
      minimal: "bg-muted/20 border-border/30",
      clean: "bg-background border-border",
    },
    size: {
      default: "py-12",
      compact: "py-6",
      spacious: "py-16",
    },
  },
  defaultVariants: {
    variant: "full",
    size: "default",
  },
});

export interface FooterProps
  extends React.ComponentProps<"footer">,
    VariantProps<typeof footerVariants> {
  showFullContent?: boolean;
}

export function Footer({
  className,
  variant,
  size,
  showFullContent = true,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn(footerVariants({ variant, size, className }))}
      {...props}
    >
      <div className="max-w-6xl mx-auto px-4">
        {showFullContent ? (
          <>
            {/* Footer complet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="col-span-1 md:col-span-1">
                <Image
                  src="/camino_logo.jpg"
                  alt="Camino TV"
                  width={120}
                  height={40}
                  className="h-10 w-auto mb-4 transition-transform hover:scale-105"
                />
                <p className="text-muted-foreground mb-4 max-w-md font-sans">
                  La plateforme de référence pour dénicher les meilleurs bons
                  plans sneakers en France. Découvrez des offres exclusives sur
                  vos marques préférées.
                </p>

                {/* Newsletter */}
                <div className="mt-6">
                  <h4 className="font-semibold text-foreground mb-3 font-sans">
                    Newsletter
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 font-sans">
                    Recevez les meilleurs deals directement dans votre boîte mail.
                  </p>
                  <NewsletterForm />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:col-span-2">
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground mb-4 font-sans">
                    Navigation
                  </h4>
                  <nav className="space-y-2 text-sm">
                    <Link
                      href="/"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Accueil
                    </Link>
                    <Link
                      href="/deals"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Bons plans
                    </Link>
                    <Link
                      href="/favorites"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Favoris
                    </Link>
                    <Link
                      href="/blog"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Blog
                    </Link>
                    <Link
                      href="/team"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Équipe
                    </Link>
                  </nav>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground mb-4 font-sans">
                    Légal
                  </h4>
                  <nav className="space-y-2 text-sm">
                    <Link
                      href="/legal/cgu"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      CGU
                    </Link>
                    <Link
                      href="/legal"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Mentions légales
                    </Link>
                    <a
                      href="https://github.com/Messaoudiam/camino-tv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-muted-foreground hover:text-foreground transition-colors font-sans"
                    >
                      Code Source
                    </a>
                  </nav>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p className="font-sans">
                © 2025 Camino TV - Fait avec ❤️ par{" "}
                <a
                  href="https://codingmessaoud.com"
                  className="text-brand-500 hover:text-brand-600 transition-colors font-sans cursor-pointer"
                >
                  Messaoudiam
                </a>
              </p>
            </div>
          </>
        ) : (
          /* Footer minimal */
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <div className="flex gap-4">
              <Link
                href="/legal/cgu"
                className="hover:text-foreground transition-colors font-sans"
              >
                CGU
              </Link>
              <Link
                href="/legal"
                className="hover:text-foreground transition-colors font-sans"
              >
                Mentions légales
              </Link>
              <a
                href="#"
                className="hover:text-foreground transition-colors font-sans"
              >
                Contact
              </a>
            </div>
            <div className="text-center">
              <p className="font-sans">
                © 2025 Camino TV - Fait avec ❤️ par{" "}
                <a
                  href="https://codingmessaoud.com"
                  className="text-brand-500 hover:text-brand-600 transition-colors font-sans cursor-pointer"
                >
                  Messaoudiam
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
