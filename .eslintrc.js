// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: "expo",
  plugins: ["neverthrow"],
  rules: {
    "neverthrow/must-use-result": "warning",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ["/dist/*"],
};
