# Configuration Directory

Place your Google Services configuration files here:
- `google-services.json` for Android
- `GoogleService-Info.plist` for iOS (if applicable)

## Obtaining google-services.json:
1. Go to Firebase Console → Project Settings → Your Apps
2. Select Android app and download config file
3. Rename to `google-services.json` and place in this directory

**Important**: Keep this directory but add `config/*.json` to .gitignore to avoid committing sensitive credentials.
