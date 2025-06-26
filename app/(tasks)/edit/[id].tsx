// app/(tasks)/edit/[id].tsx
// External Libraries
import { Ionicons } from "@expo/vector-icons";
import { Button, Text, useThemeMode }from "@rn-vui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Result, ok, err, ResultAsync } from "neverthrow";

// Components
import Header from "@/components/Header";
import Background from "@/components/Background";
import TaskDetailsForm from "@/components/edit/TaskDetailsForm";
import ChecklistEditor from "@/components/edit/ChecklistEditor";

// Styles
import {
  editStyles,
  getActionButtonsContainerStyle,
} from "@/theme/editCreateStyles";

// Hooks
import useChecklistItemMutations from "@/hooks/useCheckListMutations";
import useChecklistItems from "@/hooks/useCheckListQueries";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasksMutations";
import { useTaskById } from "@/hooks/useTasksQueries";

// Types
import { RepeatPeriod, TaskFormData, DayOfWeek } from "@/types";

// Utilities
import createTaskUpdate from "@/utils/edit/createTaskUpdate";
import validateEditFormData from "@/utils/edit/validateEditFormData";
import updateChecklistItemContentAtIndex from "@/utils/edit/updateChecklistItemContentAtIndex";

export default function EditTask() {
  // Theme and routing
  const { mode } = useThemeMode();
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();

  // Data fetching
  const { data: originalTask, isLoading: isTaskLoading } = useTaskById(taskID);
  const {
    checkListItems,
    isLoading: isCheckListItemsLoading,
    isError: isCheckListItemsError,
  } = useChecklistItems(taskID);

  // Mutations
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { updateChecklistItem } = useChecklistItemMutations(taskID);

  // --- State ---
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    notes: "",
    repeatPeriod: "",
    repeatFrequency: 1,
    repeatOnWk: [],
    customStartDate: null,
    isCustomStartDateEnabled: false,
    checklistItems: [],
  });
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- Derived State ---
  const isLoading = useMemo(
    () => isTaskLoading || isCheckListItemsLoading,
    [isTaskLoading, isCheckListItemsLoading],
  );

  // --- Effects ---
  useEffect(() => {
    function loadTaskData(): Result<void, Error> {
      if (!originalTask || isCheckListItemsLoading) {
        return ok(undefined);
      }

      try {
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: originalTask.title || "",
          notes: originalTask.notes || "",
          repeatPeriod: originalTask.repeat_period || "",
          repeatFrequency: originalTask.repeat_frequency || 1,
          repeatOnWk: originalTask.repeat_on_wk || [],
          customStartDate: originalTask.updated_at
            ? new Date(originalTask.updated_at)
            : new Date(),
          isCustomStartDateEnabled: !!originalTask.updated_at,
          checklistItems:
            checkListItems?.map((item) => ({
              id: item.id.toString(),
              content: item.content,
              isComplete: item.is_complete,
              position: item.position ?? 0,
            })) || [],
        }));
        return ok(undefined);
      } catch (error) {
        return err(new Error(`Failed to process task data: ${error}`));
      }
    }

    const result = loadTaskData();
    result.match(
      () => {},
      (error) => {
        console.error("Error in loadTaskData effect:", error);
        reportError(err(error));
      },
    );
  }, [originalTask, checkListItems, isCheckListItemsLoading]); // Dependencies

  // --- Form Field Setters (Passed to TaskDetailsForm) ---
  const setTitle = useCallback((title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  }, []);
  const setNotes = useCallback((notes: string) => {
    setFormData((prev) => ({ ...prev, notes }));
  }, []);
  const setRepeatPeriod = useCallback((value: RepeatPeriod | "" | null) => {
    setFormData((prev) => ({
      ...prev,
      repeatPeriod: value as RepeatPeriod | "",
    }));
  }, []);
  const setRepeatFrequency = useCallback((value: number) => {
    setFormData((prev) => ({ ...prev, repeatFrequency: value }));
  }, []);
  const toggleCustomStartDate = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      isCustomStartDateEnabled: !prev.isCustomStartDateEnabled,
    }));
  }, []);
  const setCustomStartDate = useCallback((date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, customStartDate: date }));
    }
  }, []);
  const toggleWeekDay = useCallback((day: DayOfWeek, isSelected: boolean) => {
    setFormData((prev) => {
      const currentlySelected = prev.repeatOnWk.includes(day);
      if (isSelected && !currentlySelected) {
        return { ...prev, repeatOnWk: [...prev.repeatOnWk, day] };
      } else if (!isSelected && currentlySelected) {
        return {
          ...prev,
          repeatOnWk: prev.repeatOnWk.filter((d) => d !== day),
        };
      }
      return prev;
    });
  }, []);

  // --- Checklist Item Handlers (Passed to ChecklistEditor) ---
  const handleAddChecklistItem = useCallback(() => {
    setFormData((prev) => {
      const newPosition = prev.checklistItems.length;
      const newItem: {
        id: string;
        content: string;
        isComplete: boolean;
        position: number;
      } = {
        id: `new-${Date.now()}-${newPosition}`,
        content: "",
        isComplete: false,
        position: newPosition,
      };
      const updatedItems = [...prev.checklistItems, newItem].map(
        (item, index) => ({
          ...item,
          position: index,
        }),
      );
      return { ...prev, checklistItems: updatedItems };
    });

    setEditingItemIndex(formData.checklistItems.length);
  }, [formData.checklistItems.length]);

  const handleRemoveChecklistItem = useCallback(
    (indexToRemove: number) => {
      setFormData((prev) => {
        const filteredItems = prev.checklistItems.filter(
          (_, i) => i !== indexToRemove,
        );
        const itemsWithUpdatedPositions = filteredItems.map((item, index) => ({
          ...item,
          position: index,
        }));
        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });

      if (editingItemIndex === indexToRemove) {
        setEditingItemIndex(null);
      } else if (
        editingItemIndex !== null &&
        editingItemIndex > indexToRemove
      ) {
        setEditingItemIndex(editingItemIndex - 1);
      }
    },
    [editingItemIndex],
  );

  const handleUpdateChecklistItemContent = useCallback(
    (index: number, content: string) => {
      setFormData((prev) =>
        updateChecklistItemContentAtIndex(prev, index, content),
      );
    },
    [],
  );

  const handleMoveChecklistItemUp = useCallback(
    (index: number) => {
      if (index <= 0) return;
      setFormData((prev) => {
        const newItems = [...prev.checklistItems];
        [newItems[index], newItems[index - 1]] = [
          newItems[index - 1],
          newItems[index],
        ];
        const itemsWithUpdatedPositions = newItems.map((item, idx) => ({
          ...item,
          position: idx,
        }));
        if (editingItemIndex === index) setEditingItemIndex(index - 1);
        else if (editingItemIndex === index - 1) setEditingItemIndex(index);
        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });
    },
    [editingItemIndex],
  );

  const handleMoveChecklistItemDown = useCallback(
    (index: number) => {
      setFormData((prev) => {
        if (index >= prev.checklistItems.length - 1) return prev;
        const newItems = [...prev.checklistItems];
        [newItems[index], newItems[index + 1]] = [
          newItems[index + 1],
          newItems[index],
        ];
        const itemsWithUpdatedPositions = newItems.map((item, idx) => ({
          ...item,
          position: idx,
        }));
        if (editingItemIndex === index) setEditingItemIndex(index + 1);
        else if (editingItemIndex === index + 1) setEditingItemIndex(index);
        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });
    },
    [editingItemIndex],
  );

  // --- Main Actions ---
  const handleSave = useCallback(() => {
    const validationResult = validateEditFormData(formData);
    validationResult.match(
      () => {
        if (!originalTask || !taskID) {
          const err = new Error("Task data or ID is missing for update.");
          console.error(err);
          reportError(err);
          Alert.alert("Error", "Cannot save task. Data is incomplete.");
          return;
        }

        const taskUpdatePayload = createTaskUpdate(
          formData,
          originalTask,
          taskID,
        );

        const updateTaskPromise = ResultAsync.fromPromise(
          updateTaskMutation.mutateAsync(taskUpdatePayload),
          (e) =>
            new Error(
              `Task update failed: ${
                e instanceof Error ? e.message : String(e)
              }`,
            ),
        );

        updateTaskPromise.match(
          () => {
            updateChecklistItem(formData);

            router.back();
          },
          (error) => {
            console.error("Task update failed:", error);
            reportError(error); // Use the error object directly
            Alert.alert("Error", `Failed to update task: ${error.message}`);
          },
        );
      },
      (validationError) => {
        Alert.alert("Validation Error", validationError.message);
      },
    );
  }, [
    formData,
    originalTask,
    taskID,
    updateTaskMutation,
    updateChecklistItem,
    router,
  ]);

  const handleDelete = useCallback(() => {
    const confirmAndDelete = (): ResultAsync<void, Error> => {
      if (!taskID) {
        return ResultAsync.fromPromise(
          Promise.reject(new Error("Task ID is not available")),
          (e) => e as Error,
        );
      }
      return ResultAsync.fromPromise(
        deleteTaskMutation.mutateAsync(taskID),
        (e) =>
          new Error(
            `Deletion failed: ${e instanceof Error ? e.message : String(e)}`,
          ),
      );
    };

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          confirmAndDelete().match(
            () => {
              router.push("/(drawer)");
            },
            (error) => {
              console.error("Task deletion failed:", error);
              reportError(error);
              Alert.alert("Error", `Failed to delete task: ${error.message}`);
            },
          );
        },
      },
    ]);
  }, [deleteTaskMutation, taskID, router]);

  // --- Render Logic ---
  if (isLoading && !originalTask) {
    // Show loading only on initial load
    return (
      <Background>
        <Header headerTitle={"Loading Task..."} />
        <View style={editStyles.centered}>
          <ActivityIndicator size="large" color="#ff006e" />
        </View>
      </Background>
    );
  }

  if (!originalTask && !isLoading) {
    // Handle error case where task couldn't be fetched
    return (
      <Background>
        <Header headerTitle={"Error"} />
        <View style={editStyles.centered}>
          <Text style={editStyles.errorText}>Failed to load task details.</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </Background>
    );
  }

  const actionButtonsContainerStyle = getActionButtonsContainerStyle(mode);

  return (
    <Background>
      <Header headerTitle={formData.title || "Edit Task"} />
      <KeyboardAvoidingView
        behavior="height"
        style={{ flex: 1, justifyContent: "center" }}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Render Task Details Form */}
          <TaskDetailsForm
            formData={formData}
            setTitle={setTitle}
            setNotes={setNotes}
            setRepeatPeriod={setRepeatPeriod}
            setRepeatFrequency={setRepeatFrequency}
            toggleWeekDay={toggleWeekDay}
            toggleCustomStartDate={toggleCustomStartDate}
            setCustomStartDate={setCustomStartDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />

          {/* Render Checklist Editor */}
          <ChecklistEditor
            checklistItems={formData.checklistItems}
            editingItemIndex={editingItemIndex}
            setEditingItemIndex={setEditingItemIndex}
            onAddItem={handleAddChecklistItem}
            onRemoveItem={handleRemoveChecklistItem}
            onUpdateItem={handleUpdateChecklistItemContent}
            onMoveItemUp={handleMoveChecklistItemUp}
            onMoveItemDown={handleMoveChecklistItemDown}
            isLoading={isCheckListItemsLoading && !checkListItems}
            isError={isCheckListItemsError}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Action Buttons */}
      <View style={actionButtonsContainerStyle}>
        <Button
          size="sm"
          onPress={handleDelete}
          title="Delete"
          disabled={deleteTaskMutation.isPending}
          buttonStyle={editStyles.deleteButton}
          titleStyle={editStyles.actionButtonTitle}
          icon={
            <Ionicons
              name="trash-bin"
              size={18}
              color="#FFFAEB"
              style={{ marginRight: 6 }}
            />
          }
        />
        <Button
          size="sm"
          onPress={handleSave}
          testID="save-task-button"
          disabled={updateTaskMutation.isPending}
          title={updateTaskMutation.isPending ? "Saving..." : "Save"}
          buttonStyle={editStyles.saveButton}
          titleStyle={editStyles.actionButtonTitle}
          icon={
            updateTaskMutation.isPending ? (
              <ActivityIndicator
                size="small"
                color="#FFFAEB"
                style={editStyles.actionButtonIcon}
              />
            ) : (
              <Ionicons
                name="save"
                size={18}
                color="#FFFAEB"
                style={editStyles.actionButtonIcon}
              />
            )
          }
        />
      </View>
    </Background>
  );
}
