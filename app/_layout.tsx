import { createTheme, ThemeProvider } from "@rneui/themed";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

import RNEWrapper from "@/components/RNEWrapper";
import SessionProvider from "@/context/AuthenticationContext";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://efcb3dd32016c722a5e399a67e66eafc@o4508883408846848.ingest.de.sentry.io/4509000442249296",
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
      <ThemeProvider theme={theme}>
        <SessionProvider>
          <RNEWrapper />
        </SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
});
