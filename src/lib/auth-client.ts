"use client";

import { createAuthClient } from "better-auth/react";
import type {} from "@/types/better-auth";

/**
 * Better Auth Client for React Components
 * Use this in Client Components to access auth state and methods
 *
 * Usage:
 * ```tsx
 * import { authClient } from '@/lib/auth-client'
 *
 * function MyComponent() {
 *   const { data: session, isPending } = authClient.useSession()
 *   const { signIn, signOut } = authClient
 *
 *   return <button onClick={() => signOut()}>Sign out</button>
 * }
 * ```
 */

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

/**
 * Custom hook for easy auth access
 * Provides a clean API for authentication state and methods
 */
export function useAuth() {
  const { data: session, isPending, error } = authClient.useSession();

  // Type assertion for custom User fields
  const user = session?.user as { role?: "USER" | "ADMIN" } | undefined;

  return {
    // Session data
    user: session?.user ?? null,
    session: session ?? null,

    // Loading states
    isLoading: isPending,
    isAuthenticated: !!session?.user,

    // Error
    error,

    // Auth methods
    signIn: authClient.signIn,
    signUp: authClient.signUp,
    signOut: authClient.signOut,

    // Helper for role-based access
    isAdmin: user?.role === "ADMIN",
    isUser: user?.role === "USER",
  };
}
