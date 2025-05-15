import { Session, AuthError } from "@supabase/supabase-js";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { supabase } from "~/utils/supabase";

interface SessionSuccessResult {
  data: { session: Session };
  error: null;
}

interface SessionErrorResult {
  data: { session: null };
  error: AuthError;
}

interface SessionNullResult {
  data: { session: null };
  error: null;
}

type SessionResult =
  | SessionSuccessResult
  | SessionErrorResult
  | SessionNullResult;

export const useSession = (): UseQueryResult<
  { session: Session | null },
  AuthError
> => {
  return useQuery<{ session: Session | null }, AuthError>({
    queryKey: ["session"],
    queryFn: getSession,
  });
};

async function getSession(): Promise<{ session: Session | null }> {
  const result = (await supabase.auth.getSession()) as SessionResult;

  if (result.error) {
    console.error("Error getting session:", result.error);
    throw result.error; // Throw the error for React Query
  }

  return result.data; // Return the data part: { session: Session | null }
}
