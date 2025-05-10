/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import {
  Badge,
  Dialog,
  useThemeMode,
  Card,
  Button,
  CheckBox,
  Divider,
} from "@rneui/themed";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  Pressable,
} from "react-native";

import Header from "@/components/Header";
import useChecklistItemMutations from "@/hooks/useCheckListMutations";
import useChecklistItemsQuery from "@/hooks/useCheckListQueries";
import { useDeleteTask, useToggleComplete } from "@/hooks/useTasksMutations";
import { useTaskById } from "@/hooks/useTasksQueries";
import getRepeatPeriodLabel from "@/utils/getRepeatPeriodLabel";
import Background from "@/components/Background";

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  actionsContainer: {
    marginTop: -45,
    marginRight: 5,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    paddingHorizontal: 15,
  },
  taskTitle: {
    fontFamily: "DelaGothicOne_400Regular",
    fontSize: 26,
    marginBottom: 8,
  },
  taskNotes: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 8,
  },
  statusContainer: {
    marginVertical: 12,
  },
  repeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  repeatText: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16,
    marginLeft: 8,
  },
  dayBadgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  dateInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  dateLabel: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 14,
    color: "#666",
  },
  dateValue: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 20,
    marginTop: 16,
    marginBottom: 12,
  },
  checklistItem: {
    marginLeft: -8,
  },
  emptyMessage: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 24,
  },
});

export default function TaskDetailPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { data: checklistItems, isLoading: isChecklistItemsLoading } =
    useChecklistItemsQuery(taskID);
  const { updateChecklistItemCompletion } = useChecklistItemMutations(taskID);
  const {
    mutate: toggleComplete,
    isError: isToggleCompleteError,
    error: toggleCompleteError,
    isPending: toggleCompleteIsPending,
  } = useToggleComplete();

  const {
    data: task,
    isLoading,
    isError,
    error,
    refetch,
  } = useTaskById(taskID);
  const { mutate: deleteTask } = useDeleteTask();
  const { mode, setMode } = useThemeMode();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleToggleComplete = () => {
    if (task) {
      toggleComplete({ taskID: +taskID, isComplete: !task.is_complete });
    }
    refetch();
  };

  if (!task || isChecklistItemsLoading) {
    return (
      <Background>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </Background>
    );
  }
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  // Added null check for task
  if (!task) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Task not found.</Text>
      </View>
    );
  }
  const handleDeleteTask = (taskID: string): void => {
    setShowAlertDialog(false);
    deleteTask(taskID);
    router.push("/(drawer)");
  };
  return (
    <Background>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header headerTitle="" />
          <View style={styles.actionsContainer}>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push(`/(tasks)/edit/${taskID}`)}
            >
              <FontAwesome6
                name="pencil"
                size={22}
                color={mode === "dark" ? "#FFFAEB" : "#051824"}
              />
            </Pressable>
            <Pressable
              style={{ marginEnd: 10 }}
              onPress={() => setShowAlertDialog(true)}
            >
              <Ionicons
                name="trash-bin"
                size={24}
                color={mode === "dark" ? "#FF006E" : "#BE004E"}
              />
            </Pressable>
            <Dialog
              isVisible={showAlertDialog}
              onBackdropPress={handleClose}
              overlayStyle={{
                backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF",
                borderRadius: 16,
              }}
            >
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: theme.colors.warning + "20",
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons
                  name="trash-bin"
                  size={24}
                  color={theme.colors.warning}
                />
              </View>
              <Dialog.Title
                title="Delete Task?"
                titleStyle={{
                  fontFamily: "Ubuntu_700Bold",
                  color: theme.colors.black,
                  textAlign: "center",
                }}
              />
              <Text
                style={{
                  fontFamily: "Ubuntu_400Regular",
                  color: theme.colors.black,
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                The Task will be deleted from the database. This cannot be
                undone.
              </Text>
              <Dialog.Actions>
                <Dialog.Button
                  title="Delete"
                  onPress={() => handleDeleteTask(taskID)}
                  titleStyle={{ color: theme.colors.warning }}
                />
                <Dialog.Button
                  title="Cancel"
                  onPress={handleClose}
                  titleStyle={{ color: theme.colors.primary }}
                />
              </Dialog.Actions>
            </Dialog>
          </View>
          <Card
            containerStyle={{
              borderRadius: 12,
              borderColor: theme.colors.greyOutline,
              marginBottom: 16,
              backgroundColor: theme.colors.background,
              padding: 16,
            }}
          >
            <Text style={[styles.taskTitle, { color: theme.colors.black }]}>
              {task.title}
            </Text>
            {task.notes && (
              <View
                style={{
                  borderRadius: 4,
                  backgroundColor: mode === "dark" ? "#1E1E1E" : "#F5F5F5",
                  padding: 12,
                  marginBottom: 8,
                }}
              >
                <Text style={[styles.taskNotes, { color: theme.colors.black }]}>
                  {task.notes}
                </Text>
              </View>
            )}
            <Card.Divider style={{ backgroundColor: theme.colors.divider }} />

            {/* Task Status */}
            <View>
              {toggleCompleteIsPending ? (
                <ActivityIndicator size="small" color="#8AC926" />
              ) : (
                <CheckBox
                  size={24}
                  checked={task.is_complete}
                  onPress={handleToggleComplete}
                  title={task.is_complete ? "Completed" : "Not Completed"}
                  containerStyle={styles.statusContainer}
                  textStyle={{
                    fontFamily: "Ubuntu_400Regular",
                    color: task.is_complete ? "#8AC926" : undefined,
                  }}
                  checkedIcon={
                    <FontAwesome6 name="check" size={16} color="#8AC926" />
                  }
                />
              )}
            </View>
            {!task.repeat_period && (
              <Text style={{ fontFamily: "Ubuntu_400Regular", color: "#666" }}>
                It is not a repeating task
              </Text>
            )}
            {task.repeat_period && (
              <View style={{ marginTop: 12 }}>
                <View style={styles.repeatContainer}>
                  <MaterialCommunityIcons
                    name="calendar-sync"
                    size={24}
                    color="#1982C4"
                  />
                  <Text style={styles.repeatText}>
                    Every {task.repeat_frequency}{" "}
                    {getRepeatPeriodLabel(task.repeat_period)}
                  </Text>
                </View>
                {task.repeat_on_wk && task.repeat_on_wk.length > 0 && (
                  <View style={styles.dayBadgeContainer}>
                    {task.repeat_on_wk.map((day) => (
                      <Badge
                        key={day}
                        value={day}
                        badgeStyle={{ backgroundColor: "#1982C4" }}
                        textStyle={{
                          fontFamily: "Ubuntu_500Medium",
                          color: "#FFFAEB",
                        }}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}
          </Card>
          {/* Start & Last Updated Dates - Two Column Layout */}
          <View style={{ margin: 16 }}>
            {/* Row 1 - Titles */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              {/* Start Title */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                }}
              >
                <MaterialCommunityIcons
                  name="calendar-start"
                  size={20}
                  color={theme.colors.black}
                />
                <Text style={[styles.dateLabel, { color: theme.colors.black }]}>
                  Start
                </Text>
              </View>

              {/* Last Updated Title (if available) */}
              {task.updated_at && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                    justifyContent: "flex-end",
                  }}
                >
                  <MaterialCommunityIcons
                    name="calendar-edit"
                    size={20}
                    color={theme.colors.black}
                  />
                  <Text
                    style={[styles.dateLabel, { color: theme.colors.black }]}
                  >
                    Last Updated
                  </Text>
                </View>
              )}
            </View>

            {/* Row 2 - Date Values */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* Start Date Value */}
              <Text
                style={[
                  styles.dateValue,
                  {
                    color: theme.colors.black,
                    fontFamily: "Ubuntu_500Medium",
                    flex: 1,
                  },
                ]}
              >
                {new Date(task.created_at!).toLocaleDateString()}
              </Text>

              {/* Last Updated Date Value (if available) */}
              {task.updated_at && (
                <Text
                  style={[
                    styles.dateValue,
                    {
                      color: theme.colors.black,
                      fontFamily: "Ubuntu_500Medium",
                      flex: 1,
                      textAlign: "right",
                    },
                  ]}
                >
                  {new Date(task.updated_at!).toLocaleDateString()}
                </Text>
              )}
            </View>
            <Divider
              style={{
                backgroundColor: theme.colors.divider,
                marginTop: 12,
              }}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <View
              style={[
                styles.sectionTitle,
                { flexDirection: "row", alignItems: "center", gap: 8 },
              ]}
            >
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={24}
                color={theme.colors.black}
              />
              <Text
                style={{
                  fontFamily: "Ubuntu_700Bold",
                  fontSize: 20,
                  color: theme.colors.black,
                }}
              >
                Routine Steps
              </Text>
            </View>
            <Divider style={{ backgroundColor: theme.colors.divider }} />
          </View>
          {checklistItems && checklistItems.length > 0 ? (
            <View style={{ marginBottom: 16 }}>
              {checklistItems.map((item) => (
                <CheckBox
                  key={item.id}
                  checked={item.is_complete}
                  onPress={() =>
                    updateChecklistItemCompletion({
                      id: item.id,
                      is_complete: !item.is_complete,
                    })
                  }
                  title={item.content}
                  containerStyle={styles.checklistItem}
                  textStyle={{
                    fontFamily: "Ubuntu_400Regular",
                    textDecorationLine: item.is_complete
                      ? "line-through"
                      : undefined,
                    color: item.is_complete ? "#888" : undefined,
                  }}
                />
              ))}
              <Divider />
            </View>
          ) : (
            <Text style={[styles.emptyMessage, { color: theme.colors.grey2 }]}>
              No Routines found. Edit Task to add some
            </Text>
          )}
        </View>
      </ScrollView>
    </Background>
  );
}
