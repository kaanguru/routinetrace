import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useThemeMode, Input } from '@rneui/themed';
import { useEffect, memo } from 'react';
import { Pressable, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, runOnJS } from 'react-native-reanimated';

import { TaskFormData } from '~/types';

const ITEM_HEIGHT = 42;

const DraggableItem = memo(
  ({
    item,
    index,
    isDragging,
    onUpdate,
    onRemove,
    position,
    onDragStart,
    onDragEnd,
  }: Readonly<{
    item: TaskFormData['checklistItems'][number];
    index: number;
    isDragging: boolean;
    onUpdate: (index: number, content: string) => void;
    onRemove: (index: number) => void;
    position: number;
    onDragStart: () => void;
    onDragEnd: (translationY: number) => void;
  }>) => {
    const animatedValue = useSharedValue(position * ITEM_HEIGHT);
    const { mode } = useThemeMode();

    useEffect(() => {
      animatedValue.value = position * ITEM_HEIGHT;
    }, [position]);

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        runOnJS(onDragStart)();
      })
      .onChange((event) => {
        animatedValue.value = event.translationY + position * ITEM_HEIGHT;
      })
      .onEnd((event) => {
        runOnJS(onDragEnd)(event.translationY);
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: animatedValue.value }],
      zIndex: isDragging ? 1 : 0,
      position: 'relative',
      left: 0,
      right: 0,
    }));

    return (
      <GestureHandlerRootView>
        <Animated.View style={animatedStyle}>
          <View className="my-1px-2 py-1">
            <View className="items-center">
              <GestureDetector gesture={panGesture}>
                <Animated.View>
                  <FontAwesome5
                    name="grip-vertical"
                    size={18}
                    color={mode === 'dark' ? '#FFFAEB' : '#051824'}
                  />
                </Animated.View>
              </GestureDetector>
              <Input
                placeholder="Checklist item"
                value={item.content}
                onChangeText={(text) => {
                  onUpdate(index, text);
                }}
                className="text-typography-black min-h-[40px] py-2"
                placeholderTextColor="#9CA3AF"
                autoFocus
              />

              <Pressable
                className="bg-background-light dark:bg-background-dark rounded-full p-1"
                onPress={() => onRemove(index)}>
                <Ionicons
                  name="trash-bin"
                  size={24}
                  color={mode === 'dark' ? '#FFFAEB' : '#051824'}
                />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    );
  }
);

export default DraggableItem;
