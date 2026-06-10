import nextConfig from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const config = [
  ...nextConfig,
  ...nextTs,
  {
    settings: {
      react: { version: "19" },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      // eslint-plugin-react v7 is incompatible with ESLint 10 flat config — crashes on getFilename()
      "react/display-name": "off",
    },
  },
]

export default config
