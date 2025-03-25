import { Input } from "@rneui/themed";
import { View } from "react-native";

import { FormInputProps } from "@/types";

export function FormInput({
  title,
  notes,
  setTitle,
  setNotes,
}: Readonly<FormInputProps>) {
  return (
    <>
      <Input placeholder="Task title" value={title} onChangeText={setTitle} />

      <View>
        <Input placeholder="Task notes" value={notes} onChangeText={setNotes} />
      </View>
    </>
  );
}
