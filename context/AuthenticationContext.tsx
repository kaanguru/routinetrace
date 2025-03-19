// context/AuthenticationContext.tsx
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ToastAndroid } from "react-native";

import { useSession } from "~/hooks/useSession";
import { useAuth } from "~/utils/auth/auth";

type SessionContextType = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  authError: string | null;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function useSessionContext() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSessionContext must be used within a SessionProvider");
  }
  return context;
}

export default function SessionProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { data, isLoading: queryIsLoading, refetch } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const showToast = (mes: string) => {
    ToastAndroid.show(mes, ToastAndroid.LONG);
  };
  const {
    signInWithEmail,
    signUpWithEmail,
    signOut: authSignOut,
    loading: authLoading,
    error: authError,
  } = useAuth();

  useEffect(() => {
    if (!queryIsLoading) {
      setIsLoading(false);
    }
  }, [queryIsLoading]);

  const signIn = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    if (result && result.error) {
      showToast("Sign in error: " + result.error.message);
      console.error("Sign in error:", result.error.message);
      return;
    }
    await refetch();
    setTimeout(() => {
      console.log("Session after signIn:", data?.session);
    }, 200);
  };

  const signUp = async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    if (result && result.error) {
      showToast("Sign up error: " + result.error.message);
      console.error("Sign up error:", result.error.message);

      return;
    }
    await refetch();
  };

  const signOut = async () => {
    await authSignOut();
    await refetch();
    if (router.canGoBack()) {
      router.replace("/login");
    }
  };

  const combinedLoading = isLoading || authLoading;

  return (
    <SessionContext.Provider
      value={{
        session: data?.session || null,
        signIn,
        signUp,
        signOut,
        isLoading: combinedLoading,
        authError,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
