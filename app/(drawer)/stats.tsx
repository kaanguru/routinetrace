import { Card, Text, LinearProgress } from "@rneui/themed";
import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native"; 

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
import { FlashList } from "@shopify/flash-list";


const ESTIMATED_ITEM_HEIGHT = 80;

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || errorHealthAndHappiness) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error?.message || errorHealthAndHappiness?.message}</Text>
      </View>
    );
  }

  const renderStatItem = ({
    item,
  }: Readonly<{ item: Readonly<Tables<"tasks">> }>) => (
    <TaskSuccessPercentage task={item} />
  );

  return (
    <View style={styles.container}>
      <Text>Level {level}</Text>
      <View>
        <LinearProgress value={Number(untilNext.toFixed(2))} />
      </View>
      <View style={styles.cardsContainer}>
        <Card containerStyle={styles.card}>
          <Healthy height={100} width={120} />
          <Text>Health</Text>
          <Card.Divider orientation="horizontal" />
          <Text>{healthAndHappiness?.health || 0}</Text>
        </Card>
        <Card containerStyle={styles.card}>
          <Happy height={100} width={120} />
          <Text>Happiness</Text>
          <Card.Divider orientation="horizontal" />
          <Text>{healthAndHappiness?.happiness || 0}</Text>
        </Card>
      </View>
      <View style={styles.listContainer}>
        <FlashList
          contentContainerStyle={styles.listContent}
          data={data || []}
          keyExtractor={(task: Readonly<Tables<"tasks">>) => task.id.toString()}
          renderItem={renderStatItem}
          ListEmptyComponent={<Text>No completed tasks available</Text>}
          estimatedItemSize={ESTIMATED_ITEM_HEIGHT}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 5,
  },
  centered: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center', 
  },
  cardsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginVertical: 10, 
  },
  card: {
    flex: 1, 
    marginHorizontal: 5,
  },
  listContainer: {
    flex: 1, 
  },
  listContent: {
    padding: 8,
    paddingBottom: 16,
  },
});
