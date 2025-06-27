import { Button, Card, Divider } from "@rn-vui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, Pressable, View, SafeAreaView } from "react-native";

import Header from "@/components/Header";
import TuneUp from "@/components/lotties/TuneUp";
import WellDone from "@/components/lotties/WellDone";
import { Tables } from "@/database.types";
import useTasksQuery from "@/hooks/useTasksQueries";
import { Task } from "@/types";
import wasTaskDueYesterday from "@/utils/tasks/wasTaskDueYesterday";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

const ESTIMATED_ITEM_HEIGHT = 80;

export default function TasksOfYesterday() {
  const { data: notCompletedTasks } = useTasksQuery("not-completed");
  const [tasksDueYesterday, setTasksDueYesterday] =
    useState<readonly Tables<"tasks">[]>();

  useEffect(() => {
    const yesterdayTasks = notCompletedTasks?.filter(wasTaskDueYesterday) || [];
    setTasksDueYesterday(yesterdayTasks);
  }, [notCompletedTasks]);

  if (!tasksDueYesterday || tasksDueYesterday.length === 0) {
    return (
      <View>
        <WellDone />
        <Text>No tasks to complete from yesterday!</Text>
        <Button onPress={() => router.push("/")} title="Go to Today's Tasks" />
      </View>
    );
  }
  const taskOfYesterday: ListRenderItem<Task> = ({ item }) => {
    return (
      <Pressable onPress={() => router.push(`/(tasks)/${item.id}`)}>
        <Card>
          <Text>{item.title}</Text>
        </Card>
      </Pressable>
    );
  };
  return (
    <SafeAreaView>
      <Header headerTitle=" 🎶    🎵 Tasklist Tune-Up! 🎹" />
      <View>
        <Text>
          Deadlines sound like heavy metal 🎸 and your brain’s stuck on elevator
          music 🎵
        </Text>
        <Text>
          Your to-do list hit a sour note yesterday—no worries, we’ll remix it!
          🎶
        </Text>
        <Text>🎧 Check your tasks before you turn into a human metronome</Text>
        <TuneUp />
        <Divider />
        <FlashList
          data={tasksDueYesterday}
          renderItem={taskOfYesterday}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={ESTIMATED_ITEM_HEIGHT}
        />
      </View>
    </SafeAreaView>
  );
}
