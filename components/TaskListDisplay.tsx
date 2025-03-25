import { Text } from "@rneui/themed";
import React from "react";
import { RefreshControl, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import TaskListEmptyComponent from "~/components/TaskListEmptyComponent";
import { Tables } from "~/database.types";

interface TaskListDisplayProps {
  readonly isFiltered: boolean;
  readonly reorderedTasks: readonly Tables<"tasks">[];
  readonly renderTaskItem: (
    params: Readonly<{ item: Tables<"tasks">; index: number }>
  ) => React.ReactElement;
  readonly keyExtractor: (item: Readonly<Tables<"tasks">>) => string;
  readonly isRefetching: boolean;
  readonly refetch: () => void;
}

const TaskListHeader = ({ isFiltered }: Readonly<{ isFiltered: boolean }>) => (
  <Text
    style={{
      margin: 0,
      padding: 0,
      textAlign: "right",
      fontFamily: "UbuntuMono_400Regular",
    }}
  >
    {isFiltered ? "Today's" : "All Tasks"}
  </Text>
);

const renderListHeader = (
  tasks: readonly unknown[],
  isFiltered: boolean
) => {
  if (tasks.length === 0) return null;
  return (
    <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
      <TaskListHeader isFiltered={isFiltered} />
    </View>
  );
};

const createRefreshControl = (isRefetching: boolean, refetch: () => void) => (
  <RefreshControl
    refreshing={isRefetching}
    onRefresh={refetch}
    colors={["#000000"]}
    progressBackgroundColor="#ffffff"
  />
);

function TaskListDisplay({
  isFiltered,
  reorderedTasks,
  renderTaskItem,
  keyExtractor,
  isRefetching,
  refetch,
}: Readonly<TaskListDisplayProps>) {
  return (
    <FlashList
      data={reorderedTasks}
      renderItem={renderTaskItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<TaskListEmptyComponent />}
      ListHeaderComponent={renderListHeader(reorderedTasks, isFiltered)}
      refreshControl={createRefreshControl(isRefetching, refetch)}
      estimatedItemSize={113}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

export default TaskListDisplay;
