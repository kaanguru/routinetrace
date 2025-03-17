import { Text, Card, LinearProgress } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

import { Tables } from "@/database.types";
import calculateSuccessPercentage from "~/utils/tasks/calculateSuccessPercentage";
import getTaskCompletionHistory from "~/utils/tasks/getTaskCompletionHistory";

function TaskSuccessPercentage({ task }: Readonly<{ task: Tables<"tasks"> }>) {
  const { data: completionHistory } = useQuery({
    queryKey: ["taskCompletionHistory", task.id],
    queryFn: () => getTaskCompletionHistory(task.id),
  });
  const successPercentage = calculateSuccessPercentage(
    task,
    completionHistory || []
  );
  function onPress(): void {
    router.push(`/(tasks)/${task.id}`);
  }

  return successPercentage > 0 ? (
    <Card>
      <Pressable onPress={onPress}>
        <Text>{task.title}</Text>
        <View>
          <LinearProgress value={Number(successPercentage.toFixed(2))} />
        </View>
        <Text>{successPercentage.toFixed(2)}%</Text>
      </Pressable>
    </Card>
  ) : null;
}

export default TaskSuccessPercentage;
