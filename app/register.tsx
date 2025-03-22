// app/register.tsx
import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";
import { useAuth } from "@/context/AuthenticationProvider";

export default function Register() {
  const router = useRouter();
  const { signUpWithEmail, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = useCallback((): string | null => {
    if (password !== confirmPassword) {
      return "The passwords you entered do not match.";
    }
    if (email.length < 5 || !email.includes("@")) {
      return "Please enter a valid email address.";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    return null;
  }, [email, password, confirmPassword]);

  const handleRegister = useCallback(async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert("Validation Error", validationError);
      return;
    }

    setLoading(true);
    const signUpResult = await signUpWithEmail({ email, password });

    signUpResult.match(
      () => {
        console.log("Registration successful!");
        setLoading(false);
      },
      (transformedError) => {
        Alert.alert("Register Failed", transformedError.message);
      }
    );
  }, [email, password, signUpWithEmail, validateForm]);

  const styles = StyleSheet.create({
    button: {
      marginTop: 8,
      backgroundColor: "#00173D", // Use a color from your theme or a direct hex code
      borderRadius: 5,
    },
    buttonText: {
      textAlign: "center",
      color: "#FFFAEB", // Use a color from your theme or a direct hex code
    },
    text: {
      marginBottom: 2,
      color: "#00173D", // Use a color from your theme or a direct hex code
    },
  });

  return (
    <View>
      <LogoPortrait scale={0.3} />
      <Text>Create Account</Text>
      {loading || authLoading ? <ActivityIndicator /> : null}

      <View>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Input
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Input
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button
          title="Register"
          disabled={loading || authLoading}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          onPress={handleRegister}
        />
        <Text style={{ color: "red" }}>Already have an account? </Text>

        <Button
          title="Login"
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
          onPress={() => router.push("/login")}
        />
      </View>
    </View>
  );
}
