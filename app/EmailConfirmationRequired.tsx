import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "@rneui/themed";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthenticationProvider";
import { ResultAsync } from "neverthrow";
import { reportError } from "../utils/reportError";

export default function EmailConfirmationRequired() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { pendingEmail, resetPasswordMutation } = useAuth();
  const email = pendingEmail || (params?.email as string | undefined);

  const handleResendEmail = () => {
    if (email) {
      ResultAsync.fromPromise(
        resetPasswordMutation.mutateAsync({ email }),
        (e) =>
          new Error(
            `Failed to resend confirmation email: ${e instanceof Error ? e.message : String(e)}`,
          ),
      ).then((result) => {
        if (result.isOk()) {
          Alert.alert(
            "Email Sent",
            "A new confirmation email has been sent. Please check your inbox.",
          );
          console.log("Confirmation email resent successfully.");
        } else {
          // result.isErr() is true
          reportError(result); // Pass the entire Err Result to reportError
          Alert.alert("Error", result.error.message);
        }
      });
    }
  };

  if (!email) {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>
          Unable to retrieve email address. Please try registering again.
        </Text>
        <Button
          title="Back to Register"
          onPress={() => router.push("/register")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        Please confirm your email address to continue. We have sent a
        confirmation link to <Text style={styles.emailText}>{email}</Text>.
      </Text>
      <Text style={styles.subText}>
        If you did not receive the email, check your spam folder or try
        resending it.
      </Text>
      <Button title="Resend Confirmation Email" onPress={handleResendEmail} />
      <Button title="Back to Login" onPress={() => router.push("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mainText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },
  emailText: {
    fontWeight: "bold",
    color: "#007bff", // Or your app's primary color
  },
});
