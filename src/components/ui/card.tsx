import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-card text-card-foreground border border-border/20 transition-all duration-200",
  {
    variants: {
      variant: {
        default: "shadow-elevation-1 hover:shadow-elevation-2 border-border/30",
        elevated: "shadow-elevation-2 hover:shadow-elevation-3 border-border/40",
        interactive: "shadow-elevation-1 hover:shadow-elevation-3 hover:scale-[1.02] cursor-pointer border-border/30 hover:border-border/50",
        flat: "shadow-none border-border/50",
        feature: "shadow-elevation-2 border-border/30 bg-gradient-to-br from-card to-card/50",
        deal: "shadow-elevation-1 hover:shadow-elevation-3 hover:scale-[1.01] cursor-pointer overflow-hidden border-border/40",
        team: "shadow-elevation-2 hover:shadow-elevation-3 overflow-hidden border-border/60 bg-gradient-to-br from-card to-card/80",
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
  }
)

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
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col space-y-1.5 px-6 py-4",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "absolute top-4 right-4",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6", className)}
      {...props}
    />
  )
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
}
