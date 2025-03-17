import { Button, Card, Divider } from "@rneui/themed";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  Pressable,
  View,
  FlatList,
  SafeAreaView,
  ListRenderItem,
} from "react-native";

import Header from "@/components/Header";
import TuneUp from "@/components/lotties/TuneUp";
import WellDone from "@/components/lotties/WellDone";
import { Tables } from "@/database.types";
import useTasksQuery from "@/hooks/useTasksQueries";
import { Task } from "@/types";
import wasTaskDueYesterday from "@/utils/tasks/wasTaskDueYesterday";

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
      <View className="bg-background-light dark:bg-background-dark flex-1 flex-col items-center justify-center p-4">
        <WellDone />
        <Text className=" text-typography-black dark:text-typography-white my-10 text-center">
          No tasks to complete from yesterday!
        </Text>
        <Button onPress={() => router.push("/")} title="Go to Today's Tasks" />
      </View>
    );
  }
  const taskOfYesterday: ListRenderItem<Task> = ({ item }) => {
    return (
      <Pressable onPress={() => router.push(`/(tasks)/${item.id}`)}>
        <Card>
          <Text className="text-typography-black dark:text-typography-white text-center">
            {item.title}
          </Text>
        </Card>
      </Pressable>
    );
  };
  return (
    <SafeAreaView>
      <Header headerTitle=" 🎶    🎵 Tasklist Tune-Up! 🎹" />
      <View className="bg-background-light dark:bg-background-dark h-full p-4">
        <Text className="text-typography-black dark:text-typography-white text-center">
          Deadlines sound like heavy metal 🎸 and your brain’s stuck on elevator
          music 🎵
        </Text>
        <Text className="bold text-typography-black dark:text-typography-white my-10 text-center">
          Your to-do list hit a sour note yesterday—no worries, we’ll remix it!
          🎶
        </Text>
        <Text className="text-typography-black dark:text-typography-white m-5 text-center text-sm">
          🎧 Check your tasks before you turn into a human metronome
        </Text>
        <TuneUp />
        <Divider className="my-4" />
        <FlatList
          data={tasksDueYesterday}
          renderItem={taskOfYesterday}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
