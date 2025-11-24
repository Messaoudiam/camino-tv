import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  "bg-card text-card-foreground border-2 transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "shadow-lg hover:shadow-xl border-border hover:border-border/90 hover:scale-[1.01]",
        elevated:
          "shadow-xl hover:shadow-2xl border-border hover:border-border/100 hover:scale-[1.02]",
        interactive:
          "shadow-lg hover:shadow-2xl hover:scale-[1.03] cursor-pointer border-border hover:border-border/90",
        flat: "shadow-none border-border/50",
        feature:
          "shadow-xl border-border bg-gradient-to-br from-card to-card/50 hover:shadow-2xl hover:scale-[1.01]",
        deal: "shadow-lg hover:shadow-2xl hover:scale-[1.02] cursor-pointer overflow-hidden border-border",
        team: "shadow-xl hover:shadow-2xl overflow-hidden border-border bg-gradient-to-br from-card to-card/80 hover:scale-[1.01]",
      },
      size: {
        default: "rounded-lg",
        sm: "rounded-md",
        lg: "rounded-xl",
      },
      padding: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
        none: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      padding: "default",
    },
  },
);

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, size, padding, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, size, padding, className }))}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col space-y-1.5 px-6 py-4", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("absolute top-4 right-4", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
