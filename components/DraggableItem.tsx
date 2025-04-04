import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useThemeMode, Input } from "@rneui/themed";
import { useEffect, memo } from "react";
import { Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

import { TaskFormData } from "~/types";

const ITEM_HEIGHT = 40;

const DraggableItem = memo(
  ({
    item,
    index,
    isDragging,
    onUpdate,
    onRemove,
    position,
    onDragStart,
    onDragEnd,
  }: Readonly<{
    item: TaskFormData["checklistItems"][number];
    index: number;
    isDragging: boolean;
    onUpdate: (index: number, content: string) => void;
    onRemove: (index: number) => void;
    position: number;
    onDragStart: () => void;
    onDragEnd: (translationY: number) => void;
  }>) => {
    const animatedValue = useSharedValue(position * ITEM_HEIGHT);
    const { mode } = useThemeMode();

    useEffect(() => {
      animatedValue.value = position * ITEM_HEIGHT;
    }, [animatedValue, position]);

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        runOnJS(onDragStart)();
      })
      .onChange((event) => {
        animatedValue.value = event.translationY + position * ITEM_HEIGHT;
      })
      .onEnd((event) => {
        runOnJS(onDragEnd)(event.translationY);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: animatedValue.value }],
      zIndex: isDragging ? 1 : 0,
      position: "relative",
      left: 0,
      right: 0,
    }));

    return (
      <Animated.View style={animatedStyle}>
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
          <GestureDetector gesture={panGesture}>
            <Animated.View>
              <FontAwesome5
                name="grip-vertical"
                size={18}
                color={mode === "dark" ? "#FFFAEB" : "#051824"}
                style={{ paddingTop: 10 }}
              />
            </Animated.View>
          </GestureDetector>
          <Input
            placeholder="Checklist item"
            value={item.content}
            onChangeText={(text) => {
              onUpdate(index, text);
            }}
            placeholderTextColor="#9CA3AF"
            autoFocus
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
  }
);
DraggableItem.displayName = "DraggableItem";

export default DraggableItem;
