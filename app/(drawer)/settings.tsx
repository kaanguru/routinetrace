import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useThemeMode,
  Dialog,
  Button,
  Text,
  Switch,
  Input,
} from "@rneui/themed";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import LogoPortrait from "@/components/lotties/LogoPortrait";
import { useSoundContext } from "@/context/SoundContext";
import { useResetCompletionHistory } from "@/hooks/useTaskCompletionHistory";
import useUser from "@/hooks/useUser";
import changeEmail from "@/utils/auth/changeEmail";

export default function SettingsScreen() {
  const { mode, setMode } = useThemeMode();
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: resetStats, isPending } = useResetCompletionHistory();
  const { isSoundEnabled, toggleSound } = useSoundContext();

  const { data: user } = useUser();
  const userEmail = user?.email;

  function handleReset() {
    resetStats(undefined, {
      onSuccess: () => setIsDialogOpen(false),
    });
  }

  const handleSubmit = async () => {
    console.log("🚀 ~ handleSubmit ~ newEmail:", newEmail);
    const result = await changeEmail(newEmail);
    result.match(
      () => {
        alert("Check your inbox to confirm your new email address.");
        setShowModal(false);
      },
      (error) => {
        console.log("🚀 ~ handleSubmit ~ error:", error);
        alert(`Failed to update email: ${error.message}`);
      }
    );
  };
  return (
    <View>
      <View
        id="theme-toggle"
        style={{ position: "absolute", top: -40, right: 1, zIndex: 1 }}
      >
        <Button
          onPress={(event) => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "light" ? (
            <FontAwesome6 name="moon" size={16} color="#FFFAEB" />
          ) : (
            <FontAwesome6 name="sun" size={16} color="#051824" />
          )}
        </Button>
      </View>
      <LogoPortrait scale={0.33} />
      <View>
        <Button onPress={() => router.push("/(tasks)/completed-tasks")}>
          <Ionicons name="checkmark-done-sharp" size={24} color="black" />
        </Button>
        <Button
          onPress={() => router.push("/(tasks)/tasks-of-yesterday")}
          title="Yesterday's"
          icon={<FontAwesome5 name="history" size={24} color="black" />}
        />
        <View>
          <Text> {userEmail}</Text>
          <Button onPress={() => setShowModal(true)}>
            <FontAwesome6 name="user-pen" size={16} color="black" />
          </Button>
        </View>
        <Dialog
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
          overlayStyle={{ backgroundColor: "white" }}
        >
          <Dialog.Title
            title="Need to use a different email address?"
            titleStyle={{ color: "black", fontWeight: "bold" }}
          />
          <Text>enter your new email address</Text>
          <Input
            placeholder="Enter your new email address"
            value={newEmail}
            onChangeText={setNewEmail}
          />
          <Dialog.Actions>
            <Button
              title="Cancel"
              onPress={() => setShowModal(false)}
              buttonStyle={{
                backgroundColor: "transparent",
                borderColor: "black",
                borderWidth: 1,
              }}
              titleStyle={{ color: "black" }}
              size="sm"
            />
            <Button
              size="sm"
              title="Submit"
              onPress={handleSubmit}
              buttonStyle={{ backgroundColor: "#ff006e" }}
              titleStyle={{ color: "white" }}
            />
          </Dialog.Actions>
        </Dialog>
        <Button
          onPress={() => setIsDialogOpen(true)}
          disabled={isPending}
          title="Reset Statistics"
          icon={<Ionicons name="trash-bin" size={16} color="white" />}
        />
      </View>

      <Dialog
        isVisible={isDialogOpen}
        onBackdropPress={() => setIsDialogOpen(false)}
        overlayStyle={{ backgroundColor: "white" }}
      >
        <Dialog.Title
          title="Are you sure you want to Reset History?"
          titleStyle={{ color: "black", fontWeight: "bold" }}
        />
        <Text>
          This will permanently delete all task completion history and reset
          statistics. This action cannot be undone.
        </Text>
        <Dialog.Actions>
          <Button
            size="sm"
            title="Cancel"
            onPress={() => setIsDialogOpen(false)}
            buttonStyle={{
              backgroundColor: "transparent",
              borderColor: "black",
              borderWidth: 1,
            }}
            titleStyle={{ color: "black" }}
          />
          <Button
            size="sm"
            title="Confirm"
            onPress={handleReset}
            buttonStyle={{ backgroundColor: "#ff006e" }}
            titleStyle={{ color: "white" }}
          />
        </Dialog.Actions>
      </Dialog>
      <View>
        <View>
          {isSoundEnabled ? (
            <FontAwesome6
              name="volume-high"
              size={24}
              color={mode === "light" ? "#8AC926" : "#ff006e"}
            />
          ) : (
            <FontAwesome6
              name="volume-xmark"
              size={24}
              color={mode === "light" ? "#8AC926" : "#ff006e"}
            />
          )}

          <Text>{isSoundEnabled ? "Enabled" : "Disabled"}</Text>
        </View>
        <Switch
          value={isSoundEnabled}
          onValueChange={toggleSound}
          trackColor={{ true: "#4F10A8", false: "#E5E7EB" }}
          thumbColor="#FFCA3A"
        />
      </View>
    </View>
  );
}
