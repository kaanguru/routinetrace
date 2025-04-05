import React, { useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { Task } from "@/types";
import Animated from "react-native-reanimated";

interface DraggableFlatListProps {
  tasks: Task[];
  renderItem: ({
    item,
    drag,
    isActive,
  }: RenderItemParams<Task>) => React.ReactNode;
  keyExtractor: (item: Task) => string;
  onDragEnd: ({
    from,
    to,
    data,
  }: {
    from: number;
    to: number;
    data: Task[];
  }) => void;
  ListEmptyComponent?:
    | React.ComponentType<any>
    | React.ReactElement
    | null
    | undefined;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const DraggableFlatListComponent = ({
  tasks,
  renderItem,
  keyExtractor,
  onDragEnd,
  ListEmptyComponent,
  onRefresh,
  refreshing = false,
}: DraggableFlatListProps) => {
  // Enhanced renderItem that wraps the original renderItem with ScaleDecorator
  const renderItemWithDecorator = useCallback(
    (params: RenderItemParams<Task>) => {
      const { item, drag, isActive } = params;

      return (
        <ScaleDecorator>
          <Animated.View
            style={{
              backgroundColor: isActive
                ? "rgba(106, 24, 220, 0.1)"
                : "transparent",
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            {renderItem(params)}
          </Animated.View>
        </ScaleDecorator>
      );
    },
    [renderItem]
  );

  return (
    <DraggableFlatList
      data={tasks}
      onDragEnd={onDragEnd}
      keyExtractor={keyExtractor}
      renderItem={renderItemWithDecorator}
      contentContainerStyle={styles.list}
      ListEmptyComponent={ListEmptyComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      autoscrollSpeed={100}
      dragItemOverflow={true}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});

export default DraggableFlatListComponent;
