import "eslint-plugin-only-warn";
// @ts-ignore
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
// @ts-ignore
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import svelteParser from "svelte-eslint-parser";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  // @ts-ignore
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  //   react.configs.flat.recommended,
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { react },
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
        sveltify: true,
        hooks: true,
        react: true,
      },
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        extraFileExtensions: [".svelte"],
        project: `tsconfig.eslint.json`,
        ecmaFeatures: {},
      },
    },
  },
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_+$" },
      ],
      curly: "warn",
      eqeqeq: "warn",
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      "no-useless-rename": "warn",
      "object-shorthand": "warn",
      "prefer-template": "warn",
      "svelte/block-lang": ["warn", { script: "ts" }],
      "svelte/no-at-html-tags": "off",
      "@typescript-eslint/no-unsafe-call": 0,
      "@typescript-eslint/no-unsafe-return": 0,
      "@typescript-eslint/no-unsafe-argument": 0,
    },
  },
  {
    files: ["src/routes/**/*.ts", "src/routes/**/*.svelte"],
    rules: {
      // ESLint is not aware of the generated ./$types and reports false positives
      "@typescript-eslint/no-unsafe-argument": 0,
      "@typescript-eslint/no-unsafe-call": 0,
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      // Allow require() in CommonJS modules.
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: [
      ".svelte-kit",
      ".vercel",
      "build",
      "node_modules",
      "package",
      "vite.config.ts.timestamp-*.mjs",
      "src/global.d.ts",
      "src/tests/reactify.spec.tsx",
      "src/tests/fixtures/Binding.svelte",
      "src/lib/internal/ReactWrapper.svelte",
      "src/demo/components/Button.svelte",
    ],
  },
);
