import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Text, CheckBox, useThemeMode } from '@rneui/themed';
import { memo } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Markdown from 'react-native-markdown-display';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import AnimatedCheckView from './lotties/AnimatedCheckBox';

import useChecklistItems from '~/hooks/useCheckListQueries';
import { TaskItemProps } from '~/types';
import shortenText from '~/utils/shortenText';

const areEqual = (prevProps: Readonly<TaskItemProps>, nextProps: Readonly<TaskItemProps>) => {
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.is_complete === nextProps.task.is_complete &&
    prevProps.index === nextProps.index
  );
};

export const TaskItem = memo(
  ({ task, index, onReorder, onToggleComplete, onPress, isFiltered }: Readonly<TaskItemProps>) => {
    const pressed = useSharedValue(false);
    const itemHeight = 94;
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);

    const { checkListItemsLength, isCheckListItemsLoading } = useChecklistItems(task.id);
    const { mode } = useThemeMode();

    const taskHasChecklistItems = checkListItemsLength > 0;
    const panGesture = Gesture.Pan()
      .onStart(() => {
        isDragging.value = true;
      })
      .onUpdate((event) => {
        translateY.value = event.translationY;
      })
      .onEnd(() => {
        const newIndex = Math.round(translateY.value / itemHeight) + index;
        if (newIndex !== index && newIndex >= 0 && newIndex < 20) {
          runOnJS(onReorder)(index, newIndex);
        }
        translateY.value = withSpring(0);
        pressed.value = false;
      })
      .enabled(isFiltered); // Conditionally enable/disable the gesture

    const opacity = useSharedValue(1);
    const handleFadeOut = () => {
      opacity.value = withTiming(0, {
        duration: 300,
      });
    };
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
      zIndex: isDragging.value ? 1 : 0,
      opacity: opacity.value,
    }));

    const handleToggleComplete = () => {
      handleFadeOut();
      onToggleComplete({ taskID: task.id, isComplete: !task.is_complete });
    };
    return (
      <Animated.View style={animatedStyle}>
        <View
          style={{ backgroundColor: '#4F10A8' }}
          className="flex h-[94px] flex-row place-content-baseline justify-between gap-3 rounded-lg pe-0 opacity-100">
          <CheckBox
            checked={task.is_complete}
            onPress={handleToggleComplete}
            className="my-auto ms-3"
          />

          <AnimatedCheckView height={22} width={22} />

          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Task: ${task.title}`}
            className=" flex grow flex-col">
            <View className="my-auto flex-row justify-center  py-2">
              <Text className="text-typography-white grow">{task.title}</Text>

              {taskHasChecklistItems && !isCheckListItemsLoading ? (
                <>
                  <Text className="text-typography-white me-1">{checkListItemsLength}</Text>
                  <MaterialIcons
                    name="event-repeat"
                    size={16}
                    color={mode === 'light' ? '#FFFAEB' : '#051824'}
                  />
                </>
              ) : (
                isCheckListItemsLoading && <ActivityIndicator size="small" color="#FF006E" />
              )}
            </View>
            {task.notes && (
              <View
                style={{ backgroundColor: '#23074B' }}
                className="absolute bottom-0 left-0 right-1 -z-10 max-h-7 rounded-sm  px-1 py-0 ">
                <Markdown
                  mergeStyle={false}
                  style={{
                    body: {
                      padding: 0,
                      marginTop: -5,
                      height: 40,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    text: {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#fff',
                      fontSize: 12,
                    },
                  }}>
                  {shortenText(task.notes)}
                </Markdown>
              </View>
            )}
          </Pressable>
          {isFiltered && (
            <GestureDetector gesture={panGesture}>
              <View className="my-auto h-full w-9 items-center justify-center">
                <FontAwesome5
                  name="grip-vertical"
                  size={18}
                  color={mode === 'light' ? '#FFFAEB' : '#051824'}
                />
              </View>
            </GestureDetector>
          )}
        </View>
      </Animated.View>
    );
  },
  areEqual
);
