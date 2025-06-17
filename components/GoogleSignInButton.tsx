import React, { useState } from "react";
import { Button } from "@rneui/themed";
import { useAuth } from "~/context/AuthenticationProvider";
import { Alert } from "react-native";

export default function GoogleSignInButton() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      result.match(
        () => {
          // Success - session is automatically handled
        },
        (error) => {
          console.error(error.message);
          Alert.alert(
            "Sign-In Failed",
            error.message || "Could not sign in with Google",
          );
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert(
        "Unexpected Error",
        "An unexpected error occurred during sign-in",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      title="Sign in with Google"
      onPress={handlePress}
      buttonStyle={{ backgroundColor: "#4285F4" }}
      icon={{
        name: "google",
        type: "font-awesome",
        color: "white",
      }}
      iconContainerStyle={{ marginRight: 10 }}
      titleStyle={{ fontWeight: "bold" }}
      loading={loading}
      disabled={loading}
    />
  );
}
