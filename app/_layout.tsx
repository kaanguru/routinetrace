import { createTheme, ThemeProvider } from "@rneui/themed";
import { useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";

import RNEWrapper from "@/components/RNEWrapper";
import SessionProvider from "@/context/AuthenticationContext";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

const queryClient = new QueryClient();
if (__DEV__) {
  require("@/ReactotronConfig");
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: true,
  tracesSampleRate: 1.0,
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(),
  sendDefaultPii: true,
});
function RootLayout() {
  const ref = useNavigationContainerRef();
  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);
  const theme = createTheme(themeStyles);
  useReactQueryDevTools(queryClient);

  theme.mode = useColorScheme() ?? "light";
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <SessionProvider>
          <RNEWrapper />
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);
