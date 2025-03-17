import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="tutorial" />
      <Stack.Screen name="start" />
    </Stack>
  );
}
