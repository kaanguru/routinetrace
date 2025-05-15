// utils/auth/changeEmail.ts
import { supabase } from "../supabase";
import { z } from "zod";
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { User } from "@supabase/supabase-js";

const emailSchema = z.string().email();

export default async function changeEmail(
  email: string,
): Promise<ResultAsync<{ user: User | null }, Error>> {
  const parseResult = emailSchema.safeParse(email);
  if (!parseResult.success) {
    return errAsync(new Error("Invalid email format"));
  }
  const { data, error } = await supabase.auth.updateUser({
    email: email,
  });
  if (error) {
    return errAsync(new Error(error.message));
  }
  return okAsync({ user: data.user ?? null });
}
