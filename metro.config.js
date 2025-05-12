// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Temporary fix for Node.js module resolution issue
  config.resolver.unstable_enablePackageExports = false;

  return config;
})();
