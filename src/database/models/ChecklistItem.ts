import { Model } from "@nozbe/watermelondb";
import text from "@nozbe/watermelondb/decorators/text";
import date from "@nozbe/watermelondb/decorators/date";
import field from "@nozbe/watermelondb/decorators/field";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import json from "@nozbe/watermelondb/decorators/json";

export class ChecklistItem extends Model {
  static table = "checklistitems";

  // WatermelonDB Model provides an `id` property (string).
  // The schema's `id` is a bigint PK. WatermelonDB should handle mapping this to its internal string `id`.

  @text("supabase_id") supabase_id!: string; // Supabase's UUID, stored as string.
  @date("created_at") createdAt!: Date;
  @text("content") content!: string;
  @date("updated_at") updatedAt!: Date | undefined; // The field is optional based on type and schema
  @field("is_complete") isComplete!: boolean;
  // Schema defines task_id as bigint, which maps to number or string.
  // For foreign keys, number is often used if it's the primary key of the other table.
  @field("task_id") taskId!: number;
}
