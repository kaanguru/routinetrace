import { Model } from "@nozbe/watermelondb";
import text from "@nozbe/watermelondb/decorators/text";
import date from "@nozbe/watermelondb/decorators/date";
import json from "@nozbe/watermelondb/decorators/json";
import field from "@nozbe/watermelondb/decorators/field";

// Define DayOfWeek locally as it's not yet available from database.types
type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// Define RepeatPeriod locally
type RepeatPeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

export class Task extends Model {
  static table = "tasks";

  // WatermelonDB Model provides an `id` property (string).
  // The schema's `id` is a bigint PK. WatermelonDB should handle mapping this to its internal string `id`.
  // We do not redefine `id` here.

  // Map other fields according to the schema:
  @text("user_id") userId!: string; // Supabase's UUID, stored as string.
  @date("created_at") createdAt!: Date;
  @text("title") title!: string;
  @text("notes") notes!: string | undefined;
  @date("updated_at") updatedAt!: Date | undefined;
  @field("is_complete") isComplete!: boolean;
  @field("position") position!: number | undefined;
  // Storing array types like repeat_on_wk as JSON string with @json decorator.
  @json("repeat_on_wk", String) repeatOnWk!: DayOfWeek[] | undefined;
  @field("repeat_frequency") repeatFrequency!: number | undefined;
  @text("repeat_period") repeatPeriod!: RepeatPeriod | undefined;
}
