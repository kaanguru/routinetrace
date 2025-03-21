import { Result, ok, err } from "neverthrow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "~/utils/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, ReactNode } from "react";

type AuthError = { message: string };
type AuthCredentials = { email: string; password: string };

// Query keys
const authKeys = {
  session: ["auth", "session"],
};

// Combined API functions with neverthrow
const authAPI = {
  async signInWithEmail(
    creds: AuthCredentials
  ): Promise<Result<Session, AuthError>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(creds);
      if (error) return err({ message: error.message });
      return ok(data.session!);
    } catch (e) {
      return err({ message: (e as Error).message });
    }
  },

  async signUpWithEmail(
    creds: AuthCredentials
  ): Promise<Result<Session, AuthError>> {
    try {
      const { data, error } = await supabase.auth.signUp(creds);
      if (error) return err({ message: error.message });
      return ok(data.session!);
    } catch (e) {
      return err({ message: (e as Error).message });
    }
  },

  async signOut(): Promise<Result<void, AuthError>> {
    try {
      const { error } = await supabase.auth.signOut();
      await AsyncStorage.removeItem("@gorevizi:supabase.auth.token");
      if (error) return err({ message: error.message });
      return ok(undefined);
    } catch (e) {
      return err({ message: (e as Error).message });
    }
  },
};

type AuthContextType = {
  session: Session | null;
  signInWithEmail: (
    creds: AuthCredentials
  ) => Promise<Result<Session, AuthError>>;
  signUpWithEmail: (
    creds: AuthCredentials
  ) => Promise<Result<Session, AuthError>>;
  signOut: () => Promise<Result<void, AuthError>>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: authKeys.session,
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const signInMutation = useMutation({
    mutationFn: authAPI.signInWithEmail,
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.setQueryData(authKeys.session, result.value);
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: authAPI.signUpWithEmail,
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.setQueryData(authKeys.session, result.value);
      }
    },
    onError: (error) => {
      console.error("Sign up error:", error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authAPI.signOut,
    onSuccess: (result) => {
      if (result.isOk()) {
        queryClient.removeQueries({ queryKey: authKeys.session });
      }
    },
  });

  const isLoading =
    isSessionLoading ||
    signInMutation.isPending ||
    signUpMutation.isPending ||
    signOutMutation.isPending;

  return (
    <AuthContext.Provider
      value={{
        session: session || null,
        isLoading,
        signInWithEmail: (creds) => signInMutation.mutateAsync(creds),
        signUpWithEmail: (creds) => signUpMutation.mutateAsync(creds),
        signOut: () => signOutMutation.mutateAsync(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
