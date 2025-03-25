import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GlobalErrorFallback() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Something went wrong.</Text>
      <Text style={styles.message}>
        An unexpected error occurred. Please try again later. app/_layout.tsx
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#dc3545", // Red color for error
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
