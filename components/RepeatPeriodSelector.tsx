import { FontAwesome6 } from "@expo/vector-icons";
import { BottomSheet, Button, ListItem } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { RepeatPeriod } from "~/types";

interface RepeatPeriodSelectorProps {
  repeatPeriod: RepeatPeriod | "" | null;
  setRepeatPeriod: (period: RepeatPeriod | "" | null) => void;
}

export default function RepeatPeriodSelector({
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
      <Button
        type="outline"
        buttonStyle={styles.pickerButton}
        titleStyle={styles.pickerButtonTitle}
        onPress={() => setIsVisible(true)}
        iconRight
        icon={
          <FontAwesome6 name="circle-chevron-right" size={20} color="#00173D" />
        }
      >
        {selectedLabel}
      </Button>

      <BottomSheet
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
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
    justifyContent: "space-between",
    borderColor: "#FEBA9A",
    borderWidth: 0.25,
    borderRadius: 8,
    backgroundColor: "#FFFAEB",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  pickerButtonTitle: {
    color: "#00173D",
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: "#FFEFC2",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Ubuntu_400Regular",
    color: "#00173D",
  },
  cancelButton: {
    backgroundColor: "#FEBA9A",
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#FFFAEB",
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
  },
});

