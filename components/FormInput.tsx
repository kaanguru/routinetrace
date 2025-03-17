import { Input } from "@rneui/themed";
import { View } from "react-native";

import MarkdownInput from "./MarkdownInput";

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
        <MarkdownInput notes={notes} setNotes={setNotes} />
      </View>
    </>
  );
}
