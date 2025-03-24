import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Text, CheckBox, useThemeMode } from "@rneui/themed";
import { memo } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Markdown from "react-native-markdown-display";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import AnimatedCheckView from "./lotties/AnimatedCheckBox";

import useChecklistItems from "~/hooks/useCheckListQueries";
import { TaskItemProps } from "~/types";
import shortenText from "~/utils/shortenText";
import AnimatedCheckBox from "./lotties/AnimatedCheckBox";

const areEqual = (
  prevProps: Readonly<TaskItemProps>,
  nextProps: Readonly<TaskItemProps>
) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.is_complete === nextProps.task.is_complete &&
    prevProps.index === nextProps.index
  );
};

export const TaskItem = memo(
  ({
    task,
    index,
    onReorder,
    onToggleComplete,
    onPress,
    isFiltered,
  }: Readonly<TaskItemProps>) => {
    const pressed = useSharedValue(false);
    const itemHeight = 94;
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);

    const { checkListItemsLength, isCheckListItemsLoading } = useChecklistItems(
      task.id
    );
    const { mode } = useThemeMode();

    const taskHasChecklistItems = checkListItemsLength > 0;
    const panGesture = Gesture.Pan()
      .onStart(() => {
        isDragging.value = true;
      })
      .onUpdate((event) => {
        translateY.value = event.translationY;
      })
      .onEnd(() => {
        const newIndex = Math.round(translateY.value / itemHeight) + index;
        if (newIndex !== index && newIndex >= 0 && newIndex < 20) {
          runOnJS(onReorder)(index, newIndex);
        }
        translateY.value = withSpring(0);
        pressed.value = false;
      })
      .enabled(isFiltered);

    const opacity = useSharedValue(1);
    const handleFadeOut = () => {
      opacity.value = withTiming(0, {
        duration: 300,
      });
    };
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      zIndex: isDragging.value ? 1 : 0,
      opacity: opacity.value,
    }));

    const handleToggleComplete = () => {
      handleFadeOut();
      onToggleComplete({ taskID: task.id, isComplete: !task.is_complete });
    };
    return (
      <Animated.View style={animatedStyle}>
        <View
          style={{
            backgroundColor: "#4F10A8",
            flexDirection: "row",
            height: 99,
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 1,
            borderRadius: 8,
            paddingHorizontal: 0,
            opacity: 1,
          }}
        >
          <Pressable
            onPress={handleToggleComplete}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            style={{
              alignSelf: "center",
              height: "33%",
              justifyContent: "center",
              padding: 15,
            }}
          >
            <View
              style={{
                backgroundColor: "#D1B5F8",
                padding: -1,
                borderRadius: 6,
              }}
            >
              <AnimatedCheckBox />
            </View>
          </Pressable>

          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            style={{
              flexDirection: "column",
              flexGrow: 1,
              alignSelf: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  flexGrow: 1,
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  marginRight: 1,
                }}
              >
                {task.title}
              </Text>

              {taskHasChecklistItems && !isCheckListItemsLoading ? (
                <>
                  <Text
                    style={{
                      marginRight: 1,
                      color: "white",
                    }}
                  >
                    {checkListItemsLength}
                  </Text>
                  <MaterialIcons
                    name="event-repeat"
                    size={16}
                    color={mode === "light" ? "#FFFAEB" : "#051824"}
                  />
                </>
              ) : (
                isCheckListItemsLoading && (
                  <ActivityIndicator size="small" color="#FF006E" />
                )
              )}
            </View>
            {task.notes && (
              <View
                style={{
                  backgroundColor: "#23074B",
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 1,
                  zIndex: -10,
                  maxHeight: 18,
                  borderRadius: 2,
                  paddingHorizontal: 1,
                  paddingBottom: 5,
                }}
              >
                <Markdown
                  mergeStyle={false}
                  style={{
                    body: {
                      padding: 0,
                      marginTop: -11,
                      height: 40,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                    text: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#fff",
                      fontSize: 12,
                    },
                  }}
                >
                  {shortenText(task.notes)}
                </Markdown>
              </View>
            )}
          </Pressable>
          {isFiltered && (
            <GestureDetector gesture={panGesture}>
              <View
                style={{
                  alignSelf: "center",
                  height: "100%",
                  width: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginEnd: 10,
                }}
              >
                <FontAwesome5
                  name="grip-vertical"
                  size={18}
                  color={mode === "light" ? "#FFFAEB" : "#051824"}
                />
              </View>
            </GestureDetector>
          )}
        </View>
      </Animated.View>
    );
  },
  areEqual
);
