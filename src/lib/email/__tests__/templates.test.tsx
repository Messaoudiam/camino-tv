/**
 * Tests for Email Templates
 * Verifies that templates render correctly as React components
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ConfirmationEmail,
  WelcomeEmail,
  NewsletterEmail,
} from "../templates";

// Helper to render email templates to HTML string
function renderEmail(component: React.ReactElement): string {
  return renderToStaticMarkup(component);
}

describe("Email Templates", () => {
  describe("ConfirmationEmail", () => {
    const confirmUrl = "https://camino-tv.vercel.app/api/newsletter/confirm?token=abc123";

    it("renders without crashing", () => {
      const html = renderEmail(<ConfirmationEmail confirmUrl={confirmUrl} />);
      expect(html).toBeTruthy();
      expect(typeof html).toBe("string");
    });

    it("includes the confirmation button with correct URL", () => {
      const html = renderEmail(<ConfirmationEmail confirmUrl={confirmUrl} />);
      expect(html).toContain(confirmUrl);
      expect(html).toContain("Confirmer mon inscription");
    });

    it("includes the brand name", () => {
      const html = renderEmail(<ConfirmationEmail confirmUrl={confirmUrl} />);
      expect(html).toContain("Camino TV");
    });

    it("includes confirmation instructions", () => {
      const html = renderEmail(<ConfirmationEmail confirmUrl={confirmUrl} />);
      expect(html).toContain("Confirmez votre inscription");
      expect(html).toContain("confirmer votre adresse email");
    });

    it("includes expiration notice", () => {
      const html = renderEmail(<ConfirmationEmail confirmUrl={confirmUrl} />);
      expect(html).toContain("24 heures");
    });

    it("includes disclaimer about unsolicited email", () => {
      const html = renderEmail(<ConfirmationEmail confirmUrl={confirmUrl} />);
      expect(html).toContain("ignorer cet email");
    });
  });

  describe("WelcomeEmail", () => {
    const unsubscribeUrl = "https://camino-tv.vercel.app/unsubscribe?email=test@example.com";

    it("renders without crashing", () => {
      const html = renderEmail(<WelcomeEmail unsubscribeUrl={unsubscribeUrl} />);
      expect(html).toBeTruthy();
      expect(typeof html).toBe("string");
    });

    it("includes welcome message", () => {
      const html = renderEmail(<WelcomeEmail unsubscribeUrl={unsubscribeUrl} />);
      expect(html).toContain("Bienvenue");
    });

    it("includes list of benefits", () => {
      const html = renderEmail(<WelcomeEmail unsubscribeUrl={unsubscribeUrl} />);
      expect(html).toContain("meilleurs deals sneakers");
      expect(html).toContain("offres exclusives");
      expect(html).toContain("codes promo");
    });

    it("includes CTA button to view deals", () => {
      const html = renderEmail(<WelcomeEmail unsubscribeUrl={unsubscribeUrl} />);
      expect(html).toContain("Voir les deals du moment");
      expect(html).toContain("camino-tv.vercel.app/deals");
    });

    it("includes unsubscribe link", () => {
      const html = renderEmail(<WelcomeEmail unsubscribeUrl={unsubscribeUrl} />);
      expect(html).toContain(unsubscribeUrl);
      expect(html).toContain("desinscrire");
    });
  });

  describe("NewsletterEmail", () => {
    const subject = "Les meilleurs deals de la semaine";
    const content = "<p>Découvrez nos <strong>offres exclusives</strong>!</p>";
    const unsubscribeUrl = "https://camino-tv.vercel.app/unsubscribe?email=test@example.com";

    it("renders without crashing", () => {
      const html = renderEmail(
        <NewsletterEmail subject={subject} content={content} unsubscribeUrl={unsubscribeUrl} />
      );
      expect(html).toBeTruthy();
      expect(typeof html).toBe("string");
    });

    it("includes the subject as heading", () => {
      const html = renderEmail(
        <NewsletterEmail subject={subject} content={content} unsubscribeUrl={unsubscribeUrl} />
      );
      expect(html).toContain(subject);
    });

    it("renders HTML content", () => {
      const html = renderEmail(
        <NewsletterEmail subject={subject} content={content} unsubscribeUrl={unsubscribeUrl} />
      );
      // Content should be included (dangerouslySetInnerHTML)
      expect(html).toContain("offres exclusives");
    });

    it("includes unsubscribe link", () => {
      const html = renderEmail(
        <NewsletterEmail subject={subject} content={content} unsubscribeUrl={unsubscribeUrl} />
      );
      expect(html).toContain(unsubscribeUrl);
      expect(html).toContain("desinscrire");
    });

    it("includes brand footer", () => {
      const html = renderEmail(
        <NewsletterEmail subject={subject} content={content} unsubscribeUrl={unsubscribeUrl} />
      );
      expect(html).toContain("Camino TV");
      expect(html).toContain("meilleurs deals sneakers");
    });
  });

  describe("Email Layout", () => {
    it("includes proper HTML structure", () => {
      const html = renderEmail(
        <ConfirmationEmail confirmUrl="https://example.com" />
      );

      expect(html).toContain("<html");
      expect(html).toContain("<head");
      expect(html).toContain("<body");
      expect(html).toContain("</html>");
    });

    it("includes viewport meta tag", () => {
      const html = renderEmail(
        <ConfirmationEmail confirmUrl="https://example.com" />
      );

      expect(html).toContain("viewport");
      expect(html).toContain("width=device-width");
    });

    it("uses brand color", () => {
      const html = renderEmail(
        <ConfirmationEmail confirmUrl="https://example.com" />
      );

      // Brand color is #dc2626 (red-600)
      expect(html).toContain("#dc2626");
    });

    it("includes email-safe table layout", () => {
      const html = renderEmail(
        <ConfirmationEmail confirmUrl="https://example.com" />
      );

      expect(html).toContain("<table");
      expect(html).toContain('role="presentation"');
    });
  });
});
