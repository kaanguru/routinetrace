import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  Dialog,
  Input,
  Switch,
  Text,
  useThemeMode,
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
      },
    );
  };
  return (
    <View style={{ padding: 16 }}>
      <View
        id="theme-toggle"
        style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
      >
        <Button
          onPress={(event) => setMode(mode === "light" ? "dark" : "light")}
          buttonStyle={{
            backgroundColor: "#FF006E",
            width: 40,
            height: 40,
          }}
        >
          {mode === "light" ? (
            <FontAwesome6 name="moon" size={16} color="#FFFAEB" />
          ) : (
            <FontAwesome6 name="sun" size={16} color="#FFFAEB" />
          )}
        </Button>
      </View>
      <LogoPortrait scale={0.33} />
      <View style={{ width: "100%", marginTop: 10 }}>
        <Button
          containerStyle={{ marginBottom: 10 }}
          buttonStyle={{
            borderRadius: 10,
            backgroundColor: "#FFEFC2",
            height: 50,
            paddingHorizontal: 15,
          }}
          onPress={() => router.push("/(tasks)/completed-tasks")}
        >
          <Ionicons name="checkmark-done-sharp" size={24} color="#00173D" />
          <Text>Completed Tasks </Text>
        </Button>
        <Button
          containerStyle={{ marginBottom: 10 }}
          buttonStyle={{
            borderRadius: 10,
            backgroundColor: "#FFEFC2",
            height: 50,
            paddingHorizontal: 15,
          }}
          onPress={() => router.push("/(tasks)/tasks-of-yesterday")}
          title="Yesterday's"
          titleStyle={{ color: "#00173D", marginLeft: 10, fontSize: 16 }}
          icon={<FontAwesome5 name="history" size={24} color="#4F10A8" />}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 15,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 16, color: "#00173D" }}>{userEmail}</Text>
          <Button type="clear" size="sm" onPress={() => setShowModal(true)}>
            <FontAwesome6 name="user-pen" size={16} color="#4F10A8" />
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
          containerStyle={{ marginBottom: 10 }}
          buttonStyle={{
            backgroundColor: "#FF006E",
            height: 50,
            paddingHorizontal: 15,
          }}
          onPress={() => setIsDialogOpen(true)}
          disabled={isPending}
          title="Reset Statistics"
          titleStyle={{ color: "#FFFAEB", marginLeft: 10, fontSize: 16 }}
          icon={<Ionicons name="trash-bin" size={16} color="#FFFAEB" />}
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
          padding: 15,
          borderWidth: 0,
          backgroundColor: "#FFEFC2",
          borderRadius: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {isSoundEnabled ? (
            <FontAwesome6 name="volume-high" size={24} color="#4F10A8" />
          ) : (
            <FontAwesome6 name="volume-xmark" size={24} color="#4F10A8" />
          )}

          <Text style={{ fontSize: 16, color: "#00173D" }}>
            {isSoundEnabled ? "Enabled" : "Disabled"}
          </Text>
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
