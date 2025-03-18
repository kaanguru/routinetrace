import { Button, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

import LogoPortrait from "@/components/lotties/LogoPortrait";
import { useSessionContext } from "@/context/AuthenticationContext";
import { resetFirstVisit } from "@/utils/isFirstVisit";

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
    <View>
      <LogoPortrait />
      <Text>Welcome Back</Text>
      {loading && <ActivityIndicator />}
      <View>
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
      <View>
        <Button disabled={loading} onPress={handleLogin} title="Login" />

        <Button onPress={() => router.push("/register")} title=" Register" />
      </View>
      <Button onPress={resetFirstVisit} title="R-F-W" />
    </View>
  );
}
