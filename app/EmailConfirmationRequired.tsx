import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthenticationProvider";
import { ResultAsync, ok, err } from "neverthrow";
import { reportError } from "../utils/reportError";

export default function EmailConfirmationRequired() {
  const router = useRouter();
  const { session, resetPasswordMutation } = useAuth();

  const handleResendEmail = () => {
    if (session && session.user && session.user.email) {
      const email = session.user.email;
      const mutationPromise = new Promise((resolve, reject) => {
        try {
          resetPasswordMutation.mutate({ email });
          resolve(ok("Success"));
        } catch (error) {
          reject(err(error));
        }
      });

      ResultAsync.fromPromise(mutationPromise, (error) =>
        err(new Error(String(error))),
      ).then((result) => {
        if (result.isErr()) {
          reportError(result.error);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>
        Please confirm your email address to continue. We have sent a
        confirmation link to your email.
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
});
