// components/RepeatPeriodSelector.tsx
import { FontAwesome6 } from "@expo/vector-icons";
import { BottomSheet, Button, ListItem, Text } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { RepeatPeriod } from "~/types"; // Assuming RepeatPeriod type is defined in ~/types

interface RepeatPeriodSelectorProps {
  repeatPeriod: RepeatPeriod | "" | null;
  setRepeatPeriod: (period: RepeatPeriod | "" | null) => void;
}

function RepeatPeriodSelector({
  repeatPeriod,
  setRepeatPeriod,
}: Readonly<RepeatPeriodSelectorProps>) {
  const [isVisible, setIsVisible] = useState(false);

  const repeatOptions: { label: string; value: RepeatPeriod | "" | null }[] = [
    { label: "No Repeat", value: "" },
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Yearly", value: "Yearly" },
  ];

  const selectedLabel =
    repeatOptions.find((opt) => opt.value === repeatPeriod)?.label ||
    "Select Repeat Period";

  return (
    <View style={styles.container}>
      {/* Use RNE Button to trigger the BottomSheet */}
      <Button
        type="outline" // Or "solid", "clear" depending on desired style
        buttonStyle={styles.pickerButton}
        titleStyle={styles.pickerButtonTitle}
        onPress={() => setIsVisible(true)}
        iconRight // Place icon to the right
        icon={
          <FontAwesome6 name="circle-chevron-right" size={20} color="#00173D" /> // Use project's Black color
        }
      >
        {selectedLabel}
      </Button>

      <BottomSheet
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        // Optional: Add styling to the bottom sheet container if needed
        // containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
      >
        {repeatOptions.map((option, index) => (
          <ListItem
            key={option.label}
            containerStyle={
              option.value === repeatPeriod ? styles.selectedOption : {}
            }
            onPress={() => {
              setRepeatPeriod(option.value);
              setIsVisible(false);
            }}
            bottomDivider
          >
            <ListItem.Content>
              <ListItem.Title style={styles.optionText}>
                {option.label}
              </ListItem.Title>
            </ListItem.Content>
            {option.value === repeatPeriod && (
              <FontAwesome6 name="check" size={16} color="#8AC926" />
            )}
          </ListItem>
        ))}
        {/* Optional: Add a cancel button */}
        <ListItem
          key="cancel"
          containerStyle={styles.cancelButton}
          onPress={() => setIsVisible(false)}
        >
          <ListItem.Content>
            <ListItem.Title style={styles.cancelButtonText}>
              Cancel
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  pickerButton: {
    // Adjust styling for RNE Button
    justifyContent: "space-between", // Pushes title and icon apart
    borderColor: "#FEBA9A", // red-300
    borderWidth: 0.25,
    borderRadius: 8,
    backgroundColor: "#FFFAEB", // White
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  pickerButtonTitle: {
    color: "#00173D", // Black
    fontFamily: "Ubuntu_400Regular", // Use project font
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: "#FFEFC2", // amber-100 for subtle highlight
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Ubuntu_400Regular",
    color: "#00173D", // Black
  },
  cancelButton: {
    backgroundColor: "#FEBA9A", // red-300
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#FFFAEB", // White
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
  },
});

export default RepeatPeriodSelector;
