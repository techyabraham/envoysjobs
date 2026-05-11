module.exports = {
  extends: ["../../packages/config/eslint.cjs"],
  ignorePatterns: ["dist", "node_modules"],
  env: {
    node: true
  },
  settings: {
    react: {
      version: "18.3"
    }
  },
  rules: {
    "react-hooks/rules-of-hooks": "off"
  }
};
