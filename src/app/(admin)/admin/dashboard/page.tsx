import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Heart, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/db";

// Force dynamic rendering to avoid DB calls during build
export const dynamic = "force-dynamic";

/**
 * Admin Dashboard Page
 * Overview with KPI cards showing key metrics
 */

async function getStats() {
  try {
    const [dealsCount, usersCount, favoritesCount] = await Promise.all([
      prisma.deal.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.favorite.count(),
    ]);

    return {
      dealsCount,
      usersCount,
      favoritesCount,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      dealsCount: 0,
      usersCount: 0,
      favoritesCount: 0,
    };
  }
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-4 w-4 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}

async function DashboardStats() {
  const stats = await getStats();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Deals actifs"
        value={stats.dealsCount}
        icon={Package}
        description="Offres en ligne"
      />
      <StatsCard
        title="Utilisateurs"
        value={stats.usersCount}
        icon={Users}
        description="Comptes créés"
      />
      <StatsCard
        title="Favoris"
        value={stats.favoritesCount}
        icon={Heart}
        description="Total des favoris"
      />
      <StatsCard
        title="Engagement"
        value={
          stats.usersCount > 0
            ? (stats.favoritesCount / stats.usersCount).toFixed(1)
            : "0"
        }
        icon={TrendingUp}
        description="Favoris par utilisateur"
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de votre plateforme Camino TV
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les graphiques d&apos;activité seront disponibles prochainement.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Gérez rapidement votre contenu depuis le menu latéral.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
