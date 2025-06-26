import { Text }from "@rn-vui/themed";
import { View } from "react-native";

import BiriBirseyDesin from "~/components/lotties/BiriBirseyDesin";

function TaskListEmptyComponent() {
  return (
    <View>
      <BiriBirseyDesin />
      <Text>No tasks available. Add some tasks from the button below!</Text>
    </View>
  );
}

export default TaskListEmptyComponent;
