import { Text, Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, Alert } from "react-native";
import DraggableFlatList, {
  type DragEndParams,
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import { ResultAsync, okAsync, err } from "neverthrow"; // Import ResultAsync, okAsync, and err
import reportError from "@/utils/reportError"; // Import reportError

import ChecklistSection from "@/components/ChecklistSection";
import DraggableRoutineItem from "@/components/DraggableRoutineItem";
import Header from "@/components/Header";
import TaskFormHeader from "@/components/TaskFormHeader"; // Import the extracted component
import { useUpdateHealthAndHappiness } from "@/hooks/useHealthAndHappinessMutations";
import useHealthAndHappinessQuery from "@/hooks/useHealthAndHappinessQueries";
import { useCreateTask } from "@/hooks/useTasksMutations";
import useUser from "@/hooks/useUser";
import { TaskFormData } from "@/types";
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
  const { mutateAsync: createTask, isPending: isCreatingTask } = useCreateTask(); // Use mutateAsync
  const { data: user } = useUser();
  const { mutateAsync: updateHealthAndHappiness } = useUpdateHealthAndHappiness(); // Use mutateAsync
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

    ResultAsync.fromPromise(createTask(formData), (error) => error as Error)
      .andThen(() => {
        if (user?.id && healthAndHappiness) {
          return ResultAsync.fromPromise(
            updateHealthAndHappiness({
              user_id: user.id,
              health: (healthAndHappiness.health ?? 0) + genRandomInt(2, 4),
              happiness: (healthAndHappiness.happiness ?? 0) + genRandomInt(8, 24),
            }),
            (error) => error as Error
          );
        }
        return okAsync(undefined); // Return ok if no user or healthAndHappiness data
      })
      .match(
        () => {
          router.push("/(drawer)");
        },
        (error) => {
          reportError(err(error));
          Alert.alert("Error", error.message || "An unexpected error occurred");
        }
      );
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

  const handleUpdateChecklistItem = useCallback((index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      checklistItems: prev.checklistItems.toSpliced(index, 1, {
        ...prev.checklistItems[index],
        content,
      }),
    }));
  }, []);
  return (
    <Background>
      <Header headerTitle="➕" />
        <View style={{ marginVertical: 0, paddingHorizontal: 12 ,flex:1 , justifyContent:"space-between"}}>
          <ChecklistSection
            ListHeaderComponent={
              <TaskFormHeader
                formData={formData}
                onAdd={handleAddChecklistItem}

                setFormData={setFormData}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
              />
            }
          >
            <DraggableFlatList
              data={formData.checklistItems}
              keyExtractor={(item) => item.id.toString()}
              onDragEnd={({
                data,
              }: DragEndParams<TaskFormData["checklistItems"][number]>) => {
                setFormData((prev) => ({
                  ...prev,
                  checklistItems: data.map((item, idx) => ({
                    ...item,
                    position: idx,
                  })),
                }));
              }}
              renderItem={(
                {
                  item,
                  getIndex,
                  drag,
                  isActive,
                }: RenderItemParams<TaskFormData["checklistItems"][number]>
              ) => (
                <DraggableRoutineItem
                  item={item}
                  index={getIndex?.() ?? 0}
                  drag={drag}
                  isActive={isActive}
                  onUpdate={handleUpdateChecklistItem}
                  onRemove={handleRemoveChecklistItem}
                />
              )}
              contentContainerStyle={{ paddingBottom: 48, gap: 10 }}
              scrollEnabled
            />
          </ChecklistSection>
      <Button onPress={handleCreate} testID="create-task-button" disabled={isCreatingTask} title={isCreatingTask ? "Creating..." : "Create"} style={{ position: "absolute", bottom: 0, width: '100%', padding: 10 }}  />
        </View>
    </Background>
  );
}
