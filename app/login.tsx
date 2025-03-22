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

import LogoPortrait from "@/components/lotties/LogoPortrait";
import { useAuth } from "@/context/AuthenticationProvider";
import { resetFirstVisit } from "@/utils/isFirstVisit";
import Background from "@/components/Background";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInWithEmail } = useAuth();

  const handleLogin = useCallback(
    async function () {
      if (email.length < 5 || !email.includes("@")) {
        Alert.alert("Validation Error", "Please enter a valid email address.");
        return;
      } else if (password.length < 8) {
        Alert.alert(
          "Validation Error",
          "Password must be at least 8 characters."
        );
        return;
      }
      setLoading(true);
      const signInResult = await signInWithEmail({ email, password });
      signInResult.match(
        () => {
          resetFirstVisit();
        },
        (transformedError) => {
          Alert.alert("Login Failed", transformedError.message);
        }
      );
      setLoading(false);
    },
    [email, password, signInWithEmail]
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
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Input
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View style={{ marginTop: 10 }}>
        <Button disabled={loading} onPress={handleLogin} title="Login" />

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
