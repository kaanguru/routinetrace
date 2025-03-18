import Background from "@/components/Background";
import { Button, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import { View } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";

export default function StartScreen() {
  const router = useRouter();

  return (
    <Background
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <LogoPortrait scale={0.4} />
      <Text
        style={{
          fontFamily: "DelaGothicOne_400Regular",
          marginInline: "auto",
          marginVertical: 20,
          fontSize: 30,
        }}
      >
        RoutineTrace
      </Text>
      <View>
        <Button title="Register" onPress={() => router.push("/register")} />
        <Button
          title="Login"
          type="outline"
          onPress={() => router.push("/login")}
        />
      </View>
    </Background>
  );
}
