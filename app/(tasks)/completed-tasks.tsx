import { Ionicons } from "@expo/vector-icons";
import { Card, Button, useThemeMode } from "@rneui/themed";
import { router } from "expo-router";
import { useCallback } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";

import Header from "~/components/Header";
import { Tables } from "@/database.types";
import { useToggleComplete } from "~/hooks/useTasksMutations";
import useTasksQueries from "~/hooks/useTasksQueries";
import { FlashList } from "@shopify/flash-list";
const ESTIMATED_ITEM_HEIGHT = 139;

export default function CompletedTasks() {
  const { mode } = useThemeMode();

  const { data: tasks, isLoading, refetch } = useTasksQueries("completed");
  const { mutate: toggleComplete } = useToggleComplete();

  const handleMarkIncomplete = useCallback(
    (taskID: number) => toggleComplete({ taskID, isComplete: false }),
    [],
  );

  function renderItem({ item }: Readonly<{ item: Tables<"tasks"> }>) {
    return (
      <Card>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/(tasks)/[id]",
              params: { id: item.id },
            });
          }}
        >
          <View>
            <View>
              <Text>{item.title}</Text>
              {item.notes && <Text>{item.notes}</Text>}
              {item.repeat_period && (
                <Text>
                  Repeats: {item.repeat_frequency} times{" "}
                  {item.repeat_period.toLowerCase()}
                </Text>
              )}
              {item.updated_at && (
                <Text>
                  Completed on: {new Date(item.updated_at).toLocaleDateString()}
                </Text>
              )}
            </View>
            <Button onPress={() => handleMarkIncomplete(item.id)} />
            <Ionicons
              name="arrow-undo"
              size={20}
              color={mode === "light" ? "#FFFAEB" : "#051824"}
            />
          </View>
        </Pressable>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Header headerTitle="Completed Tasks" />
      <FlashList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>No completed tasks found</Text>}
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={{ paddingBottom: 20 }}
        estimatedItemSize={ESTIMATED_ITEM_HEIGHT}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  activityIndicator: {
    marginTop: 20,
  },
  errorText: {
    marginBottom: 10,
    color: "red",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "grey",
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    padding: 0,
  },
  cardPressable: {
    padding: 15,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },

  listContent: {
    paddingBottom: 20,
    paddingTop: 10,
  },
});
