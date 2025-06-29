import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useThemeMode, FAB, useTheme } from "@rneui/themed";
import { Stack, useRouter } from "expo-router";
import * as R from "ramda";
import React, { useCallback, useState, useEffect } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import DraggableTaskItem from "@/components/DraggableTaskItem";
import TaskListDisplay from "@/components/TaskListDisplay";
import Confetti from "@/components/lotties/Confetti";
import { useSoundContext } from "@/context/SoundContext";
import useFilteredTasks from "@/hooks/useFilteredTasks";
import { useUpdateHealthAndHappiness } from "@/hooks/useHealthAndHappinessMutations";
import useHealthAndHappinessQuery from "@/hooks/useHealthAndHappinessQueries";
import useTaskCompleteSound from "@/hooks/useTaskCompleteSound";
import { useToggleComplete } from "@/hooks/useTasksMutations";
import useTasksQueries from "@/hooks/useTasksQueries";
import useUpdateTaskPositions from "@/hooks/useUpdateTaskPositions";
import useUser from "@/hooks/useUser";
import { Task } from "@/types";
import genRandomInt from "@/utils/genRandomInt";
import isTaskDueToday from "@/utils/tasks/isTaskDueToday";
import reOrder from "@/utils/tasks/reOrder";
import Background from "@/components/Background";

// Pure functions for business logic
const shouldShowLoading = (conditions: boolean[]) => conditions.some(Boolean);
const getHeaderIconProps = (isFiltered: boolean, mode: string) => ({
  name: isFiltered ? "calendar-days" : "eye",
  size: 18,
  color: mode === "dark" ? "#FFFAEB" : "#051824",
});

// Component composition
const HeaderRightButton = ({
  isFiltered,
  mode,
  onPress,
  hasTasks,
}: {
  isFiltered: boolean;
  mode: string;
  onPress: () => void;
  hasTasks: boolean;
}) =>
  hasTasks ? (
    <Pressable onPress={onPress} style={{ marginRight: 16 }}>
      <FontAwesome6 {...getHeaderIconProps(isFiltered, mode)} />
    </Pressable>
  ) : null;

const LoadingView = ({ showConfetti }: { showConfetti: boolean }) => (
  <View style={{ flex: 1, padding: 16 }}>
    {showConfetti ? <Confetti /> : <ActivityIndicator size="large" />}
  </View>
);

export default function Index() {
  // State management
  const [isFiltered, setIsFiltered] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [reorderedTasks, setReorderedTasks] = useState<Task[]>([]);

  // Hooks
  const { isSoundEnabled } = useSoundContext();
  const { mode } = useThemeMode();
  const { theme } = useTheme();
  const router = useRouter();

  // Data fetching
  const {
    data: tasks = [],
    isLoading,
    isRefetching,
    refetch,
  } = useTasksQueries("not-completed");
  const { filteredTasks } = useFilteredTasks(tasks, isFiltered);
  const {
    mutate: updateTaskPositionsMutation,
    isPending: isUpdatingTaskPositions,
  } = useUpdateTaskPositions();
  const { playSound } = useTaskCompleteSound();
  const toggleComplete = useToggleComplete();
  const { data: user, isLoading: isLoadingUser } = useUser();
  const {
    mutate: updateHealthAndHappiness,
    isPending: isCreatingHealthAndHappiness,
  } = useUpdateHealthAndHappiness();
  const { data: healthAndHappiness } = useHealthAndHappinessQuery(user?.id);

  // Derived state
  const loadingConditions = [
    isLoading,
    isRefetching,
    isUpdatingTaskPositions,
    isLoadingUser,
    isCreatingHealthAndHappiness,
  ];
  const showLoading = shouldShowLoading(loadingConditions);
  const hasTasks = reorderedTasks.length > 0;

  // Effects
  useEffect(() => {
    const newReorderedTasks = isFiltered ? filteredTasks : tasks;
    if (!R.equals(reorderedTasks, newReorderedTasks)) {
      setReorderedTasks(newReorderedTasks);
    }
  }, [filteredTasks, tasks, isFiltered, reorderedTasks]);

  // Event handlers
  const handleReorder = useCallback(
    (from: number, to: number) => {
      const newTasks = reOrder(from, to, [...reorderedTasks]);
      setReorderedTasks(newTasks);
      updateTaskPositionsMutation(newTasks);
    },
    [reorderedTasks, updateTaskPositionsMutation],
  );

  const handleFilterTodayPress = useCallback(
    () => setIsFiltered((prev) => !prev),
    [],
  );

  const handleOnToggleComplete = useCallback(
    ({ taskID, isComplete }: { taskID: number; isComplete: boolean }) => {
      toggleComplete.mutate(
        { taskID, isComplete },
        {
          onSuccess: () => {
            setShowConfetti(true);
            updateHealthAndHappiness({
              user_id: user?.id,
              health: (healthAndHappiness?.health ?? 0) + genRandomInt(8, 24),
              happiness:
                (healthAndHappiness?.happiness ?? 0) + genRandomInt(2, 8),
            });
            isSoundEnabled && playSound();
            setTimeout(() => setShowConfetti(false), 2000);
          },
        },
      );
    },
    [
      toggleComplete,
      playSound,
      isSoundEnabled,
      healthAndHappiness,
      updateHealthAndHappiness,
      user,
    ],
  );

  const handleFABPress = useCallback(() => {
    const shouldShowWarning = tasks.filter(isTaskDueToday).length > 8;
    router.push(
      shouldShowWarning
        ? "/(tasks)/soManyTasksWarning"
        : "/(tasks)/create-task",
    );
  }, [router, tasks]);

  const renderTaskItem = useCallback(
    ({
      item,
      index,
      dragActivator,
      isActive,
    }: {
      item: Task;
      index: number;
      dragActivator?: () => void;
      isActive?: boolean;
    }) => (
      <DraggableTaskItem
        task={item}
        index={index}
        onPress={() =>
          router.push({
            pathname: "/(tasks)/[id]",
            params: { id: item.id.toString() },
          })
        }
        onReorder={handleReorder}
        onToggleComplete={handleOnToggleComplete}
        isFiltered={isFiltered}
        dragActivator={dragActivator}
        isActive={isActive}
      />
    ),
    [router, handleReorder, handleOnToggleComplete, isFiltered],
  );

  const keyExtractor = useCallback((item: Task) => item.id.toString(), []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Due Tasks",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.greyOutline,
          headerTitleStyle: {
            color: theme.colors.black,
            fontFamily: "DelaGothicOne_400Regular",
            fontSize: 14,
            fontWeight: "400",
          },
          headerRight: () => (
            <HeaderRightButton
              isFiltered={isFiltered}
              mode={mode}
              onPress={handleFilterTodayPress}
              hasTasks={hasTasks}
            />
          ),
        }}
      />
      <Background style={{ flex: 1, padding: 0 }}>
        {showLoading ? (
          <LoadingView showConfetti={showConfetti} />
        ) : (
          <TaskListDisplay
            isFiltered={isFiltered}
            reorderedTasks={reorderedTasks}
            renderTaskItem={renderTaskItem}
            keyExtractor={keyExtractor}
            isRefetching={isRefetching}
            refetch={refetch}
            onReorder={handleReorder}
          />
        )}
        <FAB
          style={{
            position: "absolute",
            margin: 32,
            right: 5,
            bottom: 30,
            // boxShadow is not a valid React Native style property
            // boxShadow: [
            //   {
            //     offsetX: -3,
            //     offsetY: 3,
            //     blurRadius: 15,
            //     color: "#FF006E",
            //   },
            //   {
            //     offsetX: 5,
            //     offsetY: -5,
            //     blurRadius: 15,
            //     color: "#6A18DC",
            //   },
            // ],
            shadowColor: "#000", // Example shadow properties
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5, // For Android
          }}
          onPress={handleFABPress}
        >
          <FontAwesome6 name="add" size={24} color="#FF99C5" />
        </FAB>
      </Background>
    </>
  );
}
