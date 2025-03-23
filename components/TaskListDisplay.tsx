import { Text } from "@rneui/themed";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

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
    <FlatList
      contentContainerStyle={{
        gap: 16,
        margin: 3,
      }}
      data={reorderedTasks}
      renderItem={renderTaskItem}
      keyExtractor={keyExtractor}
      ListEmptyComponent={<TaskListEmptyComponent />}
      //ListHeaderComponent
      ListHeaderComponent={
        reorderedTasks.length > 0 ? (
          <View>
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
      initialNumToRender={10}
      maxToRenderPerBatch={3}
      windowSize={6}
      removeClippedSubviews
      getItemLayout={(data, index) => ({
        length: 94,
        offset: 110 * index,
        index,
      })}
    />
  );
}

export default TaskListDisplay;
