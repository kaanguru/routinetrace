import React, { useCallback } from "react";
import { View } from "react-native";
import TaskFormInput from "./TaskFormInput";
import RepeatPeriodSelector from "./RepeatPeriodSelector";

export default function EditListHeader(formData) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    notes: "",
    repeatPeriod: "",
    repeatFrequency: 1,
    repeatOnWk: [],
    customStartDate: null,
    isCustomStartDateEnabled: false,
    checklistItems: [],
  });
  const setTitle = useCallback((title: string) => {
    setFormData((prev) => ({ ...prev, title }));
  }, []);

  const setNotes = useCallback((notes: string) => {
    setFormData((prev) => ({ ...prev, notes }));
  }, []);

  const setRepeatPeriod = useCallback((value: RepeatPeriod | "" | null) => {
    setFormData((prev) => ({
      ...prev,
      repeatPeriod: value as RepeatPeriod | "",
    }));
  }, []);

  const setRepeatFrequency = useCallback((value: number) => {
    setFormData((prev) => ({ ...prev, repeatFrequency: value }));
  }, []);
  return useCallback(
    () => (
      <View style={{ flex: 1, padding: 8 }}>
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
          <View style={{ marginTop: 8 }}>
            <View>
              <Text style={{ fontFamily: "Ubuntu_500Medium" }}>
                Repeat Every Year
              </Text>
            </View>
          </View>
        )}

        <View style={{ marginTop: 16 }}>
          <CheckBox
            checked={formData.isCustomStartDateEnabled}
            title="Custom Start Date"
            titleProps={{ style: { fontFamily: "Ubuntu_400Regular" } }}
            onPress={() => {
              setFormData((prev) => ({
                ...prev,
                isCustomStartDateEnabled: !prev.isCustomStartDateEnabled,
              }));
            }}
            containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
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
              {formData.customStartDate?.toDateString()}
            </Text>
            <Button
              size="sm"
              type="outline"
              title="Change Date"
              onPress={() => setShowDatePicker(true)}
              buttonStyle={{ borderColor: "#ff006e" }}
              titleStyle={{ color: "#ff006e", fontFamily: "Ubuntu_500Medium" }}
            />
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
        <View style={{ marginTop: 24, marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Ubuntu_700Bold",
              marginBottom: 8,
            }}
          >
            Routines
          </Text>
          <Button
            type="solid"
            onPress={handleAddChecklistItem}
            title="Add Routine"
            size="sm"
            containerStyle={{ height: 40, marginBottom: 10 }}
            buttonStyle={{ backgroundColor: "#8AC926" }}
            titleStyle={{ fontFamily: "Ubuntu_500Medium" }}
            icon={
              <FontAwesome6
                name="plus"
                size={16}
                color="#FFFAEB"
                style={{ marginRight: 8 }}
              />
            }
          />
        </View>
        {isCheckListItemsLoading && <ActivityIndicator color="#ff006e" />}
        {isCheckListItemsError && (
          <Text style={{ color: "#FF0010", fontFamily: "Ubuntu_500Medium" }}>
            Error loading checklist items
          </Text>
        )}
      </View>
    ),
    [
      formData,
      showDatePicker,
      isCheckListItemsLoading,
      isCheckListItemsError,
      handleAddChecklistItem,
    ],
  );
}
