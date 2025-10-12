import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { prisma } from './db'
import { validatePassword, isCommonPassword } from './password-validation'

/**
 * Better Auth Configuration
 * Next.js 15 App Router + Prisma + PostgreSQL
 *
 * Security features:
 * - Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
 * - Common password blocking
 * - bcrypt hashing with salt
 *
 * Docs: https://www.better-auth.com/docs
 */

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production with email service
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Custom password validation with security checks
    async validatePassword(password: string) {
      // Use centralized validation logic
      const validation = validatePassword(password)

      if (!validation.valid) {
        return {
          valid: false,
          message: validation.errors.join('. '),
        }
      }

      // Check for common passwords
      if (isCommonPassword(password)) {
        return {
          valid: false,
          message: 'Ce mot de passe est trop commun. Veuillez en choisir un plus sécurisé',
        }
      }

      return { valid: true }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false, // Not editable by user
      },
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
    crossSubDomainCookies: {
      enabled: false,
    },
    database: {
      generateId: false, // Use Prisma's cuid() instead
    },
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ],
})
