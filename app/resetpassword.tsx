import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Add useLocalSearchParams
import { Button, Input } from "@rneui/themed";
import { useForm, Field } from "@tanstack/react-form";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as Linking from "expo-linking"; // Import Linking
import { supabase } from "@/utils/supabase"; // Import supabase

export default function ResetPasswordScreen() {
  const router = useRouter();
  const localSearchParams = useLocalSearchParams(); // Add this line

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
      console.log("🚀 ~ onSubmit: ~ value:", value);
      await resetPasswordMutation.mutateAsync(value);
    },
    validators: {
      onChange: ({ value }) => {
        if (value.password !== value.confirmPassword) {
          return "Passwords do not match";
        }
        return undefined;
      },
    },
  });

  useEffect(() => {
    console.log(
      "🚀 ~ ResetPasswordScreen ~ localSearchParams:",
      localSearchParams,
    ); // Add this log

    // Extract parameters from localSearchParams
    const tokenFromRouter = localSearchParams.access_token as
      | string
      | undefined;
    const refreshTokenFromRouter = localSearchParams.refresh_token as
      | string
      | undefined;
    const typeFromRouter = localSearchParams.type as string | undefined;

    const handleDeepLink = async (url: string | null) => {
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

      // Prioritize parameters from expo-router if available
      const finalToken = tokenFromRouter || tokenFromUrl;
      const finalRefreshToken = refreshTokenFromRouter || refreshTokenFromUrl;
      const finalType = typeFromRouter || typeFromUrl;

      if (finalToken && finalRefreshToken && finalType === "recovery") {
        console.log("🚀 ~ handleDeepLink ~ type:", finalType);
        console.log("🚀 ~ handleDeepLink ~ refresh_token:", finalRefreshToken);
        console.log("🚀 ~ handleDeepLink ~ access_token:", finalToken);

        // Set the Supabase session
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: finalToken,
          refresh_token: finalRefreshToken,
        });

        if (setSessionError) {
          console.error("Error setting Supabase session:", setSessionError);
          setLoading(false);
          setError("Failed to set session. Please try again.");
          setMessage("There was an issue with your session. Please try again.");
          setTimeout(() => router.replace("/login"), 5000);
        } else {
          setLoading(false);
          setMessage("Please enter your new password.");
        }
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
  }, [router, localSearchParams]); // Depend on router and localSearchParams

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
        <Field
          name="password"
          form={form}
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return "Password is required";
              }
              if (value.length < 6) {
                return "Password must be at least 6 characters";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              placeholder="New Password"
              secureTextEntry
              value={field.state.value as string}
              onChangeText={(text) => field.handleChange(text)}
              onBlur={field.handleBlur}
              errorMessage={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors.join(", ")
                  : ""
              }
            />
          )}
        </Field>
        <Field
          name="confirmPassword"
          form={form}
          validators={{
            onChange: ({ value, fieldApi }) => {
              if (!value) {
                return "Confirm Password is required";
              }
              if (value !== fieldApi.form.getFieldValue("password")) {
                return "Passwords do not match";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <Input
              placeholder="Confirm New Password"
              secureTextEntry
              value={field.state.value as string}
              onChangeText={(text) => field.handleChange(text)}
              onBlur={field.handleBlur}
              errorMessage={
                field.state.meta.errors.length > 0
                  ? field.state.meta.errors.join(", ")
                  : ""
              }
            />
          )}
        </Field>
        <Button
          title="Reset Password"
          onPress={() => form.handleSubmit()}
          loading={resetPasswordMutation.isPending}
          disabled={!form.state.isValid}
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
