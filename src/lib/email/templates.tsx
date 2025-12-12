import * as React from "react";

const BRAND_COLOR = "#dc2626"; // red-600
const SITE_NAME = "Camino TV";

/**
 * Base email layout wrapper
 */
function EmailLayout({
  children,
  previewText,
}: {
  children: React.ReactNode;
  previewText?: string;
}) {
  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {previewText && <meta name="description" content={previewText} />}
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f4f4f5",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <table
          role="presentation"
          style={{
            width: "100%",
            backgroundColor: "#f4f4f5",
            padding: "40px 20px",
          }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: BRAND_COLOR,
                          padding: "24px",
                          textAlign: "center",
                        }}
                      >
                        <h1
                          style={{
                            margin: 0,
                            color: "#ffffff",
                            fontSize: "24px",
                            fontWeight: "bold",
                          }}
                        >
                          {SITE_NAME}
                        </h1>
                      </td>
                    </tr>
                    {/* Content */}
                    <tr>
                      <td style={{ padding: "32px 24px" }}>{children}</td>
                    </tr>
                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#f9fafb",
                          padding: "24px",
                          textAlign: "center",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "14px",
                            color: "#6b7280",
                          }}
                        >
                          {SITE_NAME} - Les meilleurs deals sneakers
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            color: "#9ca3af",
                          }}
                        >
                          Vous recevez cet email car vous vous etes inscrit a
                          notre newsletter.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

/**
 * Button component for emails
 */
function EmailButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <table role="presentation" style={{ margin: "24px 0" }}>
      <tbody>
        <tr>
          <td>
            <a
              href={href}
              style={{
                display: "inline-block",
                backgroundColor: BRAND_COLOR,
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
              }}
            >
              {children}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ============================================
// EMAIL TEMPLATES
// ============================================

/**
 * Confirmation email for double opt-in
 */
export function ConfirmationEmail({ confirmUrl }: { confirmUrl: string }) {
  return (
    <EmailLayout previewText="Confirmez votre inscription a la newsletter Camino TV">
      <h2
        style={{
          margin: "0 0 16px 0",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        Confirmez votre inscription
      </h2>
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.6",
        }}
      >
        Merci de votre interet pour la newsletter {SITE_NAME} !
      </p>
      <p
        style={{
          margin: "0 0 24px 0",
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.6",
        }}
      >
        Pour recevoir nos meilleurs deals sneakers et streetwear, veuillez
        confirmer votre adresse email en cliquant sur le bouton ci-dessous :
      </p>
      <EmailButton href={confirmUrl}>Confirmer mon inscription</EmailButton>
      <p
        style={{
          margin: "24px 0 0 0",
          fontSize: "14px",
          color: "#6b7280",
          lineHeight: "1.5",
        }}
      >
        Si vous n&apos;avez pas demande cette inscription, vous pouvez ignorer
        cet email.
      </p>
      <p
        style={{
          margin: "16px 0 0 0",
          fontSize: "12px",
          color: "#9ca3af",
        }}
      >
        Ce lien expire dans 24 heures.
      </p>
    </EmailLayout>
  );
}

/**
 * Welcome email after confirmation
 */
export function WelcomeEmail({ unsubscribeUrl }: { unsubscribeUrl: string }) {
  return (
    <EmailLayout previewText="Bienvenue dans la newsletter Camino TV !">
      <h2
        style={{
          margin: "0 0 16px 0",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        Bienvenue dans la team !
      </h2>
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.6",
        }}
      >
        Votre inscription a la newsletter {SITE_NAME} est confirmee.
      </p>
      <p
        style={{
          margin: "0 0 16px 0",
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.6",
        }}
      >
        Vous recevrez desormais :
      </p>
      <ul
        style={{
          margin: "0 0 24px 0",
          padding: "0 0 0 20px",
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.8",
        }}
      >
        <li>Les meilleurs deals sneakers du moment</li>
        <li>Des offres exclusives streetwear</li>
        <li>Les codes promo en avant-premiere</li>
        <li>Les tendances et nouveautes</li>
      </ul>
      <EmailButton href="https://camino-tv.vercel.app/deals">
        Voir les deals du moment
      </EmailButton>
      <p
        style={{
          margin: "24px 0 0 0",
          fontSize: "12px",
          color: "#9ca3af",
        }}
      >
        Pour vous desinscrire,{" "}
        <a href={unsubscribeUrl} style={{ color: "#6b7280" }}>
          cliquez ici
        </a>
        .
      </p>
    </EmailLayout>
  );
}

/**
 * Contact form notification email (sent to admin)
 */
export function ContactEmail({
  firstName,
  lastName,
  email,
  category,
  subject,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}) {
  const categoryLabels: Record<string, string> = {
    general: "Question générale",
    partnership: "Partenariat",
    collaboration: "Collaboration",
    technical: "Support technique",
    press: "Relations presse",
    other: "Autre",
  };

  return (
    <EmailLayout previewText={`Nouveau message de ${firstName} ${lastName}: ${subject}`}>
      <h2
        style={{
          margin: "0 0 16px 0",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        Nouveau message de contact
      </h2>
      <table
        role="presentation"
        style={{
          width: "100%",
          marginBottom: "24px",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: "600",
                color: "#374151",
                width: "120px",
              }}
            >
              Nom
            </td>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                color: "#111827",
              }}
            >
              {firstName} {lastName}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Email
            </td>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                color: "#111827",
              }}
            >
              <a href={`mailto:${email}`} style={{ color: BRAND_COLOR }}>
                {email}
              </a>
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Catégorie
            </td>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                color: "#111827",
              }}
            >
              {categoryLabels[category] || category}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Sujet
            </td>
            <td
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #e5e7eb",
                color: "#111827",
              }}
            >
              {subject}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            margin: "0 0 8px 0",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Message :
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "16px",
            color: "#111827",
            lineHeight: "1.6",
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </p>
      </div>
      <EmailButton href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`}>
        Répondre à {firstName}
      </EmailButton>
    </EmailLayout>
  );
}

/**
 * Newsletter campaign email
 */
export function NewsletterEmail({
  subject,
  content,
  unsubscribeUrl,
}: {
  subject: string;
  content: string;
  unsubscribeUrl: string;
}) {
  return (
    <EmailLayout previewText={subject}>
      <h2
        style={{
          margin: "0 0 24px 0",
          fontSize: "20px",
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        {subject}
      </h2>
      <div
        style={{
          fontSize: "16px",
          color: "#374151",
          lineHeight: "1.6",
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <hr
        style={{
          margin: "32px 0",
          border: "none",
          borderTop: "1px solid #e5e7eb",
        }}
      />
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        Pour vous desinscrire de la newsletter,{" "}
        <a href={unsubscribeUrl} style={{ color: "#6b7280" }}>
          cliquez ici
        </a>
        .
      </p>
    </EmailLayout>
  );
}
