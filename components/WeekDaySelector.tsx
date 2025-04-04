import { CheckBox } from "@rneui/themed";
import { useEffect } from "react";
import { View } from "react-native";

import { DayOfWeek } from "~/types";
import getCurrentDayOfWeek from "~/utils/dates/getCurrentDayOfWeek";

const WeekdaySelector = ({
  selectedDays,
  onDayToggle,
}: Readonly<{
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek, isSelected: boolean) => void;
}>) => {
  useEffect(() => {
    const currentDay = getCurrentDayOfWeek();
    if (selectedDays.length === 0) {
      onDayToggle(currentDay, true);
    }
  }, [onDayToggle, selectedDays.length]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as DayOfWeek[]).map(
        (day) => (
          <CheckBox
            key={day}
            checked={selectedDays.includes(day)}
            onPress={() => {
              const isSelected = !selectedDays.includes(day); // Toggle the current state
              onDayToggle(day, isSelected);
            }}
            title={day}
          />
        )
      )}
    </View>
  );
};

export default WeekdaySelector;
