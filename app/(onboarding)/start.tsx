import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";

import LogoPortrait from "~/components/lotties/LogoPortrait";

export default function StartScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center bg-background-light px-5 dark:bg-background-dark">
      <LogoPortrait />
      <Text className="m-3 p-3 text-center font-delaGothicOne text-4xl text-secondary">
        GorevIzi
      </Text>
      <View className=" ">
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
