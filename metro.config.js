const { getDefaultConfig } = require('expo/metro-config');
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// First get the default Expo config
const expoConfig = getDefaultConfig(__dirname);

// Then merge with Sentry config
const config = getSentryExpoConfig(__dirname, expoConfig);

module.exports = config;
