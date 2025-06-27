import { FontAwesome6 } from "@expo/vector-icons";
import { BottomSheet, Button, ListItem, useTheme } from "@rn-vui/themed";
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
  const { theme } = useTheme();

  const repeatOptions: { label: string; value: RepeatPeriod | "" | null }[] = [
    { label: "Do not Repeat", value: "" },
    { label: "Repeat Daily", value: "Daily" },
    { label: "Repeat Weekly", value: "Weekly" },
    { label: "Repeat Monthly", value: "Monthly" },
    { label: "Repeat Every Year", value: "Yearly" },
  ];

  const selectedLabel =
    repeatOptions.find((opt) => opt.value === repeatPeriod)?.label ||
    "Select Repeat Period";

  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    pickerButton: {
      justifyContent: "space-between",
      borderColor: theme.colors.greyOutline,
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: theme.colors.grey5, // Use a theme color for the button background
      paddingHorizontal: 15,
      paddingVertical: 12,
    },
    pickerButtonTitle: {
      color: theme.colors.black, // Ensure good contrast with grey5 in both themes
      fontFamily: "Ubuntu_400Regular",
      fontSize: 16,
    },
    selectedOption: {
      backgroundColor: theme.colors.grey4, // Highlight selected option with a theme color
    },
    optionText: {
      fontSize: 16,
      fontFamily: "Ubuntu_400Regular",
      color: theme.colors.black, // Ensure text is visible
    },
    cancelButton: {
      backgroundColor: theme.colors.warning, // Use a theme color for the cancel button
      marginTop: 10,
    },
    cancelButtonText: {
      textAlign: "center",
      color: theme.colors.white, // Ensure text is visible
      fontFamily: "Ubuntu_500Medium",
      fontSize: 16,
    },
    bottomSheetContainer: {
      backgroundColor: theme.colors.background, // Ensure bottom sheet background is themed
    },
    listItemContainer: {
      backgroundColor: theme.colors.background, // Ensure list item background is themed
    },
  });

  return (
    <View style={styles.container}>
      <Button
        type="outline"
        buttonStyle={styles.pickerButton}
        titleStyle={styles.pickerButtonTitle}
        onPress={() => setIsVisible(true)}
        iconRight
        icon={
          <FontAwesome6
            name="circle-chevron-right"
            size={20}
            color={theme.colors.black} // Ensure good contrast with grey5 in both themes
          />
        }
      >
        {selectedLabel}
      </Button>

      <BottomSheet
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
        containerStyle={styles.bottomSheetContainer} // Apply theme to bottom sheet container
      >
        {/* TODO: The "key" warning is a known issue in @rn-vui/themed's BottomSheet.
            This is a temporary workaround until the bug is fixed.
            Track the issue here: https://github.com/react-native-elements/react-native-elements/issues/3968 */}
        {repeatOptions.map((option, index) => (
          <ListItem
            key={index}
            containerStyle={[
              styles.listItemContainer, // Apply theme to all list items
              option.value === repeatPeriod ? styles.selectedOption : {},
            ]}
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
              <FontAwesome6
                name="check"
                size={16}
                color={theme.colors.success}
              />
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
