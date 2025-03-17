import { Slider, Text } from "@rneui/themed";
import { View } from "react-native";

import { RepeatPeriod } from "~/types";
import { calculateRepeatText } from "~/utils/tasks/calculateRepeatText";

export const RepeatFrequencySlider = ({
  period,
  frequency,
  onChange,
}: Readonly<{
  period: RepeatPeriod;
  frequency: number | null;
  onChange: (value: number) => void;
}>) => (
  <View>
    <View>
      <Text>Repeat Every</Text>
      <Text>{calculateRepeatText(period, frequency as number)}</Text>
    </View>
    <View>
      <View>
        <Slider
          value={1}
          minimumValue={1}
          maximumValue={period === "Monthly" ? 6 : 15}
          onValueChange={onChange}
          orientation="horizontal"
        />
      </View>
    </View>
  </View>
);
