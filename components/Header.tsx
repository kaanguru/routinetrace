import { FontAwesome6 } from "@expo/vector-icons";
import { Text, useThemeMode } from "@rneui/themed";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
interface HeaderProps {
  headerTitle: string;
}

const Header: React.FC<HeaderProps> = ({ headerTitle }) => {
  const { mode } = useThemeMode();
  return (
    <View
      id="header"
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 5,
        marginTop: 24,
      }}
    >
      <View
        style={{
          alignSelf: "flex-start",
          marginHorizontal: 4,
          width: 36,
          height: 36,
          marginBottom: 12,
          borderRadius: 36,
          backgroundColor: mode === "dark" ? "#00173D" : "#FFFAEB",
        }}
      >
        <Pressable style={{ padding: 0 }} onPress={() => router.back()}>
          <FontAwesome6
            name="arrow-left"
            size={20}
            style={{ padding: 8 }}
            color={mode === "dark" ? "#FFFAEB" : "#051824"}
          />
        </Pressable>
      </View>
      <Text h4 style={{ flexGrow: 1, marginEnd: 36, textAlign: "center" }}>
        {headerTitle}
      </Text>
    </View>
  );
};

export default Header;
