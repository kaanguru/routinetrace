import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Add useLocalSearchParams
import { Button, Input }from "@rn-vui/themed";
import { useForm, Field } from "@tanstack/react-form";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as Linking from "expo-linking";
import { Result } from "neverthrow";
import { reportError } from "@/utils/reportError";
import parseUrlParams from "@/utils/auth/parseUrlParams";
import processPasswordResetLinkInternal from "@/utils/auth/processPasswordResetLinkInternal";
import styles from "@/theme/resetPasswordStyles";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const localSearchParams = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<Error | null>(null);
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
        .mapErr((e) => e)
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
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Za-z][0-9]|[0-9][A-Za-z]/.test(value)) {
                return "Password must contain both letters and numbers";
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
