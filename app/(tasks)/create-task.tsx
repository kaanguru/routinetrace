import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, CheckBox } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";

import ChecklistSection from "@/components/ChecklistSection";
import { FormInput } from "@/components/FormInput";
import Header from "@/components/Header";
import { RepeatFrequencySlider } from "@/components/RepeatFrequencySlider";
import RepeatPeriodSelector from "@/components/RepeatPeriodSelector";
import WeekdaySelector from "@/components/WeekDaySelector";
import { useUpdateHealthAndHappiness } from "@/hooks/useHealthAndHappinessMutations";
import useHealthAndHappinessQuery from "@/hooks/useHealthAndHappinessQueries";
import { useCreateTask } from "@/hooks/useTasksMutations";
import useUser from "@/hooks/useUser";
import { RepeatPeriod, TaskFormData } from "@/types";
import genRandomInt from "@/utils/genRandomInt";

export default function CreateTask() {
  const router = useRouter();
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
  const { mutate: createTask, isPending: isCreatingTask } = useCreateTask();
  const { data: user } = useUser();
  const { mutate: updateHealthAndHappiness } = useUpdateHealthAndHappiness();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    if (formData.checklistItems.some((item) => !item.content.trim())) {
      Alert.alert("Error", "All checklist items must have content");
      return;
    }
    createTask(formData, {
      onSuccess: () => {
        updateHealthAndHappiness({
          user_id: user?.id,
          health: (healthAndHappiness?.health ?? 0) + genRandomInt(2, 4),
          happiness: (healthAndHappiness?.happiness ?? 0) + genRandomInt(8, 24),
        });
        router.push("/(drawer)");
      },
      onError: (error) => {
        console.error("Error creating task:", error);
        Alert.alert("Error", error.message || "An unexpected error occurred");
      },
    });
  };

  const handleAddChecklistItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: [
        ...prev.checklistItems,
        {
          id: Date.now().toString(),
          content: "",
          isComplete: false,
          position: prev.checklistItems.length,
        },
      ],
    }));
  }, []);

  const handleRemoveChecklistItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.filter((_, i) => i !== index),
    }));
  }, []);

  const handleUpdateChecklistItem = useCallback(
    (index: number, content: string) => {
      setFormData((prev) => ({
        ...prev,
        checklistItems: prev.checklistItems.toSpliced(index, 1, {
          ...prev.checklistItems[index],
          content,
        }),
      }));
    },
    []
  );
  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <Header headerTitle="Create Task" />
      <ScrollView className="my-0 px-4">
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
            setRepeatPeriod={(value: "" | RepeatPeriod | null) =>
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
            <View className="mt-4 p-2">
              <View className="mb-4">
                <Text className="w-1/6">Repeat Every</Text>
                <RepeatFrequencySlider
                  period={formData.repeatPeriod}
                  frequency={formData.repeatFrequency}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, repeatFrequency: value }))
                  }
                />
              </View>
              <View>
                <Text className="mb-2">Repeat on</Text>
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
            <View className="mt-4">
              <View>
                <Text>Repeat Every Year</Text>
              </View>
            </View>
          )}

          <View className="my-4">
            <View className="items-center">
              <CheckBox
                checked={formData.isCustomStartDateEnabled}
                title="Custom Start Date"
                onPress={() => {
                  return (isSelected: boolean) => {
                    setFormData((prev) => ({
                      ...prev,
                      isCustomStartDateEnabled: isSelected,
                      customStartDate: isSelected ? new Date() : null,
                    }));
                  };
                }}
              />
            </View>
          </View>

          {formData.isCustomStartDateEnabled && (
            <View className="mt-4">
              <View>
                <Text className="text-typography-black my-auto">
                  Start Date
                </Text>
                <Text className="my-auto">
                  {formData.customStartDate?.toDateString()}
                </Text>
                <Button
                  onPress={() => setShowDatePicker(true)}
                  title="Change Date"
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

          <ChecklistSection
            items={formData.checklistItems}
            onAdd={handleAddChecklistItem}
            onRemove={handleRemoveChecklistItem}
            onUpdate={handleUpdateChecklistItem}
            setFormData={setFormData}
          />
        </View>
      </ScrollView>
      <View className="my-0 px-4">
        <Button
          onPress={handleCreate}
          testID="create-task-button"
          disabled={isCreatingTask}
          title={isCreatingTask ? "Creating..." : "Create"}
        />
      </View>
    </View>
  );
}
