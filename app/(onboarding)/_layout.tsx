import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    >
      <Stack.Screen name="splash" />
      <Stack.Screen name="tutorial" />
      <Stack.Screen name="start" />
    </Stack>
  );
}
