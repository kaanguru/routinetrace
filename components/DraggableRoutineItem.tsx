import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useThemeMode, Input } from "@rneui/themed";
import { memo } from "react";
import { Pressable, View } from "react-native";
import Animated from "react-native-reanimated";

import type { TaskFormData } from "~/types";

export const ITEM_HEIGHT = 45;

const DraggableRoutineItem = memo(
  ({
    item,
    drag,
    isActive,
    onUpdate,
    onRemove,
    index,
  }: Readonly<{
    item: TaskFormData["checklistItems"][number];
    drag: () => void;
    isActive: boolean;
    onUpdate: (index: number, content: string) => void;
    onRemove: (index: number) => void;
    index: number;
  }>) => {
    const { mode } = useThemeMode();

    return (
      <Animated.View
        style={{
          opacity: isActive ? 0.9 : 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "86%",
            justifyContent: "flex-start",
            backgroundColor: mode === "dark" ? "#051824" : "#FFFAEB",
            alignItems: "flex-start",
            height: ITEM_HEIGHT,
          }}
        >
          <Pressable
            onLongPress={drag}
            style={{ paddingTop: 10, marginRight: 6 }}
          >
            <FontAwesome5
              name="grip-vertical"
              size={18}
              color={mode === "dark" ? "#FFFAEB" : "#051824"}
            />
          </Pressable>
          <Input
            placeholder="Checklist item"
            value={item.content}
            onChangeText={(text) => {
              onUpdate(index, text);
            }}
            placeholderTextColor="#9CA3AF"
            autoFocus={false}
            style={{
              color: mode === "dark" ? "#FFFAEB" : "#051824",
              fontSize: 16,
            }}
          />
          <Pressable
            onPress={() => onRemove(index)}
            hitSlop={10}
            style={{ padding: 10 }}
          >
            <Ionicons
              name="trash-bin"
              size={24}
              color={mode === "dark" ? "#FFFAEB" : "#051824"}
            />
          </Pressable>
        </View>
      </Animated.View>
    );
  },
);
DraggableRoutineItem.displayName = "DraggableRoutineItem";

export default DraggableRoutineItem;
