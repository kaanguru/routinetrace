// app/(drawer)/_layout.tsx
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

import DrawerMenuAndScreens from "@/components/DrawerMenuAndScreens";
import { useInitializationContext } from "@/components/RNEWrapper";
import { useAuth } from "@/context/AuthenticationProvider";
import Background from "@/components/Background";

export default function DrawerLayout() {
  const { session, isLoading } = useAuth();
  const { initialized } = useInitializationContext(); // Use the context
  if (isLoading || !initialized) {
    return (
      <Background>
        <ActivityIndicator size="large" />
      </Background>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return <DrawerMenuAndScreens />;
}
