#!/bin/bash
# Build Android APK using EAS Build locally

# Create output directory

# Run EAS build command with error handling
npx eas build --platform android --profile preview --local --output ./dist/android/local/preview-app.apk && \
echo "✅ Build completed successfully. APK saved to: ./dist/android/local/preview-app.apk" || \
echo "❌ Build failed. Check logs for errors"