import { Input } from "@rn-vui/themed";
import { TextInput, View } from "react-native";

import { FormInputProps } from "@/types";

export default function TaskFormInput({
  title,
  notes,
  setTitle,
  setNotes,
}: Readonly<FormInputProps>) {
  return (
    <View>
      <Input placeholder="Task title" value={title} onChangeText={setTitle} />
      <TextInput
        editable
        multiline
        placeholder="Task notes"
        value={notes}
        onChangeText={setNotes}
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: "#FD590D",
          backgroundColor: "#FFEFC2AA",
          paddingHorizontal: 10,
          minHeight: 80,
          textAlignVertical: "top",
          marginHorizontal: 12,
        }}
      />
    </View>
  );
}
