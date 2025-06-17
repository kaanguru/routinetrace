import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

let isConfigured = false;

/**
 * Configures Google Sign-In synchronously
 * @returns true if configured successfully, false otherwise
 */
export function configureGoogleSignIn(): boolean {
  if (isConfigured) return true;
  
  try {
    let webClientId = Constants.expoConfig?.extra?.googleWebClientId;
    
    // Fallback to environment variable if not found in expoConfig
    if (!webClientId) {
      webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    }
    
    if (!webClientId) {
      console.error("Google Web Client ID not found in eas.json or environment variables");
      return false;
    }
    
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
      scopes: ["profile", "email"],
    });
    
    isConfigured = true;
    return true;
  } catch (error) {
    console.error("Google Sign-In configuration failed:", error);
    return false;
  }
}

/**
 * Manual configuration fallback
 * @param webClientId - Google Web Client ID
 * @returns true if configured successfully, false otherwise
 */
export function manualConfigure(webClientId: string): boolean {
  try {
    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
      scopes: ["profile", "email"],
    });
    
    isConfigured = true;
    return true;
  } catch (error) {
    console.error("Manual Google Sign-In configuration failed:", error);
    return false;
  }
}
