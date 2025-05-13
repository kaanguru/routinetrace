// components/edit/ChecklistEditor.tsx
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Input, Button, Text, useThemeMode } from "@rneui/themed";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";

// Styles
import {
  editStyles,
  getMoveButtonStyle,
  getChecklistItemStyle,
} from "@/theme/editCreateStyles";

interface ChecklistEditorProps {
  checklistItems: {
    id: string;
    content: string;
    isComplete: boolean; // Use isComplete (camelCase)
    position: number;
  }[];
  editingItemIndex: number | null;
  setEditingItemIndex: (index: number | null) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, content: string) => void;
  onMoveItemUp: (index: number) => void;
  onMoveItemDown: (index: number) => void;
  isLoading: boolean;
  isError: boolean;
}

export default function ChecklistEditor({
  checklistItems,
  editingItemIndex,
  setEditingItemIndex,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onMoveItemUp,
  onMoveItemDown,
  isLoading,
  isError,
}: ChecklistEditorProps) {
  const { mode } = useThemeMode();
  const moveButtonStyle = getMoveButtonStyle(mode);

  return (
    <View>
      <View style={editStyles.addRoutineButtonContainer}>
        <Button
          type="solid"
          onPress={onAddItem}
          title="Add Routine"
          size="sm"
          containerStyle={editStyles.addRoutineButtonContainer}
          buttonStyle={editStyles.addRoutineButton}
          titleStyle={editStyles.addRoutineButtonTitle}
          icon={
            <FontAwesome6
              name="plus"
              size={16}
              color="#FFFAEB"
              style={editStyles.addRoutineIcon}
            />
          }
        />
      </View>

      {isLoading && <ActivityIndicator color="#ff006e" />}
      {isError && (
        <Text style={editStyles.checklistErrorText}>
          Error loading checklist items
        </Text>
      )}

      {checklistItems.map((item, index) => {
        const isEditing = editingItemIndex === index;
        const itemStyle = getChecklistItemStyle(isEditing, mode);

        return (
          <View style={itemStyle.container} key={item.id?.toString() ?? index}>
            <View style={editStyles.checklistItemRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Input
                  nativeID={`checklistItemInput-${index}`} // More specific ID
                  placeholder="Enter routine..."
                  value={item.content}
                  onChangeText={(content) => onUpdateItem(index, content)}
                  autoFocus={isEditing}
                  onSubmitEditing={() => setEditingItemIndex(null)} // Stop editing on submit
                  inputContainerStyle={
                    editStyles.checklistItemInputInnerContainer
                  }
                />
              </View>

              <View style={editStyles.checklistItemActions}>
                {isEditing ? (
                  <TouchableOpacity
                    onPress={() => setEditingItemIndex(null)}
                    style={editStyles.iconButton}
                  >
                    <MaterialIcons name="done" size={24} color="#8AC926" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => setEditingItemIndex(index)}
                    style={editStyles.iconButton}
                  >
                    <MaterialIcons name="edit" size={24} color="#1982C4" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => onRemoveItem(index)}
                  style={editStyles.iconButton}
                >
                  <MaterialIcons name="delete" size={24} color="#FF0010" />
                </TouchableOpacity>
              </View>
            </View>

            {isEditing && (
              <View style={editStyles.moveButtonsContainer}>
                <TouchableOpacity
                  onPress={() => onMoveItemUp(index)}
                  style={[
                    moveButtonStyle.button,
                    editStyles.moveButtonMargin,
                    { opacity: index > 0 ? 1 : 0.3 },
                  ]}
                  disabled={index === 0}
                >
                  <MaterialIcons
                    name="arrow-upward"
                    size={20}
                    color={mode === "dark" ? "#FFFAEB" : "#001F52"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onMoveItemDown(index)}
                  style={[
                    moveButtonStyle.button, // Reuse style
                    { opacity: index < checklistItems.length - 1 ? 1 : 0.3 },
                  ]}
                  disabled={index === checklistItems.length - 1}
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
    </View>
  );
}
