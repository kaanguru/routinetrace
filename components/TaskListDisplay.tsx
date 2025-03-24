import { Text } from "@rneui/themed";
import React from "react";
import { RefreshControl, View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import TaskListEmptyComponent from "~/components/TaskListEmptyComponent";
import { Tables } from "~/database.types";

interface TaskListDisplayProps {
  isFiltered: boolean;
  reorderedTasks: Tables<"tasks">[];
  renderTaskItem: ({
    item,
    index,
  }: Readonly<{ item: Tables<"tasks">; index: number }>) => React.ReactElement;
  keyExtractor: (item: Readonly<Tables<"tasks">>) => string;
  isRefetching: boolean;
  refetch: () => void;
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
      ListHeaderComponent={
        reorderedTasks.length > 0 ? (
          <View style={{ paddingVertical: 5, paddingHorizontal: 10 }}>
            <TaskListHeader isFiltered={isFiltered} />
          </View>
        ) : null
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          colors={["#000000"]}
          progressBackgroundColor="#ffffff"
        />
      }
      estimatedItemSize={113}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

export default TaskListDisplay;
