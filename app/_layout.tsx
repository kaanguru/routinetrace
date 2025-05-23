import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RNEWrapper from "@/components/RNEWrapper";
import AuthProvider from "@/context/AuthenticationProvider";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";
import handleErrorBoundaryError from "@/utils/errorHandler";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  // dsn: "https://cfa66f36a318ec740ef2906e8a0d7728@o4508883408846848.ingest.de.sentry.io/4509302901178448",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();

// if (__DEV__) {
//   import("@/ReactotronConfig");
// }

export default Sentry.wrap(function RootLayout() {
  const theme = createTheme(themeStyles);

  theme.mode = useColorScheme() ?? "light";
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={GlobalErrorFallback}
        onError={handleErrorBoundaryError}
      >
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {/* <Button
              title="Try!"
              onPress={() => {
                Sentry.captureException(new Error("First error 12"));
              }}
            /> */}
            <RNEWrapper />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
});
