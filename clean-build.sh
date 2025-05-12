# Clean up previous build artifacts
rm -rf node_modules
rm -rf android
rm -rf .expo
rm -f pnpm-lock.yaml
echo "Cleaning pnpm cache..."
pnpm store prune
# Install dependencies
pnpm install

# Regenerate Android files
pnpm expo prebuild -p android --clean

# Build again
pnpm android:build