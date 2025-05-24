import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Add useLocalSearchParams
import { Button, Input } from "@rneui/themed";
import { useForm, Field } from "@tanstack/react-form";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as Linking from "expo-linking";
import { supabase } from "@/utils/supabase";
import { ok, err, Result, ResultAsync, errAsync } from "neverthrow";
import { reportError } from "@/utils/reportError";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const localSearchParams = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<Error | null>(null); // Changed type to Error | null
  const redirectTimerIdRef = useRef<number | null>(null);

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

  const {
    access_token: accessTokenFromParams,
    refresh_token: refreshTokenFromParams,
    type: typeFromParams,
  } = localSearchParams;

  useEffect(() => {
    const routerToken = accessTokenFromParams as string | undefined;
    const routerRefreshToken = refreshTokenFromParams as string | undefined;
    const routerType = typeFromParams as string | undefined;

    const currentRouterParams: Readonly<{
      token?: string;
      refreshToken?: string;
      type?: string;
    }> = {
      token: routerToken,
      refreshToken: routerRefreshToken,
      type: routerType,
    };

    const clearRedirectTimer = () => {
      if (redirectTimerIdRef.current) {
        clearTimeout(redirectTimerIdRef.current);
        redirectTimerIdRef.current = null;
      }
    };

    const handleUrl = async (url: string | null): Promise<void> => {
      clearRedirectTimer();
      setLoading(true);

      const parsedUrlResult = parseUrlParams(url);

      const finalResult: Result<void, Error> = await parsedUrlResult
        .mapErr((e) => e) // Ensures type consistency, already Error
        .asyncAndThen((urlParams) =>
          processPasswordResetLinkInternal(urlParams, currentRouterParams),
        );

      setLoading(false);
      reportError(finalResult);

      if (finalResult.isOk()) {
        setMessage("Please enter your new password.");
        setError(null);
      } else {
        const anError = finalResult.error;
        setError(anError);
        if (anError.message.includes("Invalid password reset link")) {
          setMessage("The password reset link is invalid or has expired.");
        } else if (anError.message.includes("Error parsing deep link URL")) {
          setMessage(
            "There was an issue processing the link. Please ensure it's correct and try again.",
          );
        } else if (anError.message.includes("Failed to set session")) {
          setMessage(
            `Session setup failed: ${anError.message}. Please try again.`,
          );
        } else {
          setMessage("An unexpected error occurred. Please try again.");
        }
        redirectTimerIdRef.current = setTimeout(
          () => router.replace("/login"),
          5000,
        );
      }
    };

    Linking.getInitialURL()
      .then((initialUrl) => {
        handleUrl(initialUrl);
      })
      .catch((linkError) => {
        console.error("Error getting initial URL:", linkError);
        setError(new Error("Failed to process application link."));
        setMessage(
          "Could not initialize password reset. Please try opening the link again.",
        );
        setLoading(false);
        clearRedirectTimer();
        redirectTimerIdRef.current = setTimeout(
          () => router.replace("/login"),
          5000,
        );
      });

    const subscription = Linking.addEventListener(
      "url",
      ({ url: eventUrl }) => {
        handleUrl(eventUrl);
      },
    );

    return () => {
      subscription.remove();
      clearRedirectTimer();
    };
  }, [router, accessTokenFromParams, refreshTokenFromParams, typeFromParams]);

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
        <Text style={styles.errorText}>Error: {error.message}</Text>
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

// Helper pure function to parse URL parameters
function parseUrlParams(
  url: string | null,
): Result<
  Readonly<{ token?: string; refreshToken?: string; type?: string }>,
  Error
> {
  if (!url) {
    return ok({}); // No URL, no params from URL
  }
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hash) {
      const fragmentParams = new URLSearchParams(parsedUrl.hash.substring(1));
      const token = fragmentParams.get("access_token") || undefined;
      const refreshToken = fragmentParams.get("refresh_token") || undefined;
      const type = fragmentParams.get("type") || undefined;
      return ok({ token, refreshToken, type });
    }
    return ok({}); // URL has no hash, no params from hash
  } catch (e) {
    console.error("Error parsing deep link URL:", e);
    return err(new Error("Error parsing deep link URL."));
  }
}

// Helper function for processing the password reset link and setting Supabase session
function processPasswordResetLinkInternal(
  urlParams: Readonly<{ token?: string; refreshToken?: string; type?: string }>,
  routerParams: Readonly<{
    token?: string;
    refreshToken?: string;
    type?: string;
  }>,
): ResultAsync<void, Error> {
  const finalToken = routerParams.token || urlParams.token;
  const finalRefreshToken = routerParams.refreshToken || urlParams.refreshToken;
  const finalType = routerParams.type || urlParams.type;

  if (finalToken && finalRefreshToken && finalType === "recovery") {
    return ResultAsync.fromPromise(
      supabase.auth.setSession({
        access_token: finalToken,
        refresh_token: finalRefreshToken,
      }),
      (e) =>
        new Error(
          `Unexpected error during session setup: ${(e as Error).message}`,
        ),
    ).andThen((sessionResponse) => {
      if (sessionResponse.error) {
        console.error("Error setting Supabase session:", sessionResponse.error);
        return err(
          new Error(`Failed to set session: ${sessionResponse.error.message}`),
        );
      }
      return ok(undefined); // Indicate success
    });
  }
  return errAsync(new Error("Invalid password reset link."));
}
