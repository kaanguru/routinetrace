import { Text } from "@rneui/themed";
import Slider from "@react-native-community/slider";
import { View } from "react-native";

import { RepeatPeriod } from "~/types";
import { calculateRepeatText } from "~/utils/tasks/calculateRepeatText";

export default function RepeatFrequencySlider({
  period,
  frequency,
  onChange,
}: Readonly<{
  period: RepeatPeriod;
  frequency: number | null;
  onChange: (value: number) => void;
}>) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          marginBottom: 5,
        }}
      >
        <Text h4>Repeat Every </Text>
        <Text h4>{calculateRepeatText(period, frequency as number)}</Text>
      </View>
      <View style={{ width: "100%" }}>
        <Slider
          value={1}
          minimumValue={1}
          maximumValue={period === "Monthly" ? 6 : 15}
          onValueChange={onChange}
          style={{ marginVertical: 10, height: 40 }}
          step={1}
          maximumTrackTintColor="#FEBA9A"
          minimumTrackTintColor="#8AC926"
          thumbTintColor="#ff006e"
        />
      </View>
    </View>
  );
}
