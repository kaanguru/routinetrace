import { DayOfWeek } from "~/types";

export default function getDayOfWeek(date?: Date): DayOfWeek {
  const targetDate = date ?? new Date();
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    targetDate,
  ) as DayOfWeek;
}
