import { Icon, Text } from "@rneui/themed";
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
    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
      <Text h4>Repeat Every </Text>
      <Text h4>{calculateRepeatText(period, frequency as number)}</Text>
    </View>
    <View style={{width: "100%", gap: 32 }}>
    <View style={{ 
  alignItems: 'center', 
}}>
        <Slider
          value={1}
          minimumValue={1}
          maximumValue={period === "Monthly" ? 6 : 15}
          onValueChange={onChange}
          style={{ marginVertical: 10, width: "100%", height: 40 }}
          step={1}
          maximumTrackTintColor="#FEBA9A"
          minimumTrackTintColor="#8AC926"
          thumbTintColor="#ff006e"
        />
      </View>
    </View>
  </View>
);
