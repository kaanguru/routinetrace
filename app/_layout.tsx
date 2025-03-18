import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

import RNEWrapper from "@/components/RNEWrapper";
import SessionProvider from "@/context/AuthenticationContext";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient();
const theme = createTheme(themeStyles);

export default function RootLayout() {
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
