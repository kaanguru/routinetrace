// app/(tasks)/edit/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, CheckBox } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View, Text } from "react-native";

import ChecklistSection from "@/components/ChecklistSection";
import { FormInput } from "@/components/FormInput";
import Header from "@/components/Header";
import { RepeatFrequencySlider } from "@/components/RepeatFrequencySlider";
import RepeatPeriodSelector from "@/components/RepeatPeriodSelector";
import WeekdaySelector from "@/components/WeekDaySelector";
import useChecklistItemMutations from "@/hooks/useCheckListMutations";
import useChecklistItems from "@/hooks/useCheckListQueries";
import { useUpdateTask, useDeleteTask } from "@/hooks/useTasksMutations";
import { useTaskById } from "@/hooks/useTasksQueries";
import { RepeatPeriod, TaskFormData } from "@/types";
import createTaskUpdate from "@/utils/createTaskUpdate";
import Background from "@/components/Background";

const EditTask = () => {
  const router = useRouter();
  const { id: taskID } = useLocalSearchParams<{ id: string }>();
  const { checkListItems, isCheckListItemsLoading, isCheckListItemsError } =
    useChecklistItems(taskID);
  const { data: theTask, isLoading } = useTaskById(taskID);
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { updateChecklistItem } = useChecklistItemMutations(taskID);

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Memoize the loading state to prevent unnecessary re-renders
  const loading = useMemo(
    () => initialLoad || isLoading || isCheckListItemsLoading,
    [initialLoad, isLoading, isCheckListItemsLoading]
  );

  useEffect(() => {
    const loadTaskData = async () => {
      if (theTask) {
        // Use functional updates for state
        setFormData((prevFormData) => ({
          ...prevFormData,
          title: theTask.title || "",
          notes: theTask.notes || "",
          repeatPeriod: theTask.repeat_period || "",
          repeatFrequency: theTask.repeat_frequency || 1,
          repeatOnWk: theTask.repeat_on_wk || [],
          customStartDate: theTask.created_at
            ? new Date(theTask.created_at)
            : null,
          isCustomStartDateEnabled: !!theTask.created_at,
          checklistItems:
            checkListItems?.map((item) => ({
              id: item.id.toString(),
              content: item.content,
              isComplete: item.is_complete,
              position: item.position ?? 0,
            })) || [],
        }));
        setInitialLoad(false);
      }
    };

    loadTaskData();
  }, [theTask, taskID, checkListItems]);

  const handleSave = () => {
    if (!theTask) {
      Alert.alert("Error", "Task data is not available");
      return;
    }

    const taskToUpdate = createTaskUpdate(formData, theTask, taskID);

    updateTaskMutation.mutate(taskToUpdate, {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to update task");
        console.error(error);
      },
    });
    updateChecklistItem(formData);
  };

  const handleDelete = async () => {
    deleteTaskMutation.mutate(taskID);
    router.push("/(drawer)");
  };

  const handleAddChecklistItem = () => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: [
        ...prev.checklistItems,
        {
          id: (prev.checklistItems.length + 1).toString(),
          content: "",
          isComplete: false,
          position: prev.checklistItems.length,
        },
      ],
    }));
  };

  const handleRemoveChecklistItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateChecklistItem = (index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.map((item, i) =>
        i === index ? { ...item, content } : item
      ),
    }));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Background>
      <Header headerTitle={formData.title} />
      <ScrollView>
        <View>
          <View>
            <FormInput
              title={formData.title}
              notes={formData.notes}
              setTitle={(title: string) =>
                setFormData((prev) => ({ ...prev, title }))
              }
              setNotes={(notes: string) =>
                setFormData((prev) => ({ ...prev, notes }))
              }
            />

            <RepeatPeriodSelector
              repeatPeriod={formData.repeatPeriod}
              setRepeatPeriod={(value: RepeatPeriod | "" | null) =>
                setFormData((prev) => ({
                  ...prev,
                  repeatPeriod: value as RepeatPeriod | "",
                }))
              }
            />

            {(formData.repeatPeriod === "Daily" ||
              formData.repeatPeriod === "Monthly") && (
              <RepeatFrequencySlider
                period={formData.repeatPeriod}
                frequency={formData.repeatFrequency}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, repeatFrequency: value }))
                }
              />
            )}

            {formData.repeatPeriod === "Weekly" && (
              <View>
                <View>
                  <Text>Repeat Every</Text>
                  <RepeatFrequencySlider
                    period={formData.repeatPeriod}
                    frequency={formData.repeatFrequency}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        repeatFrequency: value,
                      }))
                    }
                  />
                </View>

                <View>
                  <Text>Repeat on</Text>
                </View>
                <WeekdaySelector
                  selectedDays={formData.repeatOnWk}
                  onDayToggle={(day, isSelected) => {
                    setFormData((prev) => ({
                      ...prev,
                      repeatOnWk: isSelected
                        ? [...prev.repeatOnWk, day]
                        : prev.repeatOnWk.filter((d) => d !== day),
                    }));
                  }}
                />
              </View>
            )}

            {formData.repeatPeriod === "Yearly" && (
              <View>
                <View>
                  <Text>Repeat Every Year</Text>
                </View>
              </View>
            )}

            <View>
              <View>
                <CheckBox
                  checked={formData.isCustomStartDateEnabled}
                  title="Custom Start Date"
                  onPress={() => {
                    setFormData((prev) => ({
                      ...prev,
                      isCustomStartDateEnabled: !prev.isCustomStartDateEnabled,
                    }));
                  }}
                />
              </View>
            </View>

            {formData.isCustomStartDateEnabled && (
              <View>
                <View>
                  <Text>Start Date</Text>
                  <Text>{formData.customStartDate?.toDateString()}</Text>
                  <Button
                    title="Change Date"
                    onPress={() => setShowDatePicker(true)}
                  />
                </View>
              </View>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={formData.customStartDate || new Date()}
                mode="date"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData((prev) => ({
                      ...prev,
                      customStartDate: selectedDate,
                    }));
                  }
                }}
              />
            )}
            {isCheckListItemsLoading && <ActivityIndicator />}
            {isCheckListItemsError ? (
              <Text>Error loading checklist items</Text>
            ) : (
              <ChecklistSection
                items={formData.checklistItems}
                onAdd={handleAddChecklistItem}
                onRemove={handleRemoveChecklistItem}
                onUpdate={handleUpdateChecklistItem}
                setFormData={setFormData}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <View>
        <Button onPress={handleDelete} title="Delete" />
        <Ionicons name="trash-bin" size={24} color="white" />
        <Button
          onPress={handleSave}
          testID="save-task-button"
          disabled={updateTaskMutation.isPending}
          title={updateTaskMutation.isPending ? "Saving..." : "Save"}
        />
      </View>
    </Background>
  );
};

export default EditTask;
