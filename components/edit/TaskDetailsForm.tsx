// components/edit/TaskDetailsForm.tsx
import React, { useCallback } from "react";
import { View } from "react-native";
import { CheckBox, Text, Button } from "@rn-vui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ErrorBoundary } from "react-error-boundary";

// Components
import TaskFormInput from "@/components/TaskFormInput";
import RepeatFrequencySlider from "@/components/RepeatFrequencySlider";
import RepeatPeriodSelector from "@/components/RepeatPeriodSelector";
import WeekdaySelector from "@/components/WeekDaySelector";
import ErrorFallback from "@/components/error/ErrorFallback";

// Types
import { RepeatPeriod, TaskFormData, DayOfWeek } from "@/types";

// Styles
import { editStyles } from "@/theme/editCreateStyles";

// Utilities
import handleErrorBoundaryError from "@/utils/errorHandler";

interface TaskDetailsFormProps {
  formData: Pick<
    TaskFormData,
    | "title"
    | "notes"
    | "repeatPeriod"
    | "repeatFrequency"
    | "repeatOnWk"
    | "customStartDate"
    | "isCustomStartDateEnabled"
  >;
  setTitle: (title: string) => void;
  setNotes: (notes: string) => void;
  setRepeatPeriod: (value: RepeatPeriod | "" | null) => void;
  setRepeatFrequency: (value: number) => void;
  toggleWeekDay: (day: DayOfWeek, isSelected: boolean) => void;
  toggleCustomStartDate: () => void;
  setCustomStartDate: (date: Date | undefined) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
}

export default function TaskDetailsForm({
  formData,
  setTitle,
  setNotes,
  setRepeatPeriod,
  setRepeatFrequency,
  toggleWeekDay,
  toggleCustomStartDate,
  setCustomStartDate,
  showDatePicker,
  setShowDatePicker,
}: TaskDetailsFormProps) {
  const handleDateChange = useCallback(
    (_: any, selectedDate: Date | undefined) => {
      setShowDatePicker(false); // Always hide after interaction
      if (selectedDate) {
        setCustomStartDate(selectedDate);
      }
    },
    [setShowDatePicker, setCustomStartDate],
  );

  return (
    <View style={editStyles.formSection}>
      <TaskFormInput
        title={formData.title}
        notes={formData.notes}
        setTitle={setTitle}
        setNotes={setNotes}
      />

      <RepeatPeriodSelector
        repeatPeriod={formData.repeatPeriod}
        setRepeatPeriod={setRepeatPeriod}
      />

      {(formData.repeatPeriod === "Daily" ||
        formData.repeatPeriod === "Monthly") && (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={handleErrorBoundaryError}
        >
          <RepeatFrequencySlider
            period={formData.repeatPeriod}
            frequency={formData.repeatFrequency}
            onChange={setRepeatFrequency}
          />
        </ErrorBoundary>
      )}

      {formData.repeatPeriod === "Weekly" && (
        <View style={{ marginTop: 8, padding: 8 }}>
          <View style={{ margin: 4 }}>
            <RepeatFrequencySlider
              period={formData.repeatPeriod}
              frequency={formData.repeatFrequency}
              onChange={setRepeatFrequency}
            />
          </View>

          <View style={{ marginTop: 8 }}>
            <Text style={{ fontFamily: "Ubuntu_500Medium" }}>Repeat on</Text>
          </View>
          <WeekdaySelector
            selectedDays={formData.repeatOnWk}
            onDayToggle={toggleWeekDay}
          />
        </View>
      )}

      {formData.repeatPeriod === "Yearly" && (
        <View style={{ marginTop: 8 }}>
          <View>
            <Text style={{ fontFamily: "Ubuntu_500Medium" }}>
              Repeat Every Year
            </Text>
          </View>
        </View>
      )}

      {/* Custom Start Date */}
      <View style={editStyles.checkboxContainer}>
        <CheckBox
          checked={formData.isCustomStartDateEnabled}
          title="Custom Start Date"
          titleProps={{ style: { fontFamily: "Ubuntu_400Regular" } }}
          onPress={toggleCustomStartDate}
          containerStyle={editStyles.checkboxInnerContainer}
        />
      </View>

      {formData.isCustomStartDateEnabled && (
        <View style={{ marginTop: 8, padding: 4, alignItems: "center" }}>
          <Text style={{ fontFamily: "Ubuntu_500Medium" }}>Start Date</Text>
          <Text
            style={{
              fontFamily: "Ubuntu_700Bold",
              fontSize: 18,
              marginVertical: 8,
            }}
          >
            {formData.customStartDate?.toDateString() ?? "No date set"}
          </Text>
          <Button
            size="sm"
            type="outline"
            title="Change Date"
            onPress={() => setShowDatePicker(true)}
            buttonStyle={{ borderColor: "#ff006e" }}
            titleStyle={{
              color: "#ff006e",
              fontFamily: "Ubuntu_500Medium",
            }}
          />
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={formData.customStartDate || new Date()}
          mode="date"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}
