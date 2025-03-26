import {
  DelaGothicOne_400Regular,
  useFonts,
} from "@expo-google-fonts/dela-gothic-one";
import { Inter_900Black } from "@expo-google-fonts/inter";
import {
  Ubuntu_400Regular,
  Ubuntu_500Medium,
  Ubuntu_700Bold,
} from "@expo-google-fonts/ubuntu";
import { UbuntuMono_400Regular } from "@expo-google-fonts/ubuntu-mono";
import { Stack, Href, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, createContext, useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAuth } from "@/context/AuthenticationProvider";
import { SoundProvider } from "~/context/SoundContext";
import useInitializeDailyTasks from "~/hooks/useInitializeDailyTasks";
import { isFirstLaunchToday } from "~/utils/isFirstLaunchToday";
import { isFirstVisit } from "~/utils/isFirstVisit";
import { supabase } from "~/utils/supabase";
import { Result, ok } from "neverthrow";
import reportError from "@/utils/reportError";

const InitializationContext = createContext<
  Readonly<{
    initialized: boolean;
    hasTasksFromYesterday: boolean;
  }>
>({
  initialized: false,
  hasTasksFromYesterday: false,
});

export const useInitializationContext = () => useContext(InitializationContext);
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RNEWrapper() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_900Black,
    DelaGothicOne_400Regular,
    UbuntuMono_400Regular,
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });
  const [isSupabaseInitialized, setSupabaseInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const { session, isLoading: sessionLoading } = useAuth();
  const { initialized, hasTasksFromYesterday } = useInitializeDailyTasks();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeSupabase = (): Result<void, Error> => {
      // eslint-disable-next-line no-unused-expressions
      supabase; // Ensure supabase is initialized
      setSupabaseInitialized(true);
      return ok(undefined);
    };
    const result = initializeSupabase();
    if (result.isErr()) {
      reportError(result);
    }
  }, []);

  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (
      !isSupabaseInitialized ||
      !fontsLoaded ||
      fontError ||
      sessionLoading ||
      !initialized
    ) {
      return;
    }

    const checkAndRedirect = async () => {
      try {
        const isFirstInstall = await isFirstVisit();

        if (isFirstInstall && !segments[0]?.includes("onboarding")) {
          router.replace("/(onboarding)/splash" as Href);
          return;
        }
        const isFirstToday = await isFirstLaunchToday();
        if (isFirstToday && session) {
          if (hasTasksFromYesterday) {
            router.push("/(tasks)/tasks-of-yesterday" as Href);
          } else {
            router.push("/(drawer)" as Href);
          }
        }
      } catch (error) {
        console.error("Failed to check first visit or session:", error);
      } finally {
        setIsAppReady(true);
      }
    };

    checkAndRedirect();
  }, [
    isSupabaseInitialized,
    fontsLoaded,
    fontError,
    segments,
    session,
    initialized,
    hasTasksFromYesterday,
    sessionLoading,
    router,
  ]);

  useEffect(() => {
    if (isAppReady) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 200);
    }
  }, [isAppReady]);

  if (
    !isSupabaseInitialized ||
    (!fontsLoaded && !fontError) ||
    sessionLoading ||
    !initialized
  ) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <InitializationContext.Provider
      value={{ initialized, hasTasksFromYesterday }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SoundProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
            }}
          >
            <Stack.Screen name="(drawer)" />
            <Stack.Screen
              name="(onboarding)"
              options={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            />
          </Stack>
        </SoundProvider>
      </GestureHandlerRootView>
    </InitializationContext.Provider>
  );
}
