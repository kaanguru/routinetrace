import { Ionicons } from "@expo/vector-icons";
import { Text, Card, Button, useTheme }from "@rn-vui/themed";
import { router } from "expo-router";
import { useCallback } from "react";
import { Pressable, View, StyleSheet } from "react-native";

import Header from "~/components/Header";
import { Tables } from "@/database.types";
import { useToggleComplete } from "~/hooks/useTasksMutations";
import useTasksQueries from "~/hooks/useTasksQueries";
import { FlashList } from "@shopify/flash-list";
const ESTIMATED_ITEM_HEIGHT = 139;

export default function CompletedTasks() {
  const { theme } = useTheme();

  const { data: tasks, isLoading, refetch } = useTasksQueries("completed");
  const { mutate: toggleComplete } = useToggleComplete();

  const handleMarkIncomplete = useCallback(
    (taskID: number) => toggleComplete({ taskID, isComplete: false }),
    [toggleComplete],
  );

  function renderItem({ item }: Readonly<{ item: Tables<"tasks"> }>) {
    return (
      <Card containerStyle={styles.card}>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/(tasks)/[id]",
              params: { id: item.id },
            });
          }}
          style={styles.cardPressable}
        >
          <View style={styles.cardContent}>
            <View style={styles.textContainer}>
              <Card.Title>{item.title}</Card.Title>
              <Card.Divider />
              <View style={{ position: "relative", alignItems: "center" }}>
                {item.notes && (
                  <View style={{ paddingVertical: 4 }}>
                    <Text style={{ color: theme.colors.black }}>
                      {item.notes}
                    </Text>
                  </View>
                )}
                {item.repeat_period && (
                  <>
                    <Text>Repeats:</Text>
                    <Text>
                      {item.repeat_frequency} times{" "}
                      {item.repeat_period.toLowerCase()}
                    </Text>
                  </>
                )}
                {item.updated_at && (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      justifyContent: "center",
                      alignContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "700",
                        marginEnd: 5,
                      }}
                    >
                      Completed on:
                    </Text>
                    <Text>
                      {new Date(item.updated_at).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Button
              type="clear"
              onPress={() => handleMarkIncomplete(item.id)}
              icon={<Ionicons name="arrow-undo" size={20} />}
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No completed tasks found</Text>
        }
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
