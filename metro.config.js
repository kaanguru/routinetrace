const { getSentryExpoConfig } = require("@sentry/react-native/metro");

module.exports = (() => {
  const config = getSentryExpoConfig(__dirname);

  // Temporary fix for Node.js module resolution issue
  config.resolver.unstable_enablePackageExports = false;

  return config;
})();
