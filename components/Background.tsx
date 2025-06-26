import { makeStyles }from "@rn-vui/themed";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface BackgroundProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Background = ({ children, style }: Readonly<BackgroundProps>) => {
  const styles = useStyles();
  return (
    <SafeAreaView style={style ? [style, styles.container] : styles.container}>
      {children}
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 1,
  },
}));
export default Background;
