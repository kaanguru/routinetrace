import { Button, Input } from "@rneui/themed";
import { Href, useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Alert, ActivityIndicator } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";
import { useAuth } from "~/utils/auth/auth";

export default function Register() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "The passwords you entered do not match."
      );
      return;
    }
    setLoading(true);
    if (email.length < 5 || !email.includes("@")) {
      setLoading(false);
    } else if (password.length < 8) {
      setLoading(false);
    } else {
      try {
        const result = await signUpWithEmail(email, password);
        if (result?.error) {
          Alert.alert("Register Failed", result.error.message);
        } else {
          router.push("/login" as Href);
        }
      } catch (error) {
        console.error("An error occurred during registration:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View>
      <LogoPortrait scale={0.3} />
      <Text>Create Account</Text>
      {loading && <ActivityIndicator />}

      <View>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View>
          <Input
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View>
          <Text className={styles.text}>Confirm Password</Text>
          <TextInput
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>

        <Button
          title="Register"
          disabled={loading}
          className={styles.button}
          onPress={handleRegister}
        />

        <Button
          title="Already have an account? Login"
          className={styles.button}
          onPress={() => router.push("/login")}
        />
      </View>
    </View>
  );
}

const styles = {
  button: "mt-8 bg-background-dark dark:bg-background-light rounded ",
  buttonText: "text-center text-typography-white dark:text-typography-black",
  text: "mb-2 text-typography-black dark:text-typography-white",
};
