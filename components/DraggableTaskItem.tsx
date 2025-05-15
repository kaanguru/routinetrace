import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Text, useTheme, useThemeMode } from "@rneui/themed";
import { memo } from "react";
import { ActivityIndicator, Pressable, View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import useChecklistItems from "~/hooks/useCheckListQueries";
import { TaskItemProps } from "~/types";
import shortenText from "~/utils/shortenText";
import AnimatedCheckBox from "./lotties/AnimatedCheckBox";
import themeStyles from "@/theme/themeStyles";

// Constants
const ITEM_HEIGHT = 99;

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

// Component
const DraggableTaskItem = memo(function TaskItem({
  task,
  index,
  onToggleComplete,
  onPress,
  isFiltered,
  dragActivator,
  isActive,
}: TaskItemProps & { dragActivator?: () => void; isActive?: boolean }) {
  const { mode } = useThemeMode();
  const { theme } = useTheme();
  const { checkListItemsLength, isCheckListItemsLoading } = useChecklistItems(
    task.id,
  );
  const taskHasChecklistItems = checkListItemsLength > 0;

  const handleToggleComplete = () => {
    onToggleComplete({ taskID: task.id, isComplete: !task.is_complete });
  };

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={["#6A18DC", "#5511b4", "#430e8f", "#350A71"]}
        style={styles.gradientContainer}
      >
        <Pressable
          onPress={handleToggleComplete}
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
                  color="white"
                  style={{ marginRight: 10 }}
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
          <Pressable
            onLongPress={dragActivator}
            style={styles.dragHandleContainer}
          >
            <FontAwesome5
              name="grip-vertical"
              size={18}
              color={mode === "light" ? theme.colors.white : theme.colors.black}
              style={styles.dragHandleIcon}
            />
          </Pressable>
        )}
      </LinearGradient>
    </View>
  );
}, areEqual);

export default DraggableTaskItem;
