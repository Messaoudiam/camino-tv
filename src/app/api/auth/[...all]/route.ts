import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth API Route Handler
 * Handles all auth requests: /api/auth/*
 *
 * Supported endpoints:
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-up/email
 * - POST /api/auth/sign-out
 * - GET  /api/auth/session
 * - POST /api/auth/sign-in/social (Google)
 *
 * Docs: https://www.better-auth.com/docs/concepts/server
 */

export const { GET, POST } = toNextJsHandler(auth)
