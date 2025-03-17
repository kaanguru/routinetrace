import { Link, Stack, useSegments } from "expo-router";
import { Text, View } from "react-native";

import { Container } from "@/components/Container";

export default function NotFoundScreen() {
  const segments = useSegments();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <Container>
        <View>
          <Text className={styles.title}>This screen doesn't exist.</Text>
          <Text className={styles.debugText}>
            Attempted Path: {segments.join("/") || "/"}
          </Text>
          <Link href="/(drawer)" asChild>
            <Text className={styles.linkText}>Go to home screen!</Text>
          </Link>
        </View>
      </Container>
    </>
  );
}

const styles = {
  title: `text-xl font-bold`,
  link: `mt-4 pt-4`,
  linkText: `text-base text-[#2e78b7]`,
  debugText: `text-sm text-gray-500 mt-2`,
};
