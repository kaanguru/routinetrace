import { Slider, Text } from '@rneui/themed';
import { View } from 'react-native';

import { RepeatPeriod } from '~/types';
import { calculateRepeatText } from '~/utils/tasks/calculateRepeatText';

export const RepeatFrequencySlider = ({
  period,
  frequency,
  onChange,
}: Readonly<{
  period: RepeatPeriod;
  frequency: number | null;
  onChange: (value: number) => void;
}>) => (
  <View className="mt-4">
    <View>
      <Text>Repeat Every</Text>
      <Text className="my-auto">{calculateRepeatText(period, frequency as number)}</Text>
    </View>
    <View>
      <View className="m-auto h-1/6 w-4/6">
        <Slider
          value={1}
          minimumValue={1}
          maximumValue={period === 'Monthly' ? 6 : 15}
          onValueChange={onChange}
          orientation="horizontal"
        />
      </View>
    </View>
  </View>
);
