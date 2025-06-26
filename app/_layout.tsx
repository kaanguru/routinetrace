import { createTheme, ThemeProvider }from "@rn-vui/themed";
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
  sendDefaultPii: true,
});

const queryClient = new QueryClient();

if (__DEV__) {
  import("@/ReactotronConfig");
}

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
              title="Sentry Try!"
              onPress={() => {
                Sentry.captureException(new Error("manuel error 24"));
              }}
              size="lg"
            /> */}
            <RNEWrapper />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
});
