import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import ChecklistCreator from "@/components/create/ChecklistCreator";
import Header from "@/components/Header";
import TaskFormHeader from "@/components/TaskFormHeader";
import { useUpdateHealthAndHappiness } from "@/hooks/useHealthAndHappinessMutations";
import useUser from "@/hooks/useUser";
import { TaskFormData } from "@/types";
import genRandomInt from "@/utils/genRandomInt";
import Background from "@/components/Background";
import updateChecklistItemContentAtIndex from "@/utils/edit/updateChecklistItemContentAtIndex";
import { createTask, healthAndHappiness$ } from "@/data/observables";
import { use$ } from "@legendapp/state/react";

export default function CreateTask() {
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
  const { mutateAsync: updateHealthAndHappiness } =
    useUpdateHealthAndHappiness();
  const { data: user } = useUser();

  const healthAndHappiness = use$(healthAndHappiness$(user?.id));

  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter(); // Re-add useRouter
  const handleCreate = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "Title is required");
      return;
    }
    if (formData.checklistItems.some((item) => !item.content.trim())) {
      Alert.alert("Error", "All checklist items must have content");
      return;
    }

    Keyboard.dismiss();
    setIsCreating(true);
    try {
      await createTask(formData);

      if (user?.id && healthAndHappiness) {
        await updateHealthAndHappiness({
          user_id: user.id,
          health: (healthAndHappiness.health ?? 0) + genRandomInt(2, 4),
          happiness: (healthAndHappiness.happiness ?? 0) + genRandomInt(8, 24),
        });
      }

      router.push("/(drawer)"); // Restore navigation
    } catch (error: unknown) {
      console.error("Failed to create task", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unknown error occurred.",
      );
    } finally {
      setIsCreating(false);
    }
  };
  // --- Checklist Item Handlers (Passed to ChecklistCreator) ---
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
        // Ensure positions are sequential after removal
        const itemsWithUpdatedPositions = filteredItems.map((item, index) => ({
          ...item,
          position: index,
        }));
        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });

      // Adjust editing index
      if (editingItemIndex === indexToRemove) {
        setEditingItemIndex(null);
      } else if (
        editingItemIndex !== null &&
        editingItemIndex > indexToRemove
      ) {
        setEditingItemIndex(editingItemIndex - 1);
      }
    },
    [editingItemIndex], // Depend on editing index
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
        // Update positions
        const itemsWithUpdatedPositions = newItems.map((item, idx) => ({
          ...item,
          position: idx,
        }));
        // Adjust editing index
        if (editingItemIndex === index) setEditingItemIndex(index - 1);
        else if (editingItemIndex === index - 1) setEditingItemIndex(index);
        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });
    },
    [editingItemIndex], // Depend on editing index
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
        // Update positions
        const itemsWithUpdatedPositions = newItems.map((item, idx) => ({
          ...item,
          position: idx,
        }));
        // Adjust editing index
        if (editingItemIndex === index) setEditingItemIndex(index + 1);
        else if (editingItemIndex === index + 1) setEditingItemIndex(index);
        return { ...prev, checklistItems: itemsWithUpdatedPositions };
      });
    },
    [editingItemIndex], // Depend on editing index
  );
  return (
    <Background>
      <Header headerTitle="➕" />
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          flex: 1,
        }}
      >
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <TaskFormHeader
            formData={formData}
            setFormData={setFormData}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
          />
          <ChecklistCreator
            checklistItems={formData.checklistItems}
            editingItemIndex={editingItemIndex}
            setEditingItemIndex={setEditingItemIndex}
            onAddItem={handleAddChecklistItem}
            onRemoveItem={handleRemoveChecklistItem}
            onUpdateItem={handleUpdateChecklistItemContent}
            onMoveItemUp={handleMoveChecklistItemUp}
            onMoveItemDown={handleMoveChecklistItemDown}
            repeatPeriod={formData.repeatPeriod}
          />
        </ScrollView>
        <Button
          onPress={handleCreate}
          testID="create-task-button"
          disabled={isCreating}
          title={isCreating ? "Creating..." : "Create"}
        />
      </KeyboardAvoidingView>
    </Background>
  );
}
