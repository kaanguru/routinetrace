import { Href, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable } from "react-native";
import { Text } from "@rneui/themed";
import LogoPortrait from "@/components/lotties/LogoPortrait";
import Background from "@/components/Background";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(onboarding)/tutorial" as Href);
    }, 6500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Background style={{ justifyContent: "center", alignItems: "center" }}>
      <Pressable
        onPress={() => router.replace("/(onboarding)/tutorial" as Href)}
        style={{
          margin: 50,
        }}
      >
        <LogoPortrait scale={0.5} style={{ marginRight: 45 }} />
      </Pressable>
      <Text
        style={{
          fontFamily: "DelaGothicOne_400Regular",
          fontSize: 30,
          marginTop: 10,
        }}
      >
        RoutineTrace
      </Text>
    </Background>
  );
}
