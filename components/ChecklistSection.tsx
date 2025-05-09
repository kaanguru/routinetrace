import { View } from "react-native";

export default function ChecklistSection({
  children,
  ListHeaderComponent,
}: Readonly<{
  children: React.ReactNode;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}>) {
  return (
    <View style={{ width: "100%", marginVertical: 20 }}>
      {ListHeaderComponent &&
        (typeof ListHeaderComponent === "function" ? (
          <ListHeaderComponent />
        ) : (
          ListHeaderComponent
        ))}
      {children}
    </View>
  );
}
