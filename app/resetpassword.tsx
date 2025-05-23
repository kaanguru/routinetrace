import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Add useLocalSearchParams
import { Button, Input } from "@rneui/themed";
import { useForm, Field } from "@tanstack/react-form";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as Linking from "expo-linking";
import { supabase } from "@/utils/supabase";
import { ok, ResultAsync } from "neverthrow";
import { reportError } from "@/utils/reportError";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const localSearchParams = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<Error | null>(null); // Changed type to Error | null

  const resetPasswordMutation = useResetPasswordMutation();

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
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
    const tokenFromRouter = localSearchParams.access_token as
      | string
      | undefined;
    const refreshTokenFromRouter = localSearchParams.refresh_token as
      | string
      | undefined;
    const typeFromRouter = localSearchParams.type as string | undefined;

    const handleDeepLink = async (url: string | null): Promise<void> => {
      const processLinkResult = await ResultAsync.fromPromise(
        (async () => {
          let tokenFromUrl: string | undefined;
          let refreshTokenFromUrl: string | undefined;
          let typeFromUrl: string | undefined;

          if (url) {
            try {
              const parsedUrl = new URL(url);
              if (parsedUrl.hash) {
                const fragmentParams = new URLSearchParams(
                  parsedUrl.hash.substring(1),
                );
                tokenFromUrl = fragmentParams.get("access_token") || undefined;
                refreshTokenFromUrl =
                  fragmentParams.get("refresh_token") || undefined;
                typeFromUrl = fragmentParams.get("type") || undefined;
              }
            } catch (e) {
              console.error("Error parsing deep link URL:", e);
              throw new Error("Error parsing deep link URL.");
            }
          }

          const finalToken = tokenFromRouter || tokenFromUrl;
          const finalRefreshToken =
            refreshTokenFromRouter || refreshTokenFromUrl;
          const finalType = typeFromRouter || typeFromUrl;

          if (finalToken && finalRefreshToken && finalType === "recovery") {
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: finalToken,
              refresh_token: finalRefreshToken,
            });

            if (setSessionError) {
              console.error("Error setting Supabase session:", setSessionError);
              throw new Error(
                `Failed to set session: ${setSessionError.message}`,
              );
            } else {
              return ok(undefined); // Indicate success
            }
          } else {
            throw new Error("Invalid password reset link.");
          }
        })(),
        (e) => e as Error, // Error mapper: ensures the error is an Error object
      );

      setLoading(false); // Always set loading to false after processing

      if (processLinkResult.isOk()) {
        setMessage("Please enter your new password.");
      } else {
        setError(processLinkResult.error);
        setMessage(
          processLinkResult.error.message.includes(
            "Invalid password reset link",
          )
            ? "The password reset link is invalid or has expired."
            : "There was an issue with your session. Please try again.",
        );
        setTimeout(() => router.replace("/login"), 5000);
      }

      reportError(processLinkResult);
    };

    Linking.getInitialURL().then((url) => {
      handleDeepLink(url);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [router, localSearchParams]);

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
        <Text style={styles.errorText}>Error: {error.message}</Text>{" "}
        {/* Display error.message */}
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.messageText}>{message}</Text>

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
