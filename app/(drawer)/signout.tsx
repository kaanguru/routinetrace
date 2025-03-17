import { Stack } from 'expo-router';
import React from 'react-native';
export default function signOut() {
  return (
    <>
      <Stack>
        <Stack.Screen name="Sign Out" options={{ title: 'Sign Out' }} />
      </Stack>
    </>
  );
}
