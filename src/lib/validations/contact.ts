import { z } from "zod";

// Schéma de validation pour le formulaire de contact
export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Minimum 2 caractères")
    .max(50, "Maximum 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Caractères alphabétiques uniquement")
    .transform((val) => val.trim()),

  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Minimum 2 caractères")
    .max(50, "Maximum 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Caractères alphabétiques uniquement")
    .transform((val) => val.trim()),

  email: z
    .string()
    .min(1, "L'email est requis")
    .max(254, "Email trop long")
    .email("Format d'email invalide")
    .transform((val) => val.trim().toLowerCase()),

  subject: z
    .string()
    .min(1, "Le sujet est requis")
    .min(5, "Minimum 5 caractères")
    .max(100, "Maximum 100 caractères")
    .transform((val) => val.trim()),

  category: z.enum(
    ["general", "partnership", "collaboration", "technical", "press", "other"],
    {
      message: "Veuillez sélectionner une catégorie",
    },
  ),

  message: z
    .string()
    .min(1, "Le message est requis")
    .min(20, "Minimum 20 caractères")
    .max(2000, "Maximum 2000 caractères")
    .transform((val) => val.trim()),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Schéma pour validation côté serveur avec protection supplémentaire
export const serverContactFormSchema = contactFormSchema.extend({
  // Protection contre les attaques XSS et injection
  firstName: contactFormSchema.shape.firstName.refine(
    (val) => !/<[^>]*>/.test(val),
    "HTML non autorisé",
  ),

  lastName: contactFormSchema.shape.lastName.refine(
    (val) => !/<[^>]*>/.test(val),
    "HTML non autorisé",
  ),

  subject: contactFormSchema.shape.subject.refine(
    (val) => !/<[^>]*>/.test(val),
    "HTML non autorisé",
  ),

  message: contactFormSchema.shape.message
    .refine((val) => !/<[^>]*>/.test(val), "HTML non autorisé")
    .refine(
      (val) => !/(javascript:|data:|vbscript:)/i.test(val),
      "Contenu dangereux détecté",
    ),
});

// Type pour les erreurs de validation
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

// Helper pour convertir les erreurs Zod en format utilisable
export function formatZodErrors(error: z.ZodError): ContactFormErrors {
  const errors: ContactFormErrors = {};

  error.issues.forEach((err: z.ZodIssue) => {
    if (err.path.length > 0) {
      const field = err.path[0] as keyof ContactFormData;
      errors[field] = err.message;
    }
  });

  return errors;
}
