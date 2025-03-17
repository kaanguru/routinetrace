import { Card, Text, LinearProgress } from "@rneui/themed";
import React, { useMemo } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";

import TaskSuccessPercentage from "@/components/TaskSuccessPercentage";
import Happy from "@/components/lotties/Happy";
import Healthy from "@/components/lotties/Healthy";
import { Tables } from "@/database.types";
import useHealthAndHappinessQuery from "@/hooks/useHealthAndHappinessQueries";
import useTasksQuery from "@/hooks/useTasksQueries";
import useUser from "@/hooks/useUser";
import calculateLevel, {
  percentageUntilNextLevel,
} from "@/utils/calculateLevel";

export default function Stats() {
  const { data = [], isLoading, error } = useTasksQuery("completed");
  const { data: user } = useUser();
  const {
    data: healthAndHappiness,
    isLoading: isLoadingHealthAndHappiness,
    error: errorHealthAndHappiness,
  } = useHealthAndHappinessQuery(user?.id);

  const level = useMemo(() => {
    if (!healthAndHappiness) return 0;

    const health = healthAndHappiness.health ?? 0;
    const happiness = healthAndHappiness.happiness ?? 0;

    return calculateLevel(health, happiness);
  }, [healthAndHappiness]);

  const untilNext = useMemo(() => {
    if (!healthAndHappiness) return 0;

    const health = healthAndHappiness.health ?? 0;
    const happiness = healthAndHappiness.happiness ?? 0;

    return percentageUntilNextLevel(health, happiness);
  }, [healthAndHappiness]);

  if (isLoading || isLoadingHealthAndHappiness) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || errorHealthAndHappiness) {
    return (
      <View>
        <Text>Error: {error?.message}</Text>
      </View>
    );
  }

  const renderStatItem = ({
    item,
  }: Readonly<{ item: Readonly<Tables<"tasks">> }>) => (
    <TaskSuccessPercentage key={item.id.toString()} task={item} />
  );

  return (
    <View>
      <Text>Level {level}</Text>
      <View>
        <LinearProgress value={Number(untilNext.toFixed(2))} />
      </View>
      <View>
        <Card>
          <Healthy height={100} width={120} />
          <Text>Health</Text>
          <Card.Divider orientation="horizontal" />
          <Text>{healthAndHappiness?.health || 0}</Text>
        </Card>
        <Card>
          <Happy height={100} width={120} />
          <Text>Happiness</Text>
          <Card.Divider orientation="horizontal" />
          <Text>{healthAndHappiness?.happiness || 0}</Text>
        </Card>
      </View>
      <FlatList
        contentContainerStyle={{
          gap: 8,
          padding: 8,
          paddingBottom: 16,
          marginTop: 12,
          justifyContent: "space-evenly",
        }}
        data={data || []}
        keyExtractor={(task: Readonly<Tables<"tasks">>) => task.id.toString()}
        renderItem={renderStatItem}
        ListEmptyComponent={<Text>No tasks available</Text>}
      />
    </View>
  );
}
