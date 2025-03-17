import { Input } from '@rneui/themed';
import { View } from 'react-native';

import MarkdownInput from './MarkdownInput';

import { FormInputProps } from '@/types';

export function FormInput({ title, notes, setTitle, setNotes }: Readonly<FormInputProps>) {
  return (
    <>
      <Input
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
        className="min-h-[40px] py-2 text-black"
      />

      <View>
        <MarkdownInput notes={notes} setNotes={setNotes} />
      </View>
    </>
  );
}
