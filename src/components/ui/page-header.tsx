import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatItem {
  value: string | number;
  label: string;
}

interface PageHeaderProps {
  badge: {
    icon: LucideIcon;
    text: string;
  };
  title: string;
  description: string;
  stats?: StatItem[];
  children?: ReactNode;
}

export function PageHeader({
  badge,
  title,
  description,
  stats,
  children,
}: PageHeaderProps) {
  const IconComponent = badge.icon;

  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-background via-muted/20 to-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6 md:mb-4">
          <Breadcrumb />
        </div>

        <div className="text-center mb-12">
          <Badge className="mb-4 bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800 text-lg px-4 py-2">
            <IconComponent className="h-4 w-4 mr-2" />
            {badge.text}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {title}
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {description}
          </p>

          {stats && stats.length > 0 && (
            <div
              className={`grid grid-cols-2 gap-6 max-w-2xl mx-auto ${
                stats.length === 3
                  ? "md:grid-cols-3"
                  : stats.length === 4
                    ? "md:grid-cols-4"
                    : stats.length === 2
                      ? "md:grid-cols-2"
                      : "md:grid-cols-4"
              }`}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
