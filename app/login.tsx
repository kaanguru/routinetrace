import { Button, Input, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, ActivityIndicator, Button as NativeButton } from "react-native";

import LogoPortrait from "@/components/lotties/LogoPortrait";
import { useSessionContext } from "@/context/AuthenticationContext";
import { resetFirstVisit } from "@/utils/isFirstVisit";
import Background from "@/components/Background";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading] = useState(false);
  const { signIn, authError } = useSessionContext();

  const handleLogin = async function () {
    if (email.length < 5 || !email.includes("@")) {
    } else if (password.length < 8) {
    } else {
      await signIn(email, password);
      setTimeout(() => {
        if (authError) {
          router.replace("/login");
        } else {
          router.replace("/");
        }
      }, 200);
    }
  };

  return (
    <Background>
      <LogoPortrait style={{ transform: [{ rotate: "60deg" }] }} />
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
