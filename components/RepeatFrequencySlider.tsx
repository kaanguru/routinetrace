import { Text } from "@rneui/themed";
import Slider from "@react-native-community/slider";
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
          style={{ width: 200, height: 40 }}
          step={1}
        />
      </View>
    </View>
  </View>
);
