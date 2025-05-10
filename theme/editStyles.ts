import { StyleSheet } from "react-native";
// --- Styles ---
// Using StyleSheet.create for performance and organization
const editStyles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 90, // Space for floating action buttons
    marginBottom: 100, // Space for floating action buttons
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingIndicator: {
    color: "#ff006e",
  },
  errorText: {
    color: "#FF0010",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    padding: 8,
  },
  weeklyOptionsContainer: {
    marginTop: 8,
    padding: 8,
  },
  repeatOnTextContainer: {
    marginTop: 16, // Add more space above "Repeat on"
    marginBottom: 8, // Add space below
  },
  repeatOnText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16, // Slightly larger for clarity
  },
  yearlyOptionsContainer: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  checkboxContainer: {
    marginTop: 16,
  },
  checkboxTitle: {
    fontFamily: "Ubuntu_400Regular",
    marginLeft: 4, // Add space between checkbox and title
  },
  checkboxInnerContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0, // Remove default padding
    marginLeft: 0, // Remove default margin
  },
  datePickerContainer: {
    marginTop: 8,
    paddingVertical: 8, // Use vertical padding
    paddingHorizontal: 4,
    alignItems: "center",
  },
  dateLabel: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16, // Match repeatOnText size
  },
  dateValue: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 18,
    marginVertical: 8,
  },
  changeDateButton: {
    borderColor: "#ff006e",
    paddingVertical: 6, // Adjust padding
    paddingHorizontal: 12,
  },
  changeDateButtonTitle: {
    color: "#ff006e",
    fontFamily: "Ubuntu_500Medium",
  },
  checklistHeader: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 4, // Align with other inputs
  },
  checklistTitle: {
    fontSize: 18,
    fontFamily: "Ubuntu_700Bold",
    marginBottom: 12, // More space before button
  },
  addRoutineButtonContainer: {
    // Removed fixed height, allow button to size naturally
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addRoutineButton: {
    backgroundColor: "#8AC926",
    paddingVertical: 8, // Adjust padding
    paddingHorizontal: 12,
  },
  addRoutineButtonTitle: {
    fontFamily: "Ubuntu_500Medium",
  },
  addRoutineIcon: {
    marginRight: 8,
  },
  checklistErrorText: {
    color: "#FF0010",
    fontFamily: "Ubuntu_500Medium",
    paddingHorizontal: 4,
    marginTop: 4,
  },
  // Checklist Item specific styles
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checklistItemInputContainer: {
    flex: 1, // Take available space
    marginRight: 8,
  },
  checklistItemInput: {
    // Add styles if needed, e.g., fontSize, fontFamily
    height: 30,
  },
  checklistItemInputInnerContainer: {
    // borderBottomWidth: 0, // Remove RNE Input underline
    // paddingHorizontal: 1, // Remove RNE Input default padding
  },
  checklistItemActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    verticalAlign: "middle",
  },
  iconButton: {
    padding: 8, // Hit area for icons
    marginLeft: 4, // Space between icons
  },
  moveButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    borderTopWidth: 1, // Separator line
    borderTopColor: "rgba(128, 128, 128, 0.2)", // Light separator
    paddingTop: 8,
  },
  moveButtonMargin: {
    marginRight: 8,
  },
  // Action Buttons specific styles
  deleteButton: {
    backgroundColor: "#FF0010",
  },
  saveButton: {
    backgroundColor: "#8AC926",
  },
  actionButtonTitle: {
    color: "#FFFAEB",
  },
  actionButtonIcon: {
    marginRight: 6,
  },
});
// --- Dynamic Style Functions ---

// Function to get dynamic styles for ChecklistItem based on state
function getChecklistItemStyle(
  isEditing: boolean,
  mode: "light" | "dark"
): { container: object } {
  const baseBgColor = mode === "dark" ? "#18171A" : "#FFFAEB"; // White equivalent
  const editingBgColor = mode === "dark" ? "#232129" : "#FFEFC2"; // Amber-100
  const baseBorderColor = mode === "dark" ? "#2C2B31" : "#E2E0D5"; // Lighter gray
  const editingBorderColor = mode === "dark" ? "#4F10A8" : "#FF006E"; // Pink-600

  return StyleSheet.create({
    container: {
      padding: 12,
      backgroundColor: isEditing ? editingBgColor : baseBgColor,
      borderRadius: 8,
      marginVertical: 4,
      marginHorizontal: 8,
      borderWidth: 1,
      borderColor: isEditing ? editingBorderColor : baseBorderColor,
      // Common shadow/elevation for consistency
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  });
}
// Function to get dynamic styles for Move Buttons based on mode
function getMoveButtonStyle(mode: "light" | "dark"): { button: object } {
  return StyleSheet.create({
    button: {
      padding: 8,
      backgroundColor: mode === "dark" ? "#2C2B31" : "#F0EEE6", // Slightly off-white
      borderRadius: 4,
    },
  });
}
// Function to get dynamic styles for Action Buttons container based on mode
function getActionButtonsContainerStyle(mode: "light" | "dark"): object {
  return {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor:
      mode === "dark"
        ? "rgba(0, 31, 82, 0.95)" // Dark blue base, slightly more opaque
        : "rgba(255, 250, 235, 0.95)", // White base, slightly more opaque
    borderTopWidth: 1,
    borderTopColor: mode === "dark" ? "#001F52" : "#FFEFC2", // Sky-950 / Amber-100
  };
}

export {
  editStyles,
  getMoveButtonStyle,
  getActionButtonsContainerStyle,
  getChecklistItemStyle,
};
