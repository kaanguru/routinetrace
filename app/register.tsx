// app/register.tsx
import { Button, Text, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import React, { useState, useCallback } from "react";
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";
import { useAuth } from "@/context/AuthenticationProvider";
import Background from "@/components/Background";
import { head } from "ramda";

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
    registerButton: {
      backgroundColor: "#00173D",
    },
    buttonText: {
      color: "#FFFAEB",
    },
    heading: {
      marginHorizontal: "auto",
      fontFamily: "Ubuntu_400Regular",
      fontSize: 36,
      paddingHorizontal: 80,
      textAlign: "center",
      color: "#3E0C83",
    },
  });

  return (
    <Background>
      <LogoPortrait scale={0.2} style={{ transform: [{ rotate: "60deg" }] }} />
      <Text style={styles.heading}>Create Account</Text>
      {loading || authLoading ? <ActivityIndicator /> : null}

      <View style={{ marginTop: 10 }}>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <View style={{ marginTop: 20 }}>
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
            buttonStyle={styles.registerButton}
            titleStyle={styles.buttonText}
            onPress={handleRegister}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text
            h4
            style={{
              textAlign: "center",
              textAlignVertical: "center",
            }}
          >
            Already have an account?{" "}
          </Text>

          <Button
            title="Login"
            onPress={() => router.push("/login")}
            type="clear"
            titleStyle={{
              fontSize: 14,
              fontFamily: "Ubuntu_700Bold",
            }}
          />
        </View>
      </View>
    </Background>
  );
}
