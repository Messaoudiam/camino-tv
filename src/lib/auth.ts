import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { validatePassword, isCommonPassword } from "./password-validation";
import { Resend } from "resend";

/**
 * Better Auth Configuration
 * Next.js 15 App Router + Prisma + PostgreSQL
 *
 * Security features:
 * - Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
 * - Common password blocking
 * - bcrypt hashing with salt
 * - Email verification (production)
 *
 * Docs: https://www.better-auth.com/docs
 */

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Email verification configuration
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (!resend) {
        console.warn(
          "RESEND_API_KEY not configured - skipping verification email",
        );
        return;
      }

      await resend.emails.send({
        from: "Camino TV <noreply@camino-tv.com>",
        to: user.email,
        subject: "Vérifiez votre email - Camino TV",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #dc2626;">Camino TV</h1>
            <h2>Bienvenue ${user.name || ""} !</h2>
            <p>Merci de vous être inscrit sur Camino TV. Pour activer votre compte, veuillez confirmer votre adresse email.</p>
            <a href="${url}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
              Vérifier mon email
            </a>
            <p style="color: #666; font-size: 14px;">Ce lien expire dans 24 heures.</p>
            <p style="color: #666; font-size: 12px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
          </div>
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
  },

  emailAndPassword: {
    enabled: true,
    // Enable email verification in production (when RESEND_API_KEY is set)
    requireEmailVerification: !!process.env.RESEND_API_KEY,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Revoke other sessions when password is changed (security best practice)
    revokeOtherSessions: true,
    // Custom password validation with security checks
    async validatePassword(password: string) {
      // Use centralized validation logic
      const validation = validatePassword(password);

      if (!validation.valid) {
        return {
          valid: false,
          message: validation.errors.join(". "),
        };
      }

      // Check for common passwords
      if (isCommonPassword(password)) {
        return {
          valid: false,
          message:
            "Ce mot de passe est trop commun. Veuillez en choisir un plus sécurisé",
        };
      }

      return { valid: true };
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!(
        process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ),
    },
  },

  // Rate limiting against brute-force attacks
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds
    max: 10, // Maximum 10 requests per minute per IP
    storage: "memory", // In-memory storage (Vercel handles DDoS protection)
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
    // CRITICAL SECURITY: Explicit cookie security options
    cookieOptions: {
      sameSite: "lax", // CSRF protection
      httpOnly: true, // Prevent XSS attacks
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days (match session expiration)
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Not editable by user
      },
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    database: {
      generateId: false, // Use Prisma's cuid() instead
    },
  },

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
});
