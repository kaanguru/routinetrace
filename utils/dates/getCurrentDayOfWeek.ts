import { DayOfWeek } from "~/types";

export default function getCurrentDayOfWeek(): DayOfWeek {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(),
  ) as DayOfWeek;
}
