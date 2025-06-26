// app/register.tsx
import { Button, Text, Input, useTheme }from "@rn-vui/themed";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { StandardSchemaV1Issue, useForm } from "@tanstack/react-form";
import FormFieldInfo from "@/components/FormFieldInfo";

import LogoPortrait from "@/components/lotties/LogoPortrait";
import { useAuth, AuthCredentials } from "@/context/AuthenticationProvider";
import Background from "@/components/Background";
import registrationSchema from "@/schemas/registrationSchema";
import type { User, Session } from "@supabase/supabase-js";

export default function Register() {
  const router = useRouter();
  const { theme } = useTheme();
  const { signUpWithEmail, isLoading: authLoading } = useAuth();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
    validators: {
      onChange: registrationSchema,
    },
    onSubmit: async ({ value }) => {
      handleRegister(value);
    },
  });

  const handleRegister = useCallback(
    async (value: AuthCredentials) => {
      const signUpResult = await signUpWithEmail({
        email: value.email,
        password: value.password,
      });

      signUpResult.match(
        (data: { user: User | null; session: Session | null }) => {
          if (data.session) {
            console.log("Registration successful and user signed in!");
            // it is safer to direct to login page instead of letting in router.push("/");
          } else {
            console.log(
              "Registration successful, email confirmation required.",
            );
            Alert.alert(
              "Registration Successful",
              "Please check your email to confirm your account.",
              [
                {
                  text: "OK",
                  onPress: () =>
                    router.push({
                      pathname: "/EmailConfirmationRequired",
                      params: { email: value.email },
                    }),
                },
              ],
            );
          }
        },
        (transformedError) => {
          Alert.alert("Register Failed", transformedError.message);
        },
      );
    },
    [signUpWithEmail, router],
  );

  return (
    <Background>
      <LogoPortrait scale={0.2} style={{ transform: [{ rotate: "60deg" }] }} />
      <Text style={styles.heading}>Create Account</Text>
      {authLoading ? <ActivityIndicator /> : null}

      <View style={{ marginTop: 10 }}>
        <form.Field name="email" asyncDebounceMs={300}>
          {(field) => (
            <>
              <Input
                placeholder="Enter your email"
                keyboardType="email-address"
                value={field.state.value != null ? field.state.value : ""}
                onBlur={field.handleBlur}
                onChangeText={(text) => field.handleChange(text)}
                autoCapitalize="none"
              />
              <FormFieldInfo field={field} />
            </>
          )}
        </form.Field>
        <View style={{ marginTop: 20 }}>
          <form.Field name="password" asyncDebounceMs={200}>
            {(field) => (
              <>
                <Input
                  placeholder="Enter your password"
                  keyboardType="ascii-capable"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  value={
                    field.state.value != null
                      ? field.state.value.toString()
                      : ""
                  }
                  onBlur={field.handleBlur}
                  onChangeText={(text) => field.handleChange(text)}
                />
                <FormFieldInfo field={field} />
              </>
            )}
          </form.Field>
          <form.Field
            name="confirm_password"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                if (value !== fieldApi.form.getFieldValue("password")) {
                  return "Passwords do not match";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <View style={{ marginBottom: 20 }}>
                <Input
                  placeholder="Enter password again to confirm"
                  keyboardType="ascii-capable"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                />
                {field.state.meta.errors.map((err, index) => (
                  <Text key={index}>
                    {typeof err === "string"
                      ? err
                      : (err as StandardSchemaV1Issue).message}
                  </Text>
                ))}
              </View>
            )}
          </form.Field>
          <Button
            title="Register"
            disabled={authLoading}
            onPress={() => form.handleSubmit()}
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
            Already have an account?
          </Text>

          <Button
            title="Login"
            onPress={() => router.push("/login")}
            type="clear"
            titleStyle={{ color: theme.colors.primary }}
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  registerButton: {},
  buttonText: {},
  heading: {
    marginHorizontal: "auto",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 36,
    paddingHorizontal: 80,
    textAlign: "center",
  },
});
