import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Input } from "@rneui/themed";
import { ResultAsync, err, ok } from "neverthrow";
import reportError from "~/utils/errorHandler";
import { useMutation } from "@tanstack/react-query";
import { useForm, Field } from "@tanstack/react-form";
import { supabase } from "~/utils/supabase";

// Define the shape of the form data
type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

// Placeholder for the password reset mutation logic
const useResetPasswordMutation = () => {
  return useMutation<ResultAsync<void, Error>, Error, ResetPasswordFormData>({
    mutationFn: async (
      data: ResetPasswordFormData,
    ): Promise<ResultAsync<void, Error>> => {
      if (data.password !== data.confirmPassword) {
        return err(new Error("Passwords do not match."));
      }
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        return err(error);
      }

      return ok(undefined);
    },
    onSuccess: async (result) => {
      if ((await result).isOk()) {
        console.log(
          "Password reset successful (placeholder). Navigating to login.",
        );
        router.replace("/login");
      }
    },
    onError: (error) => {
      reportError(error);
      console.error("Password reset error:", error);
    },
  });
};

export default function ResetPasswordScreen() {
  const { access_token, refresh_token, type } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initialize the mutation hook
  const resetPasswordMutation = useResetPasswordMutation();

  // Initialize the form using TanStack Form
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
    // Supabase typically handles setting the session from the URL automatically
    // when the app loads with the redirect URL. We can check if a session is
    // available or if the tokens are present in the URL.
    if (access_token && refresh_token && type === "recovery") {
      // Tokens are present, Supabase should handle the session.
      // We can proceed to show the password reset form.
      setLoading(false);
      setMessage("Please enter your new password.");
    } else {
      // Invalid or missing tokens/type in URL.
      setLoading(false);
      setError("Invalid password reset link.");
      setMessage("The password reset link is invalid or has expired.");
      // Optionally redirect after a delay
      // setTimeout(() => router.replace('/login'), 5000);
    }
  }, [access_token, refresh_token, type, router]);

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
