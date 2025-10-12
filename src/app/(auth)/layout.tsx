import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentification - Camino TV',
  description: 'Connectez-vous pour accéder à votre espace personnel Camino TV',
}

/**
 * Auth Layout
 * Clean minimal layout for authentication pages (login, signup)
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}
