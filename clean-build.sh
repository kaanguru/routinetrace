#!/bin/bash

# Start build timing
START_TIME=$(date +%s)
echo "🚀 Starting clean build process at $(date)"

# Validate critical config files
echo "📋 Validating configuration files..."
if [ ! -f "app.json" ]; then
    echo "ERROR: app.json not found"
    exit 1
fi
if [ ! -f "eas.json" ]; then
    echo "ERROR: eas.json not found"
    exit 1
fi
if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found"
    exit 1
fi
echo "✓ Configuration files validated"

# Check available disk space
echo "💾 Checking disk space..."
AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
if [ "$AVAILABLE_SPACE" -lt 2000000 ]; then  # Less than 2GB
    echo "⚠️  WARNING: Low disk space detected (less than 2GB available)"
fi

# Clear Watchman cache (if installed)
if command -v watchman &> /dev/null; then
    echo "👁️  Clearing Watchman cache..."
    watchman watch-del-all 2>/dev/null || true
    echo "✓ Watchman cache cleared"
fi

# Clear Metro bundler cache
echo "🚇 Clearing Metro cache..."
rm -rf /tmp/react-*
rm -rf /tmp/metro-*
rm -rf /tmp/haste-map-*
echo "✓ Metro cache cleared"

# Clean up previous build artifacts
echo "🧹 Removing node_modules..."
rm -rf node_modules
if [ -d "node_modules" ]; then
    echo "ERROR: node_modules still exists!"
    exit 1
else
    echo "✓ node_modules successfully removed"
fi

echo "🧹 Removing all android folder..."
rm -rf android
if [ -d "android" ]; then
    echo "ERROR: android folder still exists!"
    exit 1
else
    echo "✓ android folder successfully removed"
fi

echo "🧹 Removing .expo folder..."
rm -rf .expo
if [ -d ".expo" ]; then
    echo "ERROR: .expo folder still exists!"
    exit 1
else
    echo "✓ .expo folder successfully removed"
fi

echo "🧹 Removing pnpm-lock.yaml..."
rm -f pnpm-lock.yaml
if [ -f "pnpm-lock.yaml" ]; then
    echo "ERROR: pnpm-lock.yaml still exists!"
    exit 1
else
    echo "✓ pnpm-lock.yaml successfully removed"
fi

# Clear additional temporary files
echo "🧹 Removing additional temporary files..."
rm -rf /tmp/react-native-*
rm -rf ~/.expo/cache 2>/dev/null || true
echo "✓ Additional temporary files cleared"

echo "🧹 Cleaning pnpm cache..."
pnpm store prune
sleep 1
echo "✓ pnpm cache cleaned"


# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Regenerate Android files
echo "🤖 Regenerating Android files..."
pnpm expo prebuild -p android --clean

# Copy sentry.properties to android folder
echo "📋 Copying sentry.properties to android folder..."
if [ -f "sentry.properties" ] && [ -d "android" ]; then
    cp sentry.properties android/
    if [ -f "android/sentry.properties" ]; then
        echo "✓ sentry.properties successfully copied to android folder"
    else
        echo "ERROR: Failed to copy sentry.properties to android folder"
        exit 1
    fi
else
    if [ ! -f "sentry.properties" ]; then
        echo "ERROR: sentry.properties file not found in root directory"
        exit 1
    fi
    if [ ! -d "android" ]; then
        echo "ERROR: android folder not found after prebuild"
        exit 1
    fi
fi

# Clear any existing Android build artifacts
if [ -d "android/app/build" ]; then
    echo "🧹 Clearing existing Android build artifacts..."
    rm -rf android/app/build
    echo "✓ Android build artifacts cleared"
fi

sleep 1


# Build again
echo "🔨 Starting Android build..."
pnpm android:build:timed

# Calculate and display build time
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo "🎉 Clean build process completed!"
echo "⏱️  Total time: ${MINUTES}m ${SECONDS}s"
echo "📅 Finished at: $(date)"
