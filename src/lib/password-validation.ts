/**
 * Password Validation Utilities
 * Shared validation logic between client and server
 */

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Le mot de passe doit contenir au moins 8 caractères");
  }

  if (password.length > 128) {
    errors.push("Le mot de passe ne doit pas dépasser 128 caractères");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une majuscule");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une minuscule");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un chiffre");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push(
      "Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...)",
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Common weak passwords to block
 */
const COMMON_PASSWORDS = [
  "password",
  "password123",
  "12345678",
  "qwerty123",
  "azerty123",
  "admin123",
  "camino123",
];

export function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some((common) => lowerPassword.includes(common));
}

/**
 * Check if password contains user's personal info
 */
export function containsPersonalInfo(
  password: string,
  email?: string,
  name?: string,
): boolean {
  const lowerPassword = password.toLowerCase();

  if (email) {
    const username = email.split("@")[0].toLowerCase();
    if (username.length >= 4 && lowerPassword.includes(username)) {
      return true;
    }
  }

  if (name) {
    const nameParts = name.toLowerCase().split(" ");
    for (const part of nameParts) {
      if (part.length >= 4 && lowerPassword.includes(part)) {
        return true;
      }
    }
  }

  return false;
}
