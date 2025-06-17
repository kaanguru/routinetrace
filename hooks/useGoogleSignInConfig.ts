import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";

export default function useGoogleSignInConfig() {
  useEffect(() => {
    const configureGoogleSignIn = async () => {
      try {
        const webClientId = Constants.expoConfig?.extra?.googleWebClientId;
        
        if (!webClientId) {
          throw new Error(
            "Google Web Client ID is not configured in eas.json. " +
            "Please add it to the \"extra\" section."
          );
        }

        await GoogleSignin.configure({
          webClientId,
          offlineAccess: true,
          scopes: ["profile", "email"],
        });
        
        console.log("Google Sign-In successfully configured");
      } catch (error) {
        console.error("Google Sign-In configuration failed:", error);
      }
    };

    configureGoogleSignIn();
  }, []);
}
