import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { AppState } from "react-native";
import { Result, err, ok } from "neverthrow";

import { supabase } from "../supabase";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

type AuthError = { message: string };

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithEmail = async (
    email: string,
    password: string
  ): Promise<Result<null, AuthError>> => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        setError(supabaseError.message);
        return err({
          message: supabaseError.message || "Unknown error when signing in",
        });
      }
      return ok(null);
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      return err({
        message:
          error.message ||
          "Unknown error when signing in with email and password",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string
  ): Promise<Result<null, AuthError>> => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const { error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseError) {
        setError(supabaseError.message);
        return err({
          message: supabaseError.message || "Unknown error when signing up",
        });
      }
      return ok(null);
    } catch (e) {
      const error = e as Error;
      setError(error.message);
      console.error("Error when signing up:", error);
      return err({ message: error.message || "Unknown error when signing up" });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<Result<null, AuthError>> => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const { error: supabaseError } = await supabase.auth.signOut();
      await AsyncStorage.removeItem("@gorevizi:supabase.auth.token");

      if (supabaseError) {
        console.error("Error when signing out:", supabaseError);
        return err({
          message: supabaseError.message || "Unknown error when signing out",
        });
      }
      return ok(null);
    } catch (e) {
      const error = e as Error;
      console.error("Error when signing out:", error);
      return err({
        message: error.message || "Unknown error when signing out",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithEmail,
    signUpWithEmail,
    signOut,
    loading,
    error,
  };
};
