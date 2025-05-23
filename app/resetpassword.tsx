import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Button, Input } from "@rneui/themed";
import { useForm, Field } from "@tanstack/react-form";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as Linking from "expo-linking"; // Import Linking

export default function ResetPasswordScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetPasswordMutation = useResetPasswordMutation();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      await resetPasswordMutation.mutateAsync(value);
    },
  });

  useEffect(() => {
    const handleDeepLink = (url: string | null) => {
      console.log("🚀 ~ handleDeepLink ~ url:", url);

      let tokenFromUrl: string | undefined;
      let refreshTokenFromUrl: string | undefined;
      let typeFromUrl: string | undefined;

      if (url) {
        try {
          const parsedUrl = new URL(url);
          // Supabase often puts tokens in the fragment for password reset
          if (parsedUrl.hash) {
            const fragmentParams = new URLSearchParams(
              parsedUrl.hash.substring(1),
            ); // Remove '#'
            tokenFromUrl = fragmentParams.get("access_token") || undefined;
            refreshTokenFromUrl =
              fragmentParams.get("refresh_token") || undefined;
            typeFromUrl = fragmentParams.get("type") || undefined;
          }
        } catch (e) {
          console.error("Error parsing deep link URL:", e);
        }
      }

      if (tokenFromUrl && refreshTokenFromUrl && typeFromUrl === "recovery") {
        console.log("🚀 ~ handleDeepLink ~ type:", typeFromUrl);
        console.log(
          "🚀 ~ handleDeepLink ~ refresh_token:",
          refreshTokenFromUrl,
        );
        console.log("🚀 ~ handleDeepLink ~ access_token:", tokenFromUrl);
        setLoading(false);
        setMessage("Please enter your new password.");
      } else {
        setLoading(false);
        setError("Invalid password reset link.");
        setMessage("The password reset link is invalid or has expired.");
        setTimeout(() => router.replace("/login"), 5000);
      }
    };

    // Handle initial deep link when the app is launched
    Linking.getInitialURL().then((url) => {
      handleDeepLink(url);
    });

    // Handle deep links when the app is already running
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    // Clean up the event listener
    return () => {
      subscription.remove();
    };
  }, [router]); // Depend only on router

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.messageText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.messageText}>{message}</Text>

      {/* Password Reset Form */}
      <View style={styles.formContainer}>
        <Field name="password" form={form}>
          {(field) => (
            <Input
              placeholder="New Password"
              secureTextEntry
              value={field.state.value as string}
              onChangeText={(text) => field.handleChange(text)}
              onBlur={field.handleBlur}
              errorMessage={
                field.state.meta.errors
                  ? JSON.stringify(field.state.meta.errors)
                  : ""
              }
            />
          )}
        </Field>
        <Field name="confirmPassword" form={form}>
          {(field) => (
            <Input
              placeholder="Confirm New Password"
              secureTextEntry
              value={field.state.value as string}
              onChangeText={(text) => field.handleChange(text)}
              onBlur={field.handleBlur}
              errorMessage={
                field.state.meta.errors
                  ? JSON.stringify(field.state.meta.errors)
                  : ""
              }
            />
          )}
        </Field>
        <Button
          title="Reset Password"
          onPress={() => form.handleSubmit()}
          loading={resetPasswordMutation.isPending}
        />
      </View>

      {/* Display mutation error messages */}
      {resetPasswordMutation.isError && (
        <Text style={styles.errorText}>
          Failed to reset password: {resetPasswordMutation.error.message}
        </Text>
      )}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
});
