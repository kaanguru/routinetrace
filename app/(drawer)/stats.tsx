import { Card, Text, LinearProgress }from "@rn-vui/themed";
import React, { useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import Background from "@/components/Background";
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

const ESTIMATED_ITEM_HEIGHT = 80;

const renderStatItem = ({ item }: { item: Tables<"tasks"> }) => (
  <TaskSuccessPercentage task={item} />
);

const renderLoadingState = () => (
  <View style={styles.centered}>
    <ActivityIndicator size="large" />
  </View>
);

const renderErrorState = (error?: Error) => (
  <View style={styles.centered}>
    <Text>Error: {error?.message}</Text>
  </View>
);

const StatsCard = ({
  animation: Animation,
  title,
  value,
}: {
  animation: React.ComponentType<{ height: number; width: number }>;
  title: string;
  value: number;
}) => (
  <Card containerStyle={styles.card}>
    <Animation height={100} width={120} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Card.Divider orientation="horizontal" />
    <Text style={styles.cardValue}>{value}</Text>
  </Card>
);

const StatsLevelIndicator = ({
  level,
  untilNext,
}: {
  level: number;
  untilNext: number;
}) => (
  <View style={{ alignItems: "center" }}>
    <Text style={styles.levelHeader}>Your Level</Text>
    <Text style={styles.levelText}>{level}</Text>
    <View style={{ width: "80%" }}>
      <LinearProgress value={Number(untilNext.toFixed(2))} />
    </View>
  </View>
);

export default function Stats() {
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useTasksQuery("completed");
  const { data: user } = useUser();
  const {
    data: healthAndHappiness,
    isLoading: isLoadingHealthAndHappiness,
    error: healthError,
  } = useHealthAndHappinessQuery(user?.id);

  const { level, untilNext } = useMemo(() => {
    const health = healthAndHappiness?.health ?? 0;
    const happiness = healthAndHappiness?.happiness ?? 0;
    return {
      level: calculateLevel(health, happiness),
      untilNext: percentageUntilNextLevel(health, happiness),
    };
  }, [healthAndHappiness]);

  if (isLoadingTasks || isLoadingHealthAndHappiness)
    return renderLoadingState();
  if (tasksError || healthError)
    return renderErrorState(tasksError || healthError || undefined);

  return (
    <Background>
      <StatsLevelIndicator level={level} untilNext={untilNext} />

      <View style={styles.cardsContainer}>
        <StatsCard
          animation={Healthy}
          title="Health"
          value={healthAndHappiness?.health || 0}
        />
        <StatsCard
          animation={Happy}
          title="Happiness"
          value={healthAndHappiness?.happiness || 0}
        />
      </View>

      <View style={styles.listContainer}>
        <FlashList
          contentContainerStyle={styles.listContent}
          data={tasks}
          keyExtractor={(task: Tables<"tasks">) => task.id.toString()}
          renderItem={renderStatItem}
          ListEmptyComponent={<Text>No completed tasks available</Text>}
          estimatedItemSize={ESTIMATED_ITEM_HEIGHT}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    paddingBottom: 16,
  },
  levelHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  levelText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#4F10A8", // Using a project color (violet-900)
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#FFEFC2", // Using a project color (amber-100)
    borderRadius: 10, // Add some rounded corners
    padding: 15, // Add some internal padding
  },
});
