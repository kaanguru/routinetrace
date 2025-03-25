import { useCallback, useState } from "react";
import { Alert, ScrollView } from "react-native";

import { DayOfWeek, RepeatPeriod, TaskFormData } from "@/types";
import {
  getUpdatedFormData,
  getUpdatedChecklistItem,
} from "./utils/formHelpers";
import { validateTaskForm } from "./utils/validations";
import RepeatControls from "./RepeatControls";
import TaskInputs from "./TaskFormParts/TaskInputs";
import DateSelection from "./TaskFormParts/DateSelection";
import ChecklistSection from "./TaskFormParts/ChecklistSection";

interface CreateTaskFormProps {
  onSubmit: (formData: TaskFormData) => void;
  isSubmitting: boolean;
  onSuccess: () => void;
}

export default function CreateTaskForm({
  onSubmit,
  isSubmitting,
  onSuccess,
}: CreateTaskFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
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

  const handleCreate = async () => {
    const validationError = validateTaskForm(formData);
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    onSubmit(formData, {
      onSuccess,
      onError: (error) => {
        console.error("Error creating task:", error);
        Alert.alert("Error", error.message || "An unexpected error occurred");
      },
    });
  };

  // ... other handlers stay similar but moved to this file ...

  return (
    <>
      <ScrollView style={{ marginVertical: 0, paddingHorizontal: 12 }}>
        <View style={{ gap: 5 }}>
          <TaskInputs formData={formData} setFormData={setFormData} />

          <RepeatControls
            formData={formData}
            setFormData={setFormData}
            handleToggleDay={handleToggleDay}
          />

          <DateSelection
            formData={formData}
            setFormData={setFormData}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />

          <ChecklistSection
            items={formData.checklistItems}
            onAdd={handleAddChecklistItem}
            onRemove={handleRemoveChecklistItem}
            onUpdate={handleUpdateChecklistItem}
          />
        </View>
      </ScrollView>

      <SubmitButton onPress={handleCreate} isSubmitting={isSubmitting} />
    </>
  );
}

const SubmitButton = ({ onPress, isSubmitting }) => (
  <Button
    onPress={onPress}
    testID="create-task-button"
    disabled={isSubmitting}
    title={isSubmitting ? "Creating..." : "Create"}
  />
);
