import { useState } from "react";
import { Alert, Keyboard, ScrollView, StyleSheet } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { TaskFormData } from "~/types";
import { taskFormSchema } from "~/schemas/taskFormSchema";
import { editCreateStyles as styles } from "~/theme/editCreateStyles";

// Import the new createTask function instead of the old hook
import { createTask } from "~/data/observables";

import {
  WeekDaySelector,
  RepeatPeriodSelector,
  RepeatFrequencySlider,
  ChecklistCreator,
  TaskFormInput,
  TaskFormHeader,
} from "~/components/create";

export default function CreateTaskScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      notes: "",
      repeatOnWk: [],
      repeatPeriod: null,
      repeatFrequency: 1,
      checklistItems: [],
    },
  });

  // Use local state for loading instead of isPending from useMutation
  const [isCreating, setIsCreating] = useState(false);
  const checklistItems = watch("checklistItems");

  const onSubmit = async (formData: TaskFormData) => {
    Keyboard.dismiss();
    setIsCreating(true);
    try {
      // Call the centralized createTask function
      await createTask(formData);

      // Invalidation is handled in the createTask function, so we can just navigate back
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error("Failed to create task", error);
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <TaskFormHeader
        isSaving={isCreating}
        onSave={handleSubmit(onSubmit)}
        title="Create New Task"
      />
      <ScrollView style={styles.formContainer}>
        <TaskFormInput
          name="title"
          label="Title"
          control={control}
          error={errors.title?.message}
          placeholder="e.g., Go for a run"
        />
        <TaskFormInput
          name="notes"
          label="Notes"
          control={control}
          error={errors.notes?.message}
          placeholder="e.g., Around the park, 3 miles"
          multiline
        />

        <Controller
          control={control}
          name="repeatPeriod"
          render={({ field: { onChange, value } }) => (
            <RepeatPeriodSelector
              selectedValue={value}
              onValueChange={onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="repeatOnWk"
          render={({ field: { onChange, value } }) => (
            <WeekDaySelector selectedDays={value || []} onDayPress={onChange} />
          )}
        />
        <Controller
          control={control}
          name="repeatFrequency"
          render={({ field: { onChange, value } }) => (
            <RepeatFrequencySlider
              frequency={value || 1}
              onFrequencyChange={onChange}
              period={watch("repeatPeriod")}
            />
          )}
        />
        <ChecklistCreator
          checklistItems={checklistItems || []}
          setChecklistItems={(items) => setValue("checklistItems", items)}
        />
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
