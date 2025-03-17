// app\(drawer)\_layout.tsx
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import DrawerMenuAndScreens from "@/components/DrawerMenuAndScreens";
import { useInitializationContext } from "@/components/RNEWrapper";
import { useSessionContext } from "@/context/AuthenticationContext";

export default function DrawerLayout() {
  const { session, isLoading } = useSessionContext();
  const { initialized } = useInitializationContext(); // Use the context
  if (isLoading || !initialized) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <DrawerMenuAndScreens />;
}
