module.exports = {
  env: {
    browser: true,
    es2015: true,
    node: true,
  },
  settings: {
    "import/resolver": "webpack",
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  overrides: [
    {
      files: ["./**/*.{ts,tsx}"],
      env: { browser: true, es6: true, node: true },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: { jsx: true, experimentalObjectRestSpread: true },
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.eslint.json",
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
      },
      overrides: [
        {
          files: ["*.js", "*.jsx"],
          extends: ["plugin:@typescript-eslint/disable-type-checked"],
        },
      ],
    },
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
  },
  plugins: ["react"],
  rules: {
    "no-unused-vars": 1,
    "react/prop-types": 0,
  },
};
