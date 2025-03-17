import { FontAwesome6 } from "@expo/vector-icons";
import { Button, Text, useThemeMode } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
interface HeaderProps {
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }) => {
  const { mode } = useThemeMode();
  return (
    <View id="header">
      <View>
        <Button size="md" onPress={() => router.back()}>
          <FontAwesome6
            name="arrow-left"
            size={20}
            style={{ padding: 8 }}
            color={mode === "light" ? "#FFFAEB" : "#051824"}
          />
        </Button>
      </View>
      <View>
        <Text>{headerTitle}</Text>
      </View>
    </View>
  );
};

export default Header;
