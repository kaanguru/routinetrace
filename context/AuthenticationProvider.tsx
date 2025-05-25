import { ok, err, ResultAsync } from "neverthrow";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "~/utils/supabase";
import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, ReactNode } from "react";

export type AuthCredentials = { email: string; password: string };

const authKeys = {
  session: ["auth", "session"],
};

const authAPI = {
  async signInWithEmail(
    creds: AuthCredentials,
  ): Promise<ResultAsync<Session, Error>> {
    const { data, error } = await supabase.auth.signInWithPassword(creds);
    if (error) return err(error);
    return ok(data.session!);
  },

  async signUpWithEmail(
    creds: AuthCredentials,
  ): Promise<ResultAsync<Session, Error>> {
    const { data, error } = await supabase.auth.signUp(creds);
    if (error) return err(error);
    return ok(data.session!);
  },

  async signOut(): Promise<ResultAsync<void, Error>> {
    const { error } = await supabase.auth.signOut();
    await AsyncStorage.removeItem("@gorevizi:supabase.auth.token");
    if (error) return err(error);
    return ok(undefined);
  },

  async resetPasswordForEmail(
    email: string,
    redirectTo?: string,
  ): Promise<ResultAsync<void, Error>> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) return err(error);
    return ok(undefined);
  },
};

type AuthContextType = {
  session: Session | null;
  signInWithEmail: (
    creds: AuthCredentials,
  ) => Promise<ResultAsync<Session, Error>>;
  signUpWithEmail: (
    creds: AuthCredentials,
  ) => Promise<ResultAsync<Session, Error>>;
  signOut: () => Promise<ResultAsync<void, Error>>;
  resetPasswordMutation: ReturnType<
    typeof useMutation<
      ResultAsync<void, Error>,
      Error,
      { email: string; redirectTo?: string }
    >
  >;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default function AuthProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
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
    onSuccess: async (result) => {
      if ((await result).isOk()) {
        queryClient.setQueryData(authKeys.session, result);
      }
    },
    onError: (error) => {
      console.error("Sign in error:", error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: authAPI.signUpWithEmail,
    onSuccess: async (result) => {
      if ((await result).isOk()) {
        queryClient.setQueryData(authKeys.session, result);
      }
    },
    onError: (error) => {
      console.error("Sign up error:", error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: authAPI.signOut,
    onSuccess: async (result) => {
      if ((await result).isOk()) {
        queryClient.removeQueries({ queryKey: authKeys.session });
      }
    },
    onError: (error) => {
      console.error("Sign out error:", error);
    },
  });

  const resetPasswordMutation = useMutation<
    ResultAsync<void, Error>,
    Error,
    { email: string; redirectTo?: string }
  >({
    mutationFn: ({ email, redirectTo }) =>
      authAPI.resetPasswordForEmail(email, redirectTo),
    onSuccess: async (result) => {
      await signOutMutation.mutateAsync();
    },
    onError: (error) => {
      console.error("Password reset error:", error);
    },
  });

  const isLoading = isSessionLoading;

  const isMutating =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    signOutMutation.isPending ||
    resetPasswordMutation.isPending;

  const contextValue: AuthContextType = {
    session: session || null,
    isLoading: isLoading || isMutating,
    signInWithEmail: (creds) => signInMutation.mutateAsync(creds),
    signUpWithEmail: (creds) => signUpMutation.mutateAsync(creds),
    signOut: () => signOutMutation.mutateAsync(),
    resetPasswordMutation: resetPasswordMutation,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
