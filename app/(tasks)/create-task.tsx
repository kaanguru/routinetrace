import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, CheckBox } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";

import ChecklistSection from "@/components/ChecklistSection";
import TaskFormInput from "@/components/TaskFormInput";
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
import Background from "@/components/Background";

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
    <Background>
      <Header headerTitle="➕" />
      <ScrollView style={{ marginVertical: 0, paddingHorizontal: 12 }}>
        <View
          style={{
            gap: 5,
          }}
        >
          <TaskFormInput
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
            <View style={{ marginTop: 10, padding: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <RepeatFrequencySlider
                  period={formData.repeatPeriod}
                  frequency={formData.repeatFrequency}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, repeatFrequency: value }))
                  }
                />
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
                  setFormData((prev) => {
                    const nextIsSelected = !prev.isCustomStartDateEnabled; // Calculate the next state
                    return {
                      ...prev,
                      isCustomStartDateEnabled: nextIsSelected,
                      customStartDate: nextIsSelected ? new Date() : null,
                    };
                  });
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
      <View>
        <Button
          onPress={handleCreate}
          testID="create-task-button"
          disabled={isCreatingTask}
          title={isCreatingTask ? "Creating..." : "Create"}
        />
      </View>
    </Background>
  );
}
