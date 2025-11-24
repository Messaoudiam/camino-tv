import { auth } from "@/lib/auth";

/**
 * Authentication & Authorization Helpers
 * Reusable functions for protecting API routes
 *
 * Best Practice (2025): Multi-layered security approach
 * - NEVER rely solely on middleware for auth checks
 * - ALWAYS verify authentication in each protected API route
 * - CVE-2025-29927: Middleware alone is not considered safe
 */

export interface AuthError {
  error: string;
  status: 401 | 403;
  session?: never;
}

export interface AuthSuccess {
  session: any; // Better Auth session type (includes user + session)
  error: null;
  status?: never;
}

export type AuthResult = AuthError | AuthSuccess;

/**
 * Type guard to check if auth result is successful
 */
export function isAuthSuccess(result: AuthResult): result is AuthSuccess {
  return result.error === null;
}

/**
 * Require authenticated user (any role)
 * Use in API routes that need authentication
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest) {
 *   const authResult = await requireAuth(request.headers)
 *   if (authResult.error) {
 *     return NextResponse.json({ error: authResult.error }, { status: authResult.status })
 *   }
 *   const { session } = authResult
 *   // ... protected logic
 * }
 * ```
 */
export async function requireAuth(headers: Headers): Promise<AuthResult> {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return {
      error: "Non authentifié. Veuillez vous connecter.",
      status: 401,
    };
  }

  return {
    session,
    error: null,
  };
}

/**
 * Require ADMIN role
 * Use in API routes that need admin privileges
 *
 * @example
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const authResult = await requireAdmin(request.headers)
 *   if (authResult.error) {
 *     return NextResponse.json({ error: authResult.error }, { status: authResult.status })
 *   }
 *   const { session } = authResult
 *   // ... admin-only logic
 * }
 * ```
 */
export async function requireAdmin(headers: Headers): Promise<AuthResult> {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return {
      error: "Non authentifié. Veuillez vous connecter.",
      status: 401,
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: "Accès refusé. Privilèges administrateur requis.",
      status: 403,
    };
  }

  return {
    session,
    error: null,
  };
}

/**
 * Require specific user (only the resource owner or admin)
 * Use for user-specific resources (e.g., /api/users/:userId)
 *
 * @example
 * ```ts
 * export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
 *   const authResult = await requireOwnerOrAdmin(request.headers, params.id)
 *   if (authResult.error) {
 *     return NextResponse.json({ error: authResult.error }, { status: authResult.status })
 *   }
 *   // ... user-specific logic
 * }
 * ```
 */
export async function requireOwnerOrAdmin(
  headers: Headers,
  resourceUserId: string,
): Promise<AuthResult> {
  const session = await auth.api.getSession({ headers });

  if (!session) {
    return {
      error: "Non authentifié. Veuillez vous connecter.",
      status: 401,
    };
  }

  const isOwner = session.user.id === resourceUserId;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return {
      error:
        "Accès refusé. Vous ne pouvez accéder qu'à vos propres ressources.",
      status: 403,
    };
  }

  return {
    session,
    error: null,
  };
}
