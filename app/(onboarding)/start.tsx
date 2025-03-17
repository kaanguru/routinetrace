import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";

export default function StartScreen() {
  const router = useRouter();

  return (
    <View>
      <LogoPortrait />
      <Text>GorevIzi</Text>
      <View>
        <Button title="Register" onPress={() => router.push("/register")} />
        <Button
          title="Login"
          type="outline"
          onPress={() => router.push("/login")}
        />
      </View>
    </View>
  );
}
