"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Send, Check, AlertCircle, Loader2 } from "lucide-react";
import {
  contactFormSchema,
  type ContactFormData,
  type ContactFormErrors,
  formatZodErrors,
} from "@/lib/validations/contact";
import { z } from "zod";

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });

  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Validation sécurisée avec Zod
  const validateField = (
    name: keyof ContactFormData,
    value: string | undefined,
  ): string | undefined => {
    try {
      const fieldSchema = contactFormSchema.shape[name];
      fieldSchema.parse(value);
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues[0]?.message;
      }
      return "Erreur de validation";
    }
  };

  const handleInputChange = (name: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validation en temps réel
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));

    // Reset submit status si on modifie après succès
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = formatZodErrors(error);
        setErrors(formattedErrors);
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Validation finale côté client avec Zod
      const validatedData = contactFormSchema.parse(formData);

      // Envoi à l'API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi");
      }

      setSubmitStatus("success");

      // Reset du formulaire après succès
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          category: "general",
          message: "",
        });
        setSubmitStatus("idle");
      }, 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: "general", label: "Question générale" },
    { value: "partnership", label: "Partenariat" },
    { value: "collaboration", label: "Collaboration" },
    { value: "technical", label: "Support technique" },
    { value: "press", label: "Relations presse" },
    { value: "other", label: "Autre" },
  ];

  return (
    <Card className="w-full border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-foreground">
          Envoyez-nous un message
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Remplissez le formulaire ci-dessous et nous vous répondrons dans les
          plus brefs délais.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitStatus === "success" && (
          <Alert className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              Votre message a été envoyé avec succès ! Nous vous répondrons
              bientôt.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Une erreur s'est produite lors de l'envoi. Veuillez réessayer.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                Prénom *
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Votre prénom"
                className={
                  errors.firstName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
                maxLength={50}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Nom *
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Votre nom"
                className={
                  errors.lastName
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
                disabled={isSubmitting}
                maxLength={50}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Adresse email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="votre.email@exemple.com"
              className={
                errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              disabled={isSubmitting}
              maxLength={254}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Catégorie *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                handleInputChange(
                  "category",
                  value as ContactFormData["category"],
                )
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={
                  errors.category
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Sujet */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium">
              Sujet *
            </Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="Résumez brièvement votre demande"
              className={
                errors.subject
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              disabled={isSubmitting}
              maxLength={100}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Décrivez votre demande en détail..."
              rows={6}
              className={
                errors.message
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
              disabled={isSubmitting}
              maxLength={2000}
            />
            <div className="flex justify-between items-center">
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
              <p className="text-xs text-muted-foreground ml-auto">
                {formData.message.length}/2000 caractères
              </p>
            </div>
          </div>

          <Separator />

          {/* Bouton d'envoi */}
          <Button
            type="submit"
            className="w-full bg-brand-500 hover:bg-brand-600 text-white"
            disabled={isSubmitting || submitStatus === "success"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : submitStatus === "success" ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Message envoyé !
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Envoyer le message
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            * Champs obligatoires. Vos données sont protégées et ne seront
            jamais partagées.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
