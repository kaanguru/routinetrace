import { FontAwesome6 } from "@expo/vector-icons";
import { Button, useThemeMode } from "@rneui/themed";
import { View } from "react-native";
import DraggableFlatList, { type DragEndParams, type RenderItemParams } from "react-native-draggable-flatlist";

import DraggableRoutineItem from "@/components/DraggableRoutineItem"; 
import type { TaskFormData } from "~/types";

export default function ChecklistSection({
  items,
  onAdd,
  onRemove,
  onUpdate,
  setFormData,
}: Readonly<{
  items: TaskFormData["checklistItems"];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, content: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}>) {
  const { mode } = useThemeMode();
  return (
    <View style={{ width: "100%", marginVertical: 20 }}>
      <Button type="solid" onPress={onAdd} title="Add Routines" size="sm" containerStyle={{ height: 40, marginBottom: 10 }}>
        <FontAwesome6 name="add" size={16} color={mode === "dark" ? "#FFFAEB" : "#051824"} style={{ marginRight: 5 }} />
        Add Routines
      </Button>
      <DraggableFlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }: DragEndParams<TaskFormData["checklistItems"][number]>) => {
          setFormData((prev) => ({
            ...prev,
            checklistItems: data.map((item, idx) => ({
              ...item,
              position: idx,
            })),
          }));
        }}
        renderItem={(
          { item, getIndex, drag, isActive }: RenderItemParams<TaskFormData["checklistItems"][number]> // Added type argument for clarity
        ) => <DraggableRoutineItem item={item} index={getIndex?.() ?? 0} drag={drag} isActive={isActive} onUpdate={onUpdate} onRemove={onRemove} />}
        contentContainerStyle={{ paddingBottom: 48, gap: 10 }}
        scrollEnabled
      />
    </View>
  );
}
