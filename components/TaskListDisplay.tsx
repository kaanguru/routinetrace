import React from "react";
import { View, StyleSheet } from "react-native";
import DraggableFlatListComponent from "./DraggableFlatList";
import { Task } from "@/types";
import EmptyTasksView from "./empty-tasks-view";

interface TaskListDisplayProps {
  isFiltered: boolean;
  reorderedTasks: Task[];
  renderTaskItem: any;
  keyExtractor: (item: Task) => string;
  isRefetching: boolean;
  refetch: () => void;
  onReorder: (from: number, to: number) => void;
}

const TaskListDisplay = ({
  isFiltered,
  reorderedTasks,
  renderTaskItem,
  keyExtractor,
  isRefetching,
  refetch,
  onReorder,
}: TaskListDisplayProps) => {
  // Handle drag end and call the parent's reorder function
  const handleDragEnd = ({
    from,
    to,
    data,
  }: {
    from: number;
    to: number;
    data: Task[];
  }) => {
    onReorder(from, to);
  };

  // Create a modified renderItem function that works with DraggableFlatList params
  const renderItemForDraggable = ({ item, index, drag, isActive }: any) => {
    // We need to modify the renderTaskItem to handle the drag function
    return renderTaskItem({
      item,
      index,
      dragActivator: drag,
      isActive,
    });
  };

  // Customize the empty component based on filter state
  const emptyComponent = () => <EmptyTasksView />;

  return (
    <View style={styles.container}>
      <DraggableFlatListComponent
        tasks={reorderedTasks}
        renderItem={renderItemForDraggable}
        keyExtractor={keyExtractor}
        onDragEnd={handleDragEnd}
        ListEmptyComponent={emptyComponent()}
        onRefresh={refetch}
        refreshing={isRefetching}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TaskListDisplay;
