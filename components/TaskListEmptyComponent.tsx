import { Text } from '@rneui/themed';
import { View } from 'react-native';

import BiriBirseyDesin from '~/components/lotties/BiriBirseyDesin';

function TaskListEmptyComponent() {
  return (
    <View className="flex-1 items-center justify-center">
      <BiriBirseyDesin />
      <Text className="mt-4 text-center">
        No tasks available. Add some tasks from the button below!
      </Text>
    </View>
  );
}

export default TaskListEmptyComponent;
