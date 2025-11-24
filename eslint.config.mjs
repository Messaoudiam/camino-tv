import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript - minimal, juste l'essentiel
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "off", // OK pour du prototypage

      // React - juste les vraies erreurs
      "react/jsx-key": "error",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off", // Shadcn components souvent

      // Erreurs critiques seulement
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",

      // Pas de style forcing - laisse Prettier gérer
      indent: "off",
      quotes: "off",
      semi: "off",
      "comma-dangle": "off",
      "object-curly-spacing": "off",
      "array-bracket-spacing": "off",

      // Console OK pour dev
      "no-console": "off",

      // Next.js essentials
      "@next/next/no-img-element": "warn",
    },
  },
];

export default eslintConfig;
