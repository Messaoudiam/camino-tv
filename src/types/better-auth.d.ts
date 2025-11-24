/**
 * Better Auth Type Declarations
 * Extends Better Auth types to include custom fields
 */

import "better-auth";
import "better-auth/react";

declare module "better-auth" {
  interface User {
    role: "USER" | "ADMIN";
  }
}

declare module "better-auth/react" {
  interface User {
    role: "USER" | "ADMIN";
  }
}
