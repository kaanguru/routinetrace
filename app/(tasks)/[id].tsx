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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  // Added null check for task
  if (!task) {
    return (
      <View className="flex-1 items-center justify-center">
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
    <ScrollView className=" bg-background-light dark:bg-background-dark flex-1">
      <View className="flex-1 ">
        <Header headerTitle="" />
        <View className="-mt-12 me-5 justify-end">
          <Pressable
            className="px-5"
            onPress={() => router.push(`/(tasks)/edit/${taskID}`)}
          >
            <FontAwesome6
              name="pencil"
              size={22}
              color={mode === "dark" ? "#FFFAEB" : "#051824"}
            />
          </Pressable>
          <Pressable className="me-1" onPress={() => setShowAlertDialog(true)}>
            <Ionicons
              name="trash-bin"
              size={24}
              color={mode === "dark" ? "#FF006E" : "#BE004E"}
            />
          </Pressable>
          <Dialog isVisible={showAlertDialog} onBackdropPress={handleClose}>
            <View className="bg-background-error h-[52px] w-[52px] items-center justify-center rounded-full">
              <Ionicons
                name="trash-bin"
                size={24}
                color={mode === "dark" ? "#FFFAEB" : "#051824"}
              />
            </View>
            <Dialog.Title title="Delete Task?" />
            <Text className="text-center text-sm">
              The Task will be deleted from the database. This cannot be undone.
            </Text>
            <Dialog.Button
              size="sm"
              title="Delete"
              onPress={() => handleDeleteTask(taskID)}
              className="px-[30px]"
            />
            <Dialog.Button
              title="Cancel"
              onPress={handleClose}
              size="sm"
              className="px-[30px]"
            />
          </Dialog>
        </View>
        <Card>
          <Text className=" text-typography-white dark:text-typography-black justify-self-center p-4 text-center text-2xl">
            {task.title}
          </Text>
          {task.notes && (
            <View className="bg-background-light rounded-sm p-3">
              <Markdown>{task.notes}</Markdown>
            </View>
          )}
          <Card.Divider className="my-3" />

          {/* Task Status */}
          <View className="mx-auto my-5 w-full items-center justify-center px-4">
            {toggleCompleteIsPending ? (
              <ActivityIndicator size="small" color="#8AC926" />
            ) : (
              <CheckBox
                size={24}
                checked={task.is_complete}
                onPress={handleToggleComplete}
                className="bg-background-light dark:bg-background-dark mx-auto rounded-md p-2"
                title="{task.is_complete ? 'Completed' : 'Not Completed'}"
                checkedIcon={
                  <FontAwesome6 name="check" size={16} color="#8AC926" />
                }
              />
            )}
          </View>
          {!task.repeat_period && (
            <Text className="text-typography-white dark:text-typography-black text-center">
              It is not a repeating task
            </Text>
          )}
          {task.repeat_period && (
            <View className="bg-gray.50 rounded-lg p-4">
              <View className="items-center justify-center">
                <MaterialCommunityIcons
                  name="calendar-sync"
                  size={24}
                  color="#CC9900"
                />
                <Text className="text-typography-white  dark:text-typography-black">
                  Every {task.repeat_frequency}{" "}
                  {getRepeatPeriodLabel(task.repeat_period)}{" "}
                </Text>
              </View>
              {task.repeat_on_wk && task.repeat_on_wk.length > 0 && (
                <View className="flex-wrap justify-center">
                  {task.repeat_on_wk.map((day) => (
                    <Badge key={day}>
                      <Text className="text-gray.700 p-3">{day}</Text>
                    </Badge>
                  ))}
                </View>
              )}
            </View>
          )}
        </Card>
        <View className="m-2  justify-between px-1">
          <View className="items-start px-2">
            <Text className="text-xs">start</Text>
            <Text>{new Date(task.created_at!).toLocaleDateString()}</Text>
            <Divider />
          </View>
          {task.updated_at && (
            <View className="items-end px-2">
              <Text className="text-xs">update</Text>
              <Text>{new Date(task.updated_at!).toLocaleDateString()}</Text>
              <Divider />
            </View>
          )}
        </View>

        {checklistItems && checklistItems.length > 0 ? (
          <View className="m-3 flex-col p-4">
            <View>
              <Text className="text-typography-black dark:text-typography-white pb-2 text-lg">
                Routine Steps
              </Text>
            </View>
            {checklistItems.map((item) => (
              <View key={item.id} className="my-2 flex-row items-center py-2">
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
          <Text className="text-muted dark:text-typography-white p-4 text-center">
            No Routines found. Edit Task to add some
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
