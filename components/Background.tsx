import { makeStyles } from "@rneui/themed";
import { View } from "react-native";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import React from "react";

interface BackgroundProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Background = ({ children, style }: Readonly<BackgroundProps>) => {
  const styles = useStyles();
  return <View style={style ? [style, styles.container] : styles.container}>{children}</View>;
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 0,
    // paddingVertical: theme.spacing.sm,
    // marginHorizontal: theme.spacing.md,
  },
}));
export default Background;
