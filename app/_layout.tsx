import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import RNEWrapper from "@/components/RNEWrapper";
import SessionProvider from "@/context/AuthenticationContext";
import themeStyles from "@/theme/themeStyles";
import { useColorScheme } from "react-native";

const queryClient = new QueryClient();
const theme = createTheme(themeStyles);
export default function RootLayout() {
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
