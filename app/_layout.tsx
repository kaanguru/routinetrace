import { createTheme, ThemeProvider } from "@rneui/themed";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import RNEWrapper from "~/components/RNEWrapper";
import SessionProvider from "~/context/AuthenticationContext";
import themeStyles from "~/theme/themeStyles";

const theme = createTheme(themeStyles);

const queryClient = new QueryClient();

export default function RootLayout() {
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
