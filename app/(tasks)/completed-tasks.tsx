import { Ionicons } from "@expo/vector-icons";
import { Card, Button, useThemeMode } from "@rneui/themed";
import { router } from "expo-router";
import { useCallback } from "react";
import { Text, Pressable, View, FlatList } from "react-native";

import Header from "~/components/Header";
import { Tables } from "@/database.types";
import { useToggleComplete } from "~/hooks/useTasksMutations";
import useTasksQueries from "~/hooks/useTasksQueries";

export default function CompletedTasks() {
  const { mode } = useThemeMode();

  const { data: tasks, isLoading, refetch } = useTasksQueries("completed");
  const { mutate: toggleComplete } = useToggleComplete();

  const handleMarkIncomplete = useCallback(
    (taskID: number) => toggleComplete({ taskID, isComplete: false }),
    []
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
          <View className="flex flex-row items-start justify-between">
            <View className="flex-1">
              <Text className=" text-typography-gray ">{item.title}</Text>
              {item.notes && (
                <Text className="mt-1 py-3 text-white dark:text-black">
                  {item.notes}
                </Text>
              )}
              {item.repeat_period && (
                <Text className="mt-2 text-xs text-white dark:text-black">
                  Repeats: {item.repeat_frequency} times{" "}
                  {item.repeat_period.toLowerCase()}
                </Text>
              )}
              {item.updated_at && (
                <Text className="mt-2 text-xs text-white dark:text-black">
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
    <View className="bg-background-light dark:bg-background-dark flex-1 p-4">
      <Header headerTitle="Completed Tasks" />
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text className="m-4 text-center text-gray-500">
            No completed tasks found
          </Text>
        }
        onRefresh={refetch}
        refreshing={isLoading}
        contentContainerStyle={{ paddingBottom: 20, paddingEnd: 20 }}
        maxToRenderPerBatch={3}
        windowSize={6}
        removeClippedSubviews
      />
    </View>
  );
}
