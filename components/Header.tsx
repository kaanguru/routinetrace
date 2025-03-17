import { FontAwesome6 } from '@expo/vector-icons';
import { Button, Text, useThemeMode } from '@rneui/themed';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
interface HeaderProps {
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }) => {
  const { mode } = useThemeMode();
  return (
    <View id="header" className=" mt-1 bg-background-light dark:bg-background-dark">
      <View className="mx-1 mb-3 rounded-full bg-background-dark  dark:bg-background-light">
        <Button size="md" onPress={() => router.back()}>
          <FontAwesome6
            name="arrow-left"
            size={20}
            style={{ padding: 8 }}
            color={mode === 'light' ? '#FFFAEB' : '#051824'}
          />
        </Button>
      </View>
      <View className="my-auto">
        <Text className="text-typography-black dark:text-typography-white mb-3 font-heading">
          {headerTitle}
        </Text>
      </View>
    </View>
  );
};

export default Header;
