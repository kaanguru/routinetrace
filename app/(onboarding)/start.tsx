import Background from "@/components/Background";
import { Button, Text } from "@rn-vui/themed";
import { useRouter } from "expo-router";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";

export default function StartScreen() {
  const router = useRouter();

  return (
    <Background>
      <KeyboardAvoidingView
        behavior="padding"
        // The KeyboardAvoidingView should wrap the entire screen content
        // to properly adjust the layout when the keyboard is displayed.
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          // Using contentContainerStyle is the correct way to style the inner
          // content of a ScrollView. We use `flexGrow: 1` to allow the content
          // to expand and `justifyContent: 'center'` to center it vertically.
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20, // Added some horizontal padding for better spacing.
          }}
        >
          {/* By placing the LogoPortrait and the form elements inside this centered
              container, we ensure they are laid out correctly without conflict. */}
          <View style={{ alignItems: "center" }}>
            <LogoPortrait scale={0.4} />
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
            <View style={{ width: "100%", gap: 10 }}>
              <Button
                title="Register"
                onPress={() => router.push("/register")}
              />
              <Button
                title="Login"
                type="outline"
                onPress={() => router.push("/login")}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Background>
  );
}
