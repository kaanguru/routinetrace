import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RNEWrapper from "@/components/RNEWrapper";
import AuthProvider from "@/context/AuthenticationProvider";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";
import { ErrorBoundary } from "react-error-boundary";
import GlobalErrorFallback from "@/components/error/GlobalErrorFallback";
import handleErrorBoundaryError from "@/utils/errorHandler";

const queryClient = new QueryClient();

// if (__DEV__) {
//   import("@/ReactotronConfig");
// }

export default function RootLayout() {
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
            <RNEWrapper />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
