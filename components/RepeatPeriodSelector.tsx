import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { View, StyleSheet } from 'react-native';

import { RepeatPeriod } from '~/types';

interface RepeatPeriodSelectorProps {
  repeatPeriod: RepeatPeriod | null | '';
  setRepeatPeriod: (value: RepeatPeriod | null | '') => void;
}

export default function RepeatPeriodSelector({
  repeatPeriod,
  setRepeatPeriod,
}: Readonly<RepeatPeriodSelectorProps>) {
  return (
    <View className="my-4" style={styles.container}>
      <Picker
        selectedValue={repeatPeriod}
        onValueChange={(itemValue) => setRepeatPeriod(itemValue as RepeatPeriod | '' | null)}
        mode="dropdown"
        dropdownIconColor="black"
        style={styles.picker}>
        <Picker.Item label="No Repeat" value="" />
        <Picker.Item label="Daily" value="Daily" />
        <Picker.Item label="Weekly" value="Weekly" />
        <Picker.Item label="Monthly" value="Monthly" />
        <Picker.Item label="Yearly" value="Yearly" />
      </Picker>
      <View style={styles.iconContainer}>
        <FontAwesome6 name="circle-chevron-right" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: 60,
  },
  iconContainer: {
    paddingLeft: 8,
  },
});
