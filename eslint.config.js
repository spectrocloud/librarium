const js = require("@eslint/js");
const globals = require("globals");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const promisePlugin = require("eslint-plugin-promise");
const nPlugin = require("eslint-plugin-n");
const mdxPlugin = require("eslint-plugin-mdx");
const prettierConfig = require("eslint-config-prettier");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: __dirname });

// Extract rules from legacy @typescript-eslint configs (not yet flat-config-native)
const tsEslintRecommendedRules = tsPlugin.configs["eslint-recommended"].overrides[0].rules;
const tsRecommendedRules = tsPlugin.configs["recommended"].rules;
const tsRecommendedTypeCheckedRules = tsPlugin.configs["recommended-type-checked"].rules;
const tsDisableTypeCheckedRules = tsPlugin.configs["disable-type-checked"].rules;

module.exports = [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      "build/**",
      "node_modules/**",
      "src/deprecated/**",
      ".docusaurus/**",
      "sidebar.js",
      "docusaurus.config.js",
      "*.config.js",
      "src/theme/SchemaItem/index.js",
      "src/theme/CodeBlock/**",
      "**/*.test.tsx",
      "**/*.test.ts",
      "**/*.bundle.js",
      "**/*.test.js",
      "**/*.test.jsx",
      "**/__mocks__/**",
      "jest.setup.ts",
    ],
  },

  // Base recommended JS rules for all files
  js.configs.recommended,

  // Promise best practices for all files
  promisePlugin.configs["flat/recommended"],

  // Base language options and globals for all files
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": "warn",
    },
  },

  // Import validation scoped to source files only
  // (MDX docs use Docusaurus module aliases that can't be statically resolved)
  // languageOptions.ecmaVersion is pinned to 2020 because FlatCompat injects
  // ecmaVersion: 2018 from plugin:import/recommended, which breaks optional chaining.
  ...compat.extends("plugin:import/recommended").map((c) => ({
    ...c,
    files: ["src/**/*.{js,jsx,ts,tsx}", "plugins/**/*.js", "utils/**/*.{js,ts}"],
    languageOptions: {
      ...c.languageOptions,
      ecmaVersion: 2020,
    },
  })),

  // React and accessibility rules scoped to source files
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      "react/prop-types": "off",
      // CSS modules (.module.css) and Docusaurus module aliases cannot be
      // resolved statically — disable rather than require a complex webpack config.
      "import/no-unresolved": "off",
    },
  },
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ...jsxA11yPlugin.flatConfigs.recommended,
  },

  // MDX flat config — enables MDX parsing and linting for docs content
  mdxPlugin.flat,

  // Disable rules that produce false positives in documentation MDX.
  // MDX components are provided via MDXProvider (no per-file imports needed),
  // and Docusaurus module aliases make import paths unresolvable statically.
  {
    files: ["**/*.{md,mdx}"],
    rules: {
      "react/jsx-no-undef": "off",
      "no-undef": "off",
      "no-unused-expressions": "off",
      "import/no-unresolved": "off",
      "import/no-duplicates": "off",
      "import/namespace": "off",
      "import/named": "off",
      "import/default": "off",
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
    },
  },

  // TypeScript files — type-checked linting
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true, experimentalObjectRestSpread: true },
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.eslint.json",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsEslintRecommendedRules,
      ...tsRecommendedRules,
      ...tsRecommendedTypeCheckedRules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Disable type-checked rules for plain JS/JSX files
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      ...tsDisableTypeCheckedRules,
    },
  },

  // Node.js rules scoped to Docusaurus plugins and utility scripts.
  // Plugin and rules are pulled from flat/recommended; sourceType is left
  // unset here so the base config's "module" sourceType applies — the files
  // in plugins/ and utils/ mix CJS require() and ESM import syntax.
  {
    files: ["plugins/**/*.js", "utils/**/*.js"],
    plugins: {
      n: nPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: nPlugin.configs["flat/recommended"].languageOptions.globals,
    },
    rules: {
      ...nPlugin.configs["flat/recommended"].rules,
      "n/no-unpublished-require": "off",
    },
  },

  // Prettier formatting overrides — must be last to disable conflicting rules
  prettierConfig,
];
