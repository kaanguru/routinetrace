import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BiriBirseyDesin from "./lotties/BiriBirseyDesin";
const EmptyTasksView = () => {
  return (
    <View style={styles.container}>
      <BiriBirseyDesin />
      <Text style={styles.text}>
        No tasks found! Add your first task to get started.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default EmptyTasksView;
