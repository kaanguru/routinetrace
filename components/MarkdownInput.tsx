import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { Text, Button, Input, useThemeMode } from '@rneui/themed';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

type MarkdownInputProps = {
  notes: string;
  setNotes: (notes: string) => void;
};

export default function MarkdownInput({ notes, setNotes }: Readonly<MarkdownInputProps>) {
  const [showPreview, setShowPreview] = useState(false);
  const { mode } = useThemeMode();
  const styles = StyleSheet.create({
    body: {
      padding: 10,
      borderColor: 'gray',
      borderWidth: 1,
      minHeight: 100,
      color: mode === 'dark' ? '#FFFAEB' : '#051824',
    },
  });
  return (
    <View>
      <View className="items-center justify-between">
        <Text className="text-lg">Notes</Text>
        <Button onPress={() => setShowPreview((prev) => !prev)} />
        {showPreview ? (
          <FontAwesome6 name="pencil" size={18} color={mode === 'dark' ? '#FFFAEB' : '#051824'} />
        ) : (
          <Ionicons name="scan" size={20} color={mode === 'dark' ? '#FFFAEB' : '#051824'} />
        )}
      </View>
      {showPreview ? (
        <View>
          <Markdown style={styles}>{notes}</Markdown>
        </View>
      ) : (
        <Input
          multiline
          placeholder="Notes with markdown support"
          value={notes}
          onChangeText={setNotes}
          className="bg-background-gray min-h-[80px] py-2 !text-black *:text-black dark:bg-background-light"
        />
      )}
    </View>
  );
}
