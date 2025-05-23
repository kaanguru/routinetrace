import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Input } from "@rneui/themed";
import { useForm, Field } from "@tanstack/react-form";
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation";
import * as Linking from "expo-linking"; // Import Linking

export default function ResetPasswordScreen() {
  const { access_token, refresh_token, type } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetPasswordMutation = useResetPasswordMutation();
  const currentUrl = Linking.useURL(); // Get the full URL

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
    console.log("🚀 ~ currentUrl:", currentUrl);
    console.log("🚀 ~ useLocalSearchParams:", {
      access_token,
      refresh_token,
      type,
    });

    if (access_token && refresh_token && type === "recovery") {
      console.log("🚀 ~ useEffect ~ type:", type);
      console.log("🚀 ~ useEffect ~ refresh_token:", refresh_token);
      console.log("🚀 ~ useEffect ~ access_token:", access_token);
      setLoading(false);
      setMessage("Please enter your new password.");
    } else {
      setLoading(false);
      setError("Invalid password reset link.");
      setMessage("The password reset link is invalid or has expired.");
      setTimeout(() => router.replace("/login"), 5000);
    }
  }, [access_token, refresh_token, type, router, currentUrl]);
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
