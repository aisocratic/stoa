import js from "@eslint/js"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist/**", "site/.next/**", "site/out/**", "site/test-results/**"] },
  js.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "jsx-a11y": jsxA11y, "react-hooks": reactHooks },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      ...reactHooks.configs["flat/recommended"].rules,
      "@typescript-eslint/no-explicit-any": "error",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["tabpanel", "region"] }],
    },
  },
  {
    files: ["site/tests/**/*", "tests/**/*"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
)
