import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Text, useThemeMode } from "@rneui/themed";
import { memo } from "react";
import { ActivityIndicator, Pressable, View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import useChecklistItems from "~/hooks/useCheckListQueries";
import { TaskItemProps } from "~/types";
import shortenText from "~/utils/shortenText";
import AnimatedCheckBox from "./lotties/AnimatedCheckBox";
import { LinearGradient } from "expo-linear-gradient";

// Constants
const ITEM_HEIGHT = 99;
const MAX_INDEX = 20;
const ANIMATION_DURATION = 600;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    height: 99,
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 1,
    borderRadius: 10,
    paddingHorizontal: 0,
    opacity: 1,
    elevation: 10,
  },
  gradientContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  checkboxContainer: {
    alignSelf: "center",
    height: "33%",
    justifyContent: "center",
    padding: 15,
  },
  checkboxBackground: {
    backgroundColor: "#FFFCF4",
    padding: -1,
    borderRadius: 9,
  },
  contentContainer: {
    flexDirection: "column",
    flexGrow: 1,
    alignSelf: "center",
    height: "100%",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  titleText: {
    flexGrow: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 1,
  },
  notesContainer: {
    backgroundColor: "#23074B",
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 5,
    zIndex: -10,
    maxHeight: 18,
    borderRadius: 2,
    paddingHorizontal: 1,
    paddingBottom: 5,
  },
  notesText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#fff",
    fontSize: 12,
  },
  dragHandleContainer: {
    alignSelf: "center",
    height: "100%",
    width: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  dragHandleIcon: {
    marginEnd: 10,
  },
});

// Helper functions
const areEqual = (prevProps: TaskItemProps, nextProps: TaskItemProps) =>
  prevProps.task.id === nextProps.task.id &&
  prevProps.task.title === nextProps.task.title &&
  prevProps.task.is_complete === nextProps.task.is_complete &&
  prevProps.index === nextProps.index;

// components/DraggableTaskItem.tsx
const useDragAnimation = (
  index: number,
  onReorder: (from: number, to: number) => void
) => {
  const translateY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const zIndex = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      zIndex.value = 100;
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd(() => {
      const newIndex = Math.round(translateY.value / ITEM_HEIGHT) + index;
      if (newIndex !== index && newIndex >= 0 && newIndex < MAX_INDEX) {
        runOnJS(onReorder)(index, newIndex);
      }
      translateY.value = withSpring(0);
      zIndex.value = 0;
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: isDragging.value ? 1.05 : 1 },
    ],
    zIndex: isDragging ? 999 : 0,
    borderWidth: isDragging.value ? 2 : 0,
    borderColor: isDragging.value ? "#FF99C5" : "transparent",
    borderRadius: isDragging.value ? 10 : 0,
  }));

  return { panGesture, animatedStyle };
};

const useFadeAnimation = (callback: () => void) => {
  const opacity = useSharedValue(1);

  const handleFadeOut = () => {
    opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    callback();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
    height: opacity.value * ITEM_HEIGHT,
  }));

  return { handleFadeOut, animatedStyle };
};

// Component
const DraggableTaskItem = memo(function TaskItem({
  task,
  index,
  onReorder,
  onToggleComplete,
  onPress,
  isFiltered,
}: TaskItemProps) {
  const { mode } = useThemeMode();
  const { checkListItemsLength, isCheckListItemsLoading } = useChecklistItems(
    task.id
  );
  const taskHasChecklistItems = checkListItemsLength > 0;

  const { panGesture, animatedStyle: dragStyle } = useDragAnimation(
    index,
    onReorder
  );
  const { handleFadeOut, animatedStyle: fadeStyle } = useFadeAnimation(() =>
    onToggleComplete({ taskID: task.id, isComplete: !task.is_complete })
  );

  const combinedStyle = [dragStyle, fadeStyle];

  return (
    <Animated.View style={combinedStyle}>
      <View style={styles.container}>
        <LinearGradient
          colors={["#6A18DC", "#5511b4", "#430e8f", "#350A71"]}
          style={styles.gradientContainer}
        >
          <Pressable
            onPress={handleFadeOut}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            style={styles.checkboxContainer}
          >
            <View style={styles.checkboxBackground}>
              <AnimatedCheckBox />
            </View>
          </Pressable>

          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            style={styles.contentContainer}
          >
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{task.title}</Text>

              {taskHasChecklistItems && !isCheckListItemsLoading ? (
                <View
                  style={{
                    marginEnd: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Text style={{ marginRight: 1, color: "white" }}>
                    {checkListItemsLength}
                  </Text>
                  <MaterialIcons
                    name="event-repeat"
                    size={16}
                    color={mode === "light" ? "#FFFAEB" : "#051824"}
                  />
                </View>
              ) : (
                isCheckListItemsLoading && (
                  <ActivityIndicator size="small" color="#FF006E" />
                )
              )}
            </View>

            {task.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{shortenText(task.notes)}</Text>
              </View>
            )}
          </Pressable>

          {isFiltered && (
            <GestureDetector gesture={panGesture}>
              <View style={styles.dragHandleContainer}>
                <FontAwesome5
                  name="grip-vertical"
                  size={18}
                  color={mode === "light" ? "#FFFAEB" : "#051824"}
                  style={styles.dragHandleIcon}
                />
              </View>
            </GestureDetector>
          )}
        </LinearGradient>
      </View>
    </Animated.View>
  );
},
areEqual);

export default DraggableTaskItem;
