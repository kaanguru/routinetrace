import { supabase } from "../supabase";

export default async function getUserID(): Promise<string | undefined> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) {
    console.error("Error creating task: User not authenticated", error);
  }
  return session?.user.id;
}
