import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import RNEWrapper from "@/components/RNEWrapper";
import AuthProvider from "@/context/AuthenticationProvider";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";
import * as Sentry from "@sentry/react-native";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";
import handleErrorBoundaryError from "@/utils/errorHandler";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
});

const queryClient = new QueryClient();
if (__DEV__) {
  require("@/ReactotronConfig");
}

export default Sentry.wrap(function RootLayout() {
  const theme = createTheme(themeStyles);
  useReactQueryDevTools(queryClient);

  theme.mode = useColorScheme() ?? "light";
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary
        FallbackComponent={GlobalErrorFallback}
        onError={handleErrorBoundaryError}
      >
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <RNEWrapper />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
});
