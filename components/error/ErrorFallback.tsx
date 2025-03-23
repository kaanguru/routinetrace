import { View, Text } from "react-native";

/**
 * Fallback component to render when a critical error occurs.
 *
 * @param {object} props - The component props.
 * @param {Error} props.error - The error object to display the message from.
 */
export default function ErrorFallback({ error }: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "#FF0010" }}>
        ❌ Critical Error: {error.message}
      </Text>
    </View>
  );
}
