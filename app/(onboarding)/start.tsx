import Background from "@/components/Background";
import { Button, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";

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
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <LogoPortrait scale={0.4} />
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontFamily: "DelaGothicOne_400Regular",
              alignSelf: "center",
              marginVertical: 20,
              fontSize: 28,
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
        </KeyboardAvoidingView>
      </ScrollView>
    </Background>
  );
}
