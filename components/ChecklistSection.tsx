import { FontAwesome6 } from '@expo/vector-icons';
import { Button, useThemeMode } from '@rneui/themed';
import { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';

import DraggableItem from '~/components/DraggableItem';
import { TaskFormData } from '~/types';

export default function ChecklistSection({
  items,
  onAdd,
  onRemove,
  onUpdate,
  setFormData,
}: Readonly<{
  items: TaskFormData['checklistItems'];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, content: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
}>) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [positions, setPositions] = useState<number[]>([]);
  const { mode } = useThemeMode();

  const ITEM_HEIGHT = 42;

  useEffect(() => {
    setPositions(items.map((_, i) => i));
  }, [items.length]);

  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
  }, []);

  const handleDragEnd = useCallback(
    (index: number, translationY: number) => {
      const newIndex = Math.round((translationY + index * ITEM_HEIGHT) / ITEM_HEIGHT);
      const validIndex = Math.max(0, Math.min(newIndex, items.length - 1));

      if (validIndex !== index) {
        setFormData((prev) => {
          const newItems = [...prev.checklistItems];
          const [movedItem] = newItems.splice(index, 1);
          newItems.splice(validIndex, 0, movedItem);

          return {
            ...prev,
            checklistItems: newItems.map((item, idx) => ({
              ...item,
              position: idx,
            })),
          };
        });
      }
      setDraggingIndex(null);
    },
    [items.length, setFormData]
  );

  return (
    <View
      className="mb-20 pb-20"
      style={{
        height: ITEM_HEIGHT * items.length * 1.66,
      }}>
      <Button onPress={onAdd} title="Add Routines" />
      <FontAwesome6 name="add" size={16} color={mode === 'dark' ? '#FFFAEB' : '#051824'} />

      <View
        className="pb-9"
        style={{
          height: ITEM_HEIGHT * items.length,
        }}>
        {items.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            index={index}
            isDragging={draggingIndex === index}
            onUpdate={onUpdate}
            onRemove={onRemove}
            position={positions[index] || index}
            onDragStart={() => handleDragStart(index)}
            onDragEnd={(translationY) => handleDragEnd(index, translationY)}
          />
        ))}
      </View>
    </View>
  );
}
