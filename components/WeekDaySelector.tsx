import { useTheme, Text }from "@rn-vui/themed";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { DayOfWeek } from "~/types";

const WeekdaySelector = ({
  selectedDays,
  onDayToggle,
}: Readonly<{
  selectedDays: DayOfWeek[];
  onDayToggle: (day: DayOfWeek, isSelected: boolean) => void;
}>) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      paddingVertical: 8,
    },
    dayButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.grey4,
      paddingVertical: 8,
      paddingHorizontal: 2,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 2,
      borderRadius: 4,
    },
    dayButtonSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    dayButtonUnselected: {
      backgroundColor: theme.colors.background,
    },
    dayText: {
      fontSize: 14,
      fontFamily: "UbuntuMono_400Regular",
    },
    dayTextSelected: {
      color: theme.colors.white,
    },
    dayTextUnselected: {
      color: theme.colors.black,
    },
  });

  const daysOfWeek: DayOfWeek[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return (
    <View style={styles.container}>
      {daysOfWeek.map((day) => {
        const isSelected = selectedDays.includes(day);
        return (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              isSelected
                ? styles.dayButtonSelected
                : styles.dayButtonUnselected,
            ]}
            onPress={() => {
              onDayToggle(day, !isSelected);
            }}
          >
            <Text
              style={[
                styles.dayText,
                isSelected ? styles.dayTextSelected : styles.dayTextUnselected,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default WeekdaySelector;
