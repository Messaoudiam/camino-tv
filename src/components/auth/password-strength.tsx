"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Password Strength Indicator
 * Visual feedback for password requirements
 */

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: "Au moins 8 caractères",
    test: (pwd) => pwd.length >= 8,
  },
  {
    label: "Une majuscule (A-Z)",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    label: "Une minuscule (a-z)",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    label: "Un chiffre (0-9)",
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    label: "Un caractère spécial (!@#$...)",
    test: (pwd) => /[^A-Za-z0-9]/.test(pwd),
  },
];

function calculateStrength(password: string): number {
  if (!password) return 0;

  const passedRequirements = requirements.filter((req) =>
    req.test(password),
  ).length;
  return (passedRequirements / requirements.length) * 100;
}

function getStrengthColor(strength: number): string {
  if (strength < 40) return "bg-destructive";
  if (strength < 80) return "bg-orange-500";
  return "bg-green-500";
}

function getStrengthLabel(strength: number): string {
  if (strength === 0) return "Aucun";
  if (strength < 40) return "Faible";
  if (strength < 80) return "Moyen";
  return "Fort";
}

export function PasswordStrength({ password }: { password: string }) {
  const strength = calculateStrength(password);
  const strengthColor = getStrengthColor(strength);
  const strengthLabel = getStrengthLabel(strength);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Force du mot de passe
          </span>
          <span
            className={cn(
              "text-xs font-semibold",
              strength < 40 && "text-destructive",
              strength >= 40 && strength < 80 && "text-orange-500",
              strength >= 80 && "text-green-600",
            )}
          >
            {strengthLabel}
          </span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-300", strengthColor)}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      <ul className="space-y-1.5">
        {requirements.map((requirement, index) => {
          const isPassed = password ? requirement.test(password) : false;

          return (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 text-xs transition-colors",
                isPassed ? "text-green-600" : "text-muted-foreground",
              )}
            >
              {isPassed ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              <span>{requirement.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
