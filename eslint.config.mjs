import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier/flat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

/**
 * Flat ESLint config for the compacto-ui workspace (ESLint v9+).
 *
 * Ported from waux-ai-studio's config with the Next.js presets swapped for
 * plain `typescript-eslint` + `eslint-plugin-react` + `eslint-plugin-react-hooks`
 * — this is a framework-agnostic library, not a Next app. Two deliberate
 * divergences from the app config:
 *
 *  1. **`react-hooks/*` stays ON.** waux disables every hooks rule. That is
 *     survivable in an app you control end to end; in a published library a
 *     conditional hook call becomes someone else's crash.
 *  2. **`packages/ui/src/components/**` gets two extra gates** — no string
 *     literals in JSX (§i18n: every user-visible string is a prop with an
 *     English default) and no `forwardRef` (React 19 passes `ref` as a plain
 *     prop).
 *
 * @type {import("eslint").Linter.Config[]}
 */
const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  {
    ...react.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },
  react.configs.flat["jsx-runtime"],
  prettier,
  {
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      "react-hooks": reactHooks,
    },
    rules: {
      // --- Unused imports and variables ---
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",

      // --- Import sorting and organization ---
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",

      // --- General code quality ---
      "prefer-const": "warn",
      "no-var": "warn",
      eqeqeq: ["warn", "always"],
      curly: ["warn", "all"],

      // --- React ---
      "react/jsx-key": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-undef": "warn",
      "react/self-closing-comp": "warn",
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",

      // --- React hooks: ON, unlike the consuming apps ---
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Library primitives only. These two rules are the mechanical guards
    // behind the i18n contract and the zero-forwardRef rule.
    files: ["packages/ui/src/components/**/*.tsx"],
    rules: {
      // Every user-visible string must arrive as a prop with an English
      // default — a published library cannot reach an app's `t()`. Default
      // PARAMETER values are fine; a string typed as JSX text is not.
      //
      // `ignoreProps: true` is deliberate. Prop values are where `data-slot`,
      // `className` and every other structural string lives; checking them
      // would flag the entire library and teach everyone to disable the rule.
      // Rendered text is the thing a user actually reads, so that is what
      // this guards.
      "react/jsx-no-literals": [
        "error",
        { noStrings: true, ignoreProps: true },
      ],
      // React 19 passes `ref` as an ordinary prop. `forwardRef` in a library
      // only adds a wrapper component that breaks `data-slot` introspection.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "MemberExpression[object.name='React'][property.name='forwardRef']",
          message:
            "React 19 passes `ref` as a plain prop — do not use forwardRef in library primitives.",
        },
        {
          selector: "ImportSpecifier[imported.name='forwardRef']",
          message:
            "React 19 passes `ref` as a plain prop — do not use forwardRef in library primitives.",
        },
      ],
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/tests/**/*.{ts,tsx}"],
    rules: { "react/jsx-no-literals": "off" },
  },
  // Flat-config ignores resolve against the config file's own directory, so a
  // bare "dist/**" would only ever match a dist at the repo root — every
  // package's build output would still be linted. The `**/` prefix is what
  // makes these reach into packages/ and apps/.
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/coverage/**",
    "**/node_modules/**",
    "**/next-env.d.ts",
  ]),
]);

export default eslintConfig;
