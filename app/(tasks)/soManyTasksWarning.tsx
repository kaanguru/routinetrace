import { FontAwesome6 } from "@expo/vector-icons";
import { Button, Card, Text } from "@rn-vui/themed";
import { router } from "expo-router";

import Header from "@/components/Header";
import TiredOfWorking from "@/components/lotties/TiredOfWorking";

export default function soManyTasksWarning() {
  return (
    <>
      <Header headerTitle="Over Load Warning" />
      <TiredOfWorking />
      <Card>
        <Text>
          You have so much uncompleted tasks. Please go back and finish some
          tasks before adding more.
        </Text>
        <Text>
          Tasks are daily jobs or activities that will take more than 40
          minutes...
        </Text>
        <Button
          onPress={() => router.push("/(tasks)/create-task")}
          title="I can handle more!"
        />
        <FontAwesome6 name="face-smile-wink" size={24} color="black" />{" "}
      </Card>
    </>
  );
}
