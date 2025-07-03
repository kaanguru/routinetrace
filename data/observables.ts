import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { supabase } from "../utils/supabase";
import { Tables } from "~/database.types"; // Import Tables for type safety
import { PostgrestSingleResponse } from "@supabase/supabase-js"; // Import PostgrestSingleResponse

export const tasks$ = syncedSupabase({
  supabase: supabase,
  collection: "tasks",
  create: async (
    item: Partial<Tables<"tasks">>,
  ): Promise<PostgrestSingleResponse<Tables<"tasks">>> => {
    const result = await supabase
      .from("tasks")
      .insert(item as any) // Cast to any to bypass TS error related to partial for now
      .select()
      .single();
    if (result.error) throw result.error;
    return result;
  },
  update: async (
    item: Partial<Tables<"tasks">>,
  ): Promise<PostgrestSingleResponse<Tables<"tasks">>> => {
    const result = await supabase
      .from("tasks")
      .update(item as any) // Cast to any
      .eq("id", item.id!) // Use non-null assertion
      .select()
      .single();
    if (result.error) throw result.error;
    return result;
  },
  delete: async (
    item: Tables<"tasks">,
  ): Promise<PostgrestSingleResponse<null>> => {
    const result = await supabase.from("tasks").delete().eq("id", item.id!); // Use non-null assertion
    if (result.error) throw result.error;
    return result;
  },
});

export const healthAndHappiness$ = syncedSupabase({
  supabase: supabase,
  collection: "health_and_happiness",
  create: async (
    item: Partial<Tables<"health_and_happiness">>,
  ): Promise<PostgrestSingleResponse<Tables<"health_and_happiness">>> => {
    const result = await supabase
      .from("health_and_happiness")
      .insert(item as any) // Cast to any
      .select()
      .single();
    if (result.error) throw result.error;
    return result;
  },
  update: async (
    item: Partial<Tables<"health_and_happiness">>,
  ): Promise<PostgrestSingleResponse<Tables<"health_and_happiness">>> => {
    const result = await supabase
      .from("health_and_happiness")
      .update(item as any) // Cast to any
      .eq("user_id", item.user_id!) // Use non-null assertion
      .select()
      .single();
    if (result.error) throw result.error;
    return result;
  },
  delete: async (
    item: Tables<"health_and_happiness">,
  ): Promise<PostgrestSingleResponse<null>> => {
    const result = await supabase
      .from("health_and_happiness")
      .delete()
      .eq("user_id", item.user_id!); // Use non-null assertion
    if (result.error) throw result.error;
    return result;
  },
});

export const checklistItems$ = syncedSupabase({
  supabase: supabase,
  collection: "checklistitems",
  create: async (
    item: Partial<Tables<"checklistitems">>,
  ): Promise<PostgrestSingleResponse<Tables<"checklistitems">>> => {
    const result = await supabase
      .from("checklistitems")
      .insert(item as any) // Cast to any
      .select()
      .single();
    if (result.error) throw result.error;
    return result;
  },
  update: async (
    item: Partial<Tables<"checklistitems">>,
  ): Promise<PostgrestSingleResponse<Tables<"checklistitems">>> => {
    const result = await supabase
      .from("checklistitems")
      .update(item as any) // Cast to any
      .eq("id", item.id!) // Use non-null assertion
      .select()
      .single();
    if (result.error) throw result.error;
    return result;
  },
  delete: async (
    item: Tables<"checklistitems">,
  ): Promise<PostgrestSingleResponse<null>> => {
    const result = await supabase
      .from("checklistitems")
      .delete()
      .eq("id", item.id!); // Use non-null assertion
    if (result.error) throw result.error;
    return result;
  },
});
