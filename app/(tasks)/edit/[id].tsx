// app/(tasks)/edit/[id].tsx
// External Libraries
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, CheckBox, Input, Text, useThemeMode } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Result, ok, err } from "neverthrow";
import { ErrorBoundary } from "react-error-boundary";
import { useRenderInfo } from "@uidotdev/usehooks";

// Components
import TaskFormInput from "@/components/TaskFormInput";
import Header from "@/components/Header";
import RepeatFrequencySlider from "@/components/RepeatFrequencySlider";
import RepeatPeriodSelector from "@/components/RepeatPeriodSelector";
import WeekdaySelector from "@/components/WeekDaySelector";
import Background from "@/components/Background";
import ErrorFallback from "@/components/error/ErrorFallback";

// Hooks
import useChecklistItemMutations from "@/hooks/useCheckListMutations";
import useChecklistItems from "@/hooks/useCheckListQueries";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasksMutations";
import { useTaskById } from "@/hooks/useTasksQueries";

// Types
import { RepeatPeriod, TaskFormData, DayOfWeek } from "@/types";

// Utilities
import createTaskUpdate from "@/utils/createTaskUpdate";
import handleErrorBoundaryError from "@/utils/errorHandler";

export default function EditTask() {
  // Debug
  const info = useRenderInfo("EditTaskScreen");
  console.log(info?.name + " renders: " + info?.renders);

  // Theme and routing
  const { mode } = useThemeMode();
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();

  // Data fetching
  const { data: theTask, isLoading } = useTaskById(taskID);
  const { checkListItems, isCheckListItemsLoading, isCheckListItemsError } =
    useChecklistItems(taskID);

  // Mutations
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { updateChecklistItem } = useChecklistItemMutations(taskID);

  // Form state
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

  // Form handlers
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
      setFormData((prev) => ({
        ...prev,
        customStartDate: date,
      }));
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
      } else {
        return prev;
      }
    });
  }, []);
  // --- End State setter callbacks ---

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const loading = useMemo(
    () => initialLoad || isLoading || isCheckListItemsLoading,
    [initialLoad, isLoading, isCheckListItemsLoading]
  );

  useEffect(() => {
    function loadTaskData(): Result<void, Error> {
      if (!theTask) {
        return ok(undefined);
      }
      if (isCheckListItemsLoading && initialLoad) {
        return ok(undefined);
      }

      try {
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: theTask.title || "",
          notes: theTask.notes || "",
          repeatPeriod: theTask.repeat_period || "",
          repeatFrequency: theTask.repeat_frequency || 1,
          repeatOnWk: theTask.repeat_on_wk || [],
          customStartDate: theTask.created_at
            ? new Date(theTask.created_at)
            : new Date(),
          isCustomStartDateEnabled: !!theTask.created_at,
          checklistItems:
            checkListItems?.map((item) => ({
              id: item.id.toString(),
              content: item.content,
              isComplete: item.is_complete,
              position: item.position ?? 0,
            })) || [],
        }));
        if (!isCheckListItemsLoading) {
          setInitialLoad(false);
        }
        return ok(undefined);
      } catch (error) {
        setInitialLoad(false);
        return err(new Error(`Failed to process task data: ${error}`));
      }
    }

    const result = loadTaskData();
    result.match(
      () => {}, // Success handled within function
      (error) => {
        console.error("Error in loadTaskData effect:", error);
        // Avoid alerting during initial load phases
        if (!initialLoad) {
          Alert.alert("Error", "Failed to load task data. Please try again.");
        }
      }
    );
    // Depend on theTask and checkListItems directly
  }, [theTask, checkListItems, isCheckListItemsLoading, initialLoad]);

  // --- Handlers (useCallback where dependencies are stable or simple) ---
  const handleSave = useCallback(() => {
    function validateAndUpdate(): Result<void, Error> {
      if (!theTask) {
        return err(new Error("Task data is not available"));
      }

      if (!formData.title.trim()) {
        return err(new Error("Task title cannot be empty"));
      }

      const taskToUpdate = createTaskUpdate(formData, theTask, taskID);

      updateTaskMutation.mutate(taskToUpdate, {
        onSuccess: () => {
          updateChecklistItem(formData); // Update checklist items after task update succeeds
          router.back();
        },
        onError: (error) => {
          console.error("Task update failed:", error);
          Alert.alert("Error", "Failed to update task");
        },
      });

      return ok(undefined);
    }

    const result = validateAndUpdate();
    result.match(
      () => {}, // Success: Mutation handles feedback
      (error) => {
        Alert.alert("Validation Error", error.message); // More specific alert title
      }
    );
  }, [
    theTask,
    formData,
    updateTaskMutation,
    router,
    taskID,
    updateChecklistItem,
  ]);

  const handleDelete = useCallback(() => {
    function confirmAndDelete(): Result<void, Error> {
      if (!taskID) {
        return err(new Error("Task ID is not available"));
      }

      deleteTaskMutation.mutate(taskID, {
        onSuccess: () => {
          // Navigate only after successful deletion
          router.push("/(drawer)");
        },
        onError: (error) => {
          console.error("Task deletion failed:", error);
          Alert.alert("Error", "Failed to delete task.");
        },
      });

      return ok(undefined);
    }

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          const result = confirmAndDelete();
          result.match(
            () => {}, // Success: Mutation handles feedback
            (error) => {
              Alert.alert("Error", error.message);
            }
          );
        },
        style: "destructive",
      },
    ]);
  }, [deleteTaskMutation, taskID, router]);

  const handleAddChecklistItem = useCallback(() => {
    function addItem(): Result<void, Error> {
      try {
        setFormData((prev) => {
          const newPosition = prev.checklistItems.length;
          const newItem = {
            id: `new-${Date.now()}-${newPosition}`, // More unique temporary ID
            content: "",
            isComplete: false,
            position: newPosition,
          };
          const updatedItems = [...prev.checklistItems, newItem];

          // Re-assign positions after adding
          const itemsWithUpdatedPositions = updatedItems.map((item, index) => ({
            ...item,
            position: index,
          }));

          return {
            ...prev,
            checklistItems: itemsWithUpdatedPositions,
          };
        });

        // Automatically start editing the new item (using length before adding)
        setTimeout(() => {
          setEditingItemIndex(formData.checklistItems.length); // Index of the new item *before* state update finishes
        }, 0); // Use setTimeout 0 to queue it after the current render cycle

        return ok(undefined);
      } catch (error) {
        return err(new Error(`Failed to add checklist item: ${error}`));
      }
    }

    const result = addItem();
    result.match(
      () => {}, // Success handled within function
      (error) => {
        console.error(error);
        Alert.alert("Error", "Failed to add routine item");
      }
    );
    // Dependency: formData.checklistItems.length to ensure editing index is set correctly
  }, [formData.checklistItems.length]);

  const handleRemoveChecklistItem = useCallback(
    (indexToRemove: number) => {
      function removeItem(): Result<void, Error> {
        try {
          setFormData((prev) => {
            const filteredItems = prev.checklistItems.filter(
              (_, i) => i !== indexToRemove
            );
            // Re-assign positions after removal
            const itemsWithUpdatedPositions = filteredItems.map(
              (item, index) => ({
                ...item,
                position: index,
              })
            );

            return {
              ...prev,
              checklistItems: itemsWithUpdatedPositions,
            };
          });

          // Reset editing state if the removed item was being edited
          if (editingItemIndex === indexToRemove) {
            setEditingItemIndex(null);
          } else if (
            editingItemIndex !== null &&
            editingItemIndex > indexToRemove
          ) {
            // Adjust editing index if an item before the edited one was removed
            setEditingItemIndex(editingItemIndex - 1);
          }

          return ok(undefined);
        } catch (error) {
          return err(new Error(`Failed to remove checklist item: ${error}`));
        }
      }

      const result = removeItem();
      result.match(
        () => {}, // Success handled within function
        (error) => {
          console.error(error);
          Alert.alert("Error", "Failed to remove routine item");
        }
      );
    },
    [editingItemIndex] // Dependency: editingItemIndex for correct reset/adjustment
  );

  const handleUpdateChecklistItem = useCallback(
    (index: number, content: string) => {
      // No need for Result wrapper here, state update is sync and unlikely to throw
      setFormData((prev) => ({
        ...prev,
        checklistItems: prev.checklistItems.map((item, i) =>
          i === index ? { ...item, content } : item
        ),
      }));
    },
    [] // No dependencies needed for this specific updater
  );

  // --- Movement Handlers ---
  const handleMoveItemUp = useCallback(
    (index: number) => {
      if (index <= 0) return; // Already at the top

      setFormData((prev) => {
        const newItems = [...prev.checklistItems];
        // Simple swap
        [newItems[index], newItems[index - 1]] = [
          newItems[index - 1],
          newItems[index],
        ];

        // Update positions based on new array order
        const itemsWithUpdatedPositions = newItems.map((item, idx) => ({
          ...item,
          position: idx,
        }));

        // Adjust editing index if the moved item was being edited
        if (editingItemIndex === index) {
          setEditingItemIndex(index - 1);
        } else if (editingItemIndex === index - 1) {
          setEditingItemIndex(index);
        }

        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });
    },
    [editingItemIndex]
  ); // Depend on editingItemIndex

  const handleMoveItemDown = useCallback(
    (index: number) => {
      setFormData((prev) => {
        if (index >= prev.checklistItems.length - 1) {
          return prev; // Already at the bottom
        }

        const newItems = [...prev.checklistItems];
        // Simple swap
        [newItems[index], newItems[index + 1]] = [
          newItems[index + 1],
          newItems[index],
        ];

        // Update positions based on new array order
        const itemsWithUpdatedPositions = newItems.map((item, idx) => ({
          ...item,
          position: idx,
        }));

        // Adjust editing index if the moved item was being edited
        if (editingItemIndex === index) {
          setEditingItemIndex(index + 1);
        } else if (editingItemIndex === index + 1) {
          setEditingItemIndex(index);
        }

        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });
    },
    [editingItemIndex]
  );

  // --- Loading / Error State ---
  if (loading) {
    return (
      <Background>
        <Header headerTitle={"Loading Task..."} />
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#ff006e" />
        </View>
      </Background>
    );
  }

  // Optional: Handle case where task itself failed to load after initial load check
  if (!theTask) {
    return (
      <Background>
        <Header headerTitle={"Error"} />
        <View
          style={{
            flex: 1,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#FF0010",
              fontFamily: "Ubuntu_700Bold",
              fontSize: 18,
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            Failed to load task details.
          </Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </Background>
    );
  }

  // --- Render ---
  return (
    <Background>
      <Header headerTitle={formData.title || "Edit Task"} />
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 90 }} // Apply padding for floating buttons
          keyboardShouldPersistTaps="handled"
        >
          {/* --- Header Section (Form fields) --- */}
          <View style={{ flex: 1, padding: 8 }}>
            <TaskFormInput
              title={formData.title}
              notes={formData.notes}
              setTitle={setTitle}
              setNotes={setNotes}
            />

            <RepeatPeriodSelector
              repeatPeriod={formData.repeatPeriod}
              setRepeatPeriod={setRepeatPeriod}
            />

            {(formData.repeatPeriod === "Daily" ||
              formData.repeatPeriod === "Monthly") && (
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={handleErrorBoundaryError}
              >
                <RepeatFrequencySlider
                  period={formData.repeatPeriod}
                  frequency={formData.repeatFrequency}
                  onChange={setRepeatFrequency}
                />
              </ErrorBoundary>
            )}

            {formData.repeatPeriod === "Weekly" && (
              <View style={{ marginTop: 8, padding: 8 }}>
                <View style={{ margin: 4 }}>
                  <RepeatFrequencySlider
                    period={formData.repeatPeriod}
                    frequency={formData.repeatFrequency}
                    onChange={setRepeatFrequency}
                  />
                </View>

                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontFamily: "Ubuntu_500Medium" }}>
                    Repeat on
                  </Text>
                </View>
                <WeekdaySelector
                  selectedDays={formData.repeatOnWk}
                  onDayToggle={toggleWeekDay}
                />
              </View>
            )}

            {formData.repeatPeriod === "Yearly" && (
              <View style={{ marginTop: 8 }}>
                <View>
                  <Text style={{ fontFamily: "Ubuntu_500Medium" }}>
                    Repeat Every Year
                  </Text>
                </View>
              </View>
            )}

            <View style={{ marginTop: 16 }}>
              <CheckBox
                checked={formData.isCustomStartDateEnabled}
                title="Custom Start Date"
                titleProps={{ style: { fontFamily: "Ubuntu_400Regular" } }}
                onPress={toggleCustomStartDate} // Use callback
                containerStyle={{
                  backgroundColor: "transparent",
                  borderWidth: 0,
                }}
              />
            </View>

            {formData.isCustomStartDateEnabled && (
              <View style={{ marginTop: 8, padding: 4, alignItems: "center" }}>
                <Text style={{ fontFamily: "Ubuntu_500Medium" }}>
                  Start Date
                </Text>
                <Text
                  style={{
                    fontFamily: "Ubuntu_700Bold",
                    fontSize: 18,
                    marginVertical: 8,
                  }}
                >
                  {formData.customStartDate?.toDateString() ?? "No date set"}
                </Text>
                <Button
                  size="sm"
                  type="outline"
                  title="Change Date"
                  onPress={() => setShowDatePicker(true)}
                  buttonStyle={{ borderColor: "#ff006e" }}
                  titleStyle={{
                    color: "#ff006e",
                    fontFamily: "Ubuntu_500Medium",
                  }}
                />
              </View>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={formData.customStartDate || new Date()}
                mode="date"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  setCustomStartDate(selectedDate); // Use callback
                }}
              />
            )}
            <View style={{ marginTop: 24, marginBottom: 8 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: "Ubuntu_700Bold",
                  marginBottom: 8,
                }}
              >
                Routines
              </Text>
              <Button
                type="solid"
                onPress={handleAddChecklistItem}
                title="Add Routine"
                size="sm"
                containerStyle={{ height: 40, marginBottom: 10 }}
                buttonStyle={{ backgroundColor: "#8AC926" }}
                titleStyle={{ fontFamily: "Ubuntu_500Medium" }}
                icon={
                  <FontAwesome6
                    name="plus"
                    size={16}
                    color="#FFFAEB"
                    style={{ marginRight: 8 }}
                  />
                }
              />
            </View>
            {isCheckListItemsLoading && <ActivityIndicator color="#ff006e" />}
            {isCheckListItemsError && (
              <Text
                style={{ color: "#FF0010", fontFamily: "Ubuntu_500Medium" }}
              >
                Error loading checklist items
              </Text>
            )}
          </View>

          {/* --- Checklist Items Section (Mapped) --- */}
          {formData.checklistItems.map((item, index) => {
            const isEditing = editingItemIndex === index;
            return (
              <View
                key={item.id.toString()} // Use item ID as key
                style={{
                  padding: 12,
                  backgroundColor: isEditing
                    ? mode === "dark"
                      ? "#232129"
                      : "#FFEFC2"
                    : mode === "dark"
                    ? "#18171A"
                    : "#FFFAEB",
                  borderRadius: 8,
                  marginVertical: 4,
                  marginHorizontal: 8,
                  borderWidth: 1,
                  borderColor: isEditing
                    ? mode === "dark"
                      ? "#4F10A8"
                      : "#FF006E"
                    : mode === "dark"
                    ? "#2C2B31"
                    : "#E2E0D5",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1, marginRight: 8 }}>
                    {/* Consider using a more controlled Input if needed, but this is often fine */}
                    <Input
                      placeholder="Enter routine..."
                      value={item.content}
                      onChangeText={(content) =>
                        handleUpdateChecklistItem(index, content)
                      }
                      // Automatically focus when editing starts
                      autoFocus={isEditing}
                      // Optionally blur when Done is pressed
                      onBlur={() => {
                        if (isEditing) setEditingItemIndex(null);
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {isEditing ? (
                      <TouchableOpacity
                        onPress={() => setEditingItemIndex(null)} // Simply stop editing
                        style={{ padding: 8 }}
                      >
                        <MaterialIcons name="done" size={24} color="#8AC926" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => setEditingItemIndex(index)} // Start editing this item
                        style={{ padding: 8 }}
                      >
                        <MaterialIcons name="edit" size={24} color="#1982C4" />
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      onPress={() => handleRemoveChecklistItem(index)}
                      style={{ padding: 8 }}
                    >
                      <MaterialIcons name="delete" size={24} color="#FF0010" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Show move buttons only when editing */}
                {isEditing && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      marginTop: 8,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handleMoveItemUp(index)}
                      style={{
                        padding: 8,
                        opacity: index > 0 ? 1 : 0.3, // Dim if disabled
                        backgroundColor:
                          mode === "dark" ? "#2C2B31" : "#F0EEE6",
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                      disabled={index === 0}
                    >
                      <MaterialIcons
                        name="arrow-upward"
                        size={20}
                        color={mode === "dark" ? "#FFFAEB" : "#001F52"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleMoveItemDown(index)}
                      style={{
                        padding: 8,
                        opacity:
                          index < formData.checklistItems.length - 1 ? 1 : 0.3, // Dim if disabled
                        backgroundColor:
                          mode === "dark" ? "#2C2B31" : "#F0EEE6",
                        borderRadius: 4,
                      }}
                      disabled={index === formData.checklistItems.length - 1}
                    >
                      <MaterialIcons
                        name="arrow-downward"
                        size={20}
                        color={mode === "dark" ? "#FFFAEB" : "#001F52"}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* --- Floating Action Buttons --- */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          backgroundColor:
            mode === "dark"
              ? "rgba(0, 31, 82, 0.9)" // Slightly transparent dark
              : "rgba(255, 250, 235, 0.9)", // Slightly transparent light
          borderTopWidth: 1,
          borderTopColor: mode === "dark" ? "#001F52" : "#FFEFC2",
        }}
      >
        <Button
          size="sm"
          onPress={handleDelete}
          title="Delete"
          disabled={deleteTaskMutation.isPending} // Disable while deleting
          buttonStyle={{ backgroundColor: "#FF0010" }}
          titleStyle={{ fontFamily: "Ubuntu_500Medium" }}
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
          disabled={updateTaskMutation.isPending} // Disable while saving
          title={updateTaskMutation.isPending ? "Saving..." : "Save"}
          buttonStyle={{ backgroundColor: "#8AC926" }}
          titleStyle={{ fontFamily: "Ubuntu_500Medium" }}
          icon={
            // Optional: Add save icon
            updateTaskMutation.isPending ? (
              <ActivityIndicator
                size="small"
                color="#FFFAEB"
                style={{ marginRight: 6 }}
              />
            ) : (
              <Ionicons
                name="save"
                size={18}
                color="#FFFAEB"
                style={{ marginRight: 6 }}
              />
            )
          }
        />
      </View>
    </Background>
  );
}
