import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, CheckBox, Icon } from "@rneui/themed";
import { View, Pressable } from "react-native";

import TaskFormInput from "@/components/TaskFormInput";
import RepeatFrequencySlider from "@/components/RepeatFrequencySlider";
import RepeatPeriodSelector from "@/components/RepeatPeriodSelector";
import WeekdaySelector from "@/components/WeekDaySelector";
import { RepeatPeriod, TaskFormData } from "@/types";

function TaskFormHeader({
  formData,
  setFormData,
  showDatePicker,
  setShowDatePicker,
}: {
  formData: TaskFormData;
  setFormData: React.Dispatch<React.SetStateAction<TaskFormData>>;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View>
      <TaskFormInput
        title={formData.title}
        notes={formData.notes}
        setTitle={(title: string) =>
          setFormData((prev) => ({ ...prev, title }))
        }
        setNotes={(notes: string) =>
          setFormData((prev) => ({ ...prev, notes }))
        }
      />
      <RepeatPeriodSelector
        repeatPeriod={formData.repeatPeriod}
        setRepeatPeriod={(value: "" | RepeatPeriod | null) =>
          setFormData((prev) => ({
            ...prev,
            repeatPeriod: value as RepeatPeriod | "",
          }))
        }
      />

      {(formData.repeatPeriod === "Daily" ||
        formData.repeatPeriod === "Monthly") && (
        <RepeatFrequencySlider
          period={formData.repeatPeriod}
          frequency={formData.repeatFrequency}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, repeatFrequency: value }))
          }
        />
      )}

      {formData.repeatPeriod === "Weekly" && (
        <View style={{ marginTop: 10, padding: 10 }}>
          <RepeatFrequencySlider
            period={formData.repeatPeriod}
            frequency={formData.repeatFrequency}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, repeatFrequency: value }))
            }
          />
          <WeekdaySelector
            selectedDays={formData.repeatOnWk}
            onDayToggle={(day, isSelected) => {
              setFormData((prev) => ({
                ...prev,
                repeatOnWk: isSelected
                  ? [...prev.repeatOnWk, day]
                  : prev.repeatOnWk.filter((d) => d !== day),
              }));
            }}
          />
        </View>
      )}

      {formData.repeatPeriod === "Yearly" && (
        <View>
          <View>
            <Text>Repeat Every Year</Text>
          </View>
        </View>
      )}

      <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <CheckBox
            checked={formData.isCustomStartDateEnabled}
            title="Custom Start Date"
            onPress={() => {
              setFormData((prev) => {
                const nextIsSelected = !prev.isCustomStartDateEnabled; // Calculate the next state
                return {
                  ...prev,
                  isCustomStartDateEnabled: nextIsSelected,
                  customStartDate: nextIsSelected ? new Date() : null,
                };
              });
            }}
          />
        </View>
      </View>

      {formData.isCustomStartDateEnabled && (
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={{
                margin: 10,
                padding: 5,
                borderRadius: 5,
                backgroundColor: "#FFEFC2",
                borderBlockColor: "#FF006E",
                borderWidth: 1,
              }}
            >
              <Icon
                name="calendar-month"
                type="material"
                size={24}
                color="black"
              />
            </Pressable>
            <Text h4>{formData.customStartDate?.toDateString()}</Text>
          </View>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={formData.customStartDate || new Date()}
          mode="date"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFormData((prev) => ({
                ...prev,
                customStartDate: selectedDate,
              }));
            }
          }}
        />
      )}
    </View>
  );
}

export default TaskFormHeader;
