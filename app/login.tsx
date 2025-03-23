// app/login.tsx
import { Button, Input, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  ActivityIndicator,
  Button as NativeButton,
  Alert,
} from "react-native";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import FormFieldInfo from "@/components/FormFieldInfo";

import LogoPortrait from "@/components/lotties/LogoPortrait";
import { useAuth, AuthCredentials } from "@/context/AuthenticationProvider";
import { resetFirstVisit } from "@/utils/isFirstVisit";
import Background from "@/components/Background";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: userSchema,
    },
    onSubmit: async ({ value }) => {
      handleLogin(value);
    },
  });
  const handleLogin = useCallback(
    async function (val: AuthCredentials) {
      setLoading(true);
      const signInResult = await signInWithEmail({
        email: val.email,
        password: val.password,
      });
      signInResult.match(
        () => {
          console.log("Login Successful");
        },
        (transformedError) => {
          Alert.alert("Login Failed", transformedError.message);
        }
      );
      setLoading(false);
    },
    [form, signInWithEmail]
  );

  return (
    <Background>
      <LogoPortrait scale={0.25} style={{ transform: [{ rotate: "60deg" }] }} />
      <Text
        style={{
          marginHorizontal: "auto",
          fontFamily: "Ubuntu_400Regular",
          fontSize: 36,
          paddingHorizontal: 80,
          textAlign: "center",
          color: "#3E0C83",
        }}
      >
        Welcome Back
      </Text>
      {loading && <ActivityIndicator />}
      <View style={{ marginTop: 30 }}>
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
                  field.state.value != null ? field.state.value.toString() : ""
                }
                onBlur={field.handleBlur}
                onChangeText={(text) => field.handleChange(text)}
              />
              <FormFieldInfo field={field} />
            </>
          )}
        </form.Field>
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          disabled={loading}
          onPress={() => form.handleSubmit()}
          title="Login"
        />

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
            Don't have an account?
          </Text>
          <Button
            type="clear"
            onPress={() => router.push("/register")}
            title="Register"
            titleStyle={{
              fontSize: 14,
              fontFamily: "Ubuntu_700Bold",
            }}
          />
        </View>
      </View>
      <View style={{ position: "absolute", bottom: 10, right: 10 }}>
        <NativeButton color="#F04F05" onPress={resetFirstVisit} title="R-F-W" />
      </View>
    </Background>
  );
}
