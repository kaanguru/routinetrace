import { Link, Stack, useSegments } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const segments = useSegments();

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.view}>
        <Text style={styles.title}>This screen doesn&apos;t exist.</Text>
        <Text style={styles.debugText}>
          Attempted Path: {segments.join("/") || "/"}
        </Text>
        <Link href="/(drawer)" asChild>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    margin: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 16,
    paddingTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#2e78b7",
  },
  debugText: {
    fontSize: 14,
    color: "gray",
    marginTop: 8,
  },
});
