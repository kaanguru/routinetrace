/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
import Markdown from "react-native-markdown-display";

import Header from "@/components/Header";
import useChecklistItemMutations from "@/hooks/useCheckListMutations";
import useChecklistItemsQuery from "@/hooks/useCheckListQueries";
import { useDeleteTask, useToggleComplete } from "@/hooks/useTasksMutations";
import { useTaskById } from "@/hooks/useTasksQueries";
import getRepeatPeriodLabel from "@/utils/getRepeatPeriodLabel";

export default function TaskDetailPage() {
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
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  // Added null check for task
  if (!task) {
    return (
      <View>
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
    <ScrollView>
      <View>
        <Header headerTitle="" />
        <View>
          <Pressable onPress={() => router.push(`/(tasks)/edit/${taskID}`)}>
            <FontAwesome6
              name="pencil"
              size={22}
              color={mode === "dark" ? "#FFFAEB" : "#051824"}
            />
          </Pressable>
          <Pressable onPress={() => setShowAlertDialog(true)}>
            <Ionicons
              name="trash-bin"
              size={24}
              color={mode === "dark" ? "#FF006E" : "#BE004E"}
            />
          </Pressable>
          <Dialog isVisible={showAlertDialog} onBackdropPress={handleClose}>
            <View>
              <Ionicons
                name="trash-bin"
                size={24}
                color={mode === "dark" ? "#FFFAEB" : "#051824"}
              />
            </View>
            <Dialog.Title title="Delete Task?" />
            <Text>
              The Task will be deleted from the database. This cannot be undone.
            </Text>
            <Dialog.Button
              size="sm"
              title="Delete"
              onPress={() => handleDeleteTask(taskID)}
            />
            <Dialog.Button title="Cancel" onPress={handleClose} size="sm" />
          </Dialog>
        </View>
        <Card>
          <Text>{task.title}</Text>
          {task.notes && (
            <View>
              <Markdown>{task.notes}</Markdown>
            </View>
          )}
          <Card.Divider />

          {/* Task Status */}
          <View>
            {toggleCompleteIsPending ? (
              <ActivityIndicator size="small" color="#8AC926" />
            ) : (
              <CheckBox
                size={24}
                checked={task.is_complete}
                onPress={handleToggleComplete}
                title="{task.is_complete ? 'Completed' : 'Not Completed'}"
                checkedIcon={
                  <FontAwesome6 name="check" size={16} color="#8AC926" />
                }
              />
            )}
          </View>
          {!task.repeat_period && <Text>It is not a repeating task</Text>}
          {task.repeat_period && (
            <View>
              <View>
                <MaterialCommunityIcons
                  name="calendar-sync"
                  size={24}
                  color="#CC9900"
                />
                <Text>
                  Every {task.repeat_frequency}{" "}
                  {getRepeatPeriodLabel(task.repeat_period)}{" "}
                </Text>
              </View>
              {task.repeat_on_wk && task.repeat_on_wk.length > 0 && (
                <View>
                  {task.repeat_on_wk.map((day) => (
                    <Badge key={day}>
                      <Text>{day}</Text>
                    </Badge>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>
        <View>
          <View>
            <Text>start</Text>
            <Text>{new Date(task.created_at!).toLocaleDateString()}</Text>
            <Divider />
          </View>
          {task.updated_at && (
            <View>
              <Text>update</Text>
              <Text>{new Date(task.updated_at!).toLocaleDateString()}</Text>
              <Divider />
            </View>
          )}
        </View>

        {checklistItems && checklistItems.length > 0 ? (
          <View>
            <View>
              <Text>Routine Steps</Text>
            </View>
            {checklistItems.map((item) => (
              <View key={item.id}>
                <CheckBox
                  checked={item.is_complete}
                  onPress={() =>
                    updateChecklistItemCompletion({
                      id: item.id,
                      is_complete: !item.is_complete,
                    })
                  }
                  title={item.content}
                />
              </View>
            ))}
            <Divider />
          </View>
        ) : (
          <Text>No Routines found. Edit Task to add some</Text>
        )}
      </View>
    </ScrollView>
  );
}
