import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  Dialog,
  Input,
  Switch,
  Text,
  useTheme,
  useThemeMode,
}from "@rn-vui/themed";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import Background from "@/components/Background";
import { useSoundContext } from "@/context/SoundContext";
import { useResetCompletionHistory } from "@/hooks/useTaskCompletionHistory";
import useUser from "@/hooks/useUser";
import changeEmail from "@/utils/auth/changeEmail";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isResetDialogVisible, setResetDialogVisible] = useState(false);

  const { mutate: resetStats, isPending: isResetting } =
    useResetCompletionHistory();
  const { isSoundEnabled, toggleSound } = useSoundContext();
  const { data: user } = useUser();

  const handleResetStats = () => {
    resetStats(undefined, {
      onSuccess: () => setResetDialogVisible(false),
    });
  };

  const handleChangeEmail = async () => {
    const result = await changeEmail(newEmail);
    result.match(
      () => {
        alert("Check your inbox to confirm your new email address.");
        setShowEmailModal(false);
        setNewEmail("");
      },
      (error) => {
        alert(`Failed to update email: ${error.message}`);
      },
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    section: {
      marginBottom: 24,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.greyOutline,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "DelaGothicOne_400Regular",
      color: theme.colors.primary,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    rowLabel: {
      fontSize: 16,
      color: theme.colors.black,
      fontFamily: "Ubuntu_500Medium",
    },
    emailText: {
      fontSize: 16,
      color: theme.colors.grey3,
      fontFamily: "UbuntuMono_400Regular",
    },
    // --- Unified Button Styles ---
    baseButtonContainer: {
      borderRadius: 12,
      borderWidth: 2,
      marginVertical: 6,
    },
    baseButtonStyle: {
      borderRadius: 9, // Inner radius
    },
    // --- Navigation Button ---
    navButtonContainer: {
      borderColor: theme.colors.greyOutline,
    },
    navButtonStyle: {
      backgroundColor: theme.colors.grey5,
      justifyContent: "flex-start",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    navButtonTitle: {
      color: theme.colors.black,
      fontFamily: "Ubuntu_700Bold",
      marginLeft: 16,
      fontSize: 16,
    },
    // --- Primary Action Button (Theme) ---
    primaryButtonContainer: {
      borderColor: theme.colors.primary,
    },
    primaryButtonStyle: {
      backgroundColor: theme.colors.primary,
    },
    // --- Warning Action Button (Reset) ---
    warningButtonContainer: {
      borderColor: theme.colors.warning,
    },
    warningButtonStyle: {
      backgroundColor: theme.colors.warning,
    },
    // --- Shared Title Style for Action Buttons ---
    actionButtonTitle: {
      color: theme.colors.white,
      fontFamily: "Ubuntu_700Bold",
      marginLeft: 8,
    },
    // --- Dialog & Divider Styles ---
    dialogOverlay: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    dialogTitle: {
      color: theme.colors.black,
      fontFamily: "DelaGothicOne_400Regular",
    },
    dialogText: {
      color: theme.colors.grey3,
      marginBottom: 10,
    },
    dialogButton: {
      borderRadius: 8,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.greyOutline,
      marginVertical: 8,
    },
  });

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <Background>
      <ScrollView style={styles.container}>
        {/* Account Section */}
        <View style={styles.section}>
          {renderSectionHeader("Account")}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.emailText}>{user?.email}</Text>
              <Button
                type="clear"
                size="sm"
                onPress={() => setShowEmailModal(true)}
                icon={
                  <FontAwesome6
                    name="user-pen"
                    size={16}
                    color={theme.colors.primary}
                  />
                }
              />
            </View>
          </View>
        </View>

        {/* Navigation Section */}
        <View style={styles.section}>
          {renderSectionHeader("Navigation")}
          <Button
            onPress={() => router.push("/(tasks)/completed-tasks")}
            containerStyle={[
              styles.baseButtonContainer,
              styles.navButtonContainer,
            ]}
            buttonStyle={[styles.baseButtonStyle, styles.navButtonStyle]}
            titleStyle={styles.navButtonTitle}
            icon={
              <Ionicons
                name="checkmark-done-sharp"
                size={22}
                color={theme.colors.success}
              />
            }
            title="Completed Tasks"
          />
          <Button
            onPress={() => router.push("/(tasks)/tasks-of-yesterday")}
            containerStyle={[
              styles.baseButtonContainer,
              styles.navButtonContainer,
            ]}
            buttonStyle={[styles.baseButtonStyle, styles.navButtonStyle]}
            titleStyle={styles.navButtonTitle}
            icon={
              <FontAwesome5
                name="history"
                size={20}
                color={theme.colors.secondary}
              />
            }
            title="Yesterday's Tasks"
          />
        </View>

        {/* Application Settings Section */}
        <View style={styles.section}>
          {renderSectionHeader("Application Settings")}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Theme</Text>
            <Button
              onPress={() => setMode(mode === "light" ? "dark" : "light")}
              title={mode === "light" ? "Switch to Dark" : "Switch to Light"}
              icon={
                mode === "light" ? (
                  <FontAwesome6
                    name="moon"
                    size={16}
                    color={theme.colors.white}
                  />
                ) : (
                  <FontAwesome6
                    name="sun"
                    size={16}
                    color={theme.colors.white}
                  />
                )
              }
              containerStyle={[
                styles.baseButtonContainer,
                styles.primaryButtonContainer,
              ]}
              buttonStyle={[styles.baseButtonStyle, styles.primaryButtonStyle]}
              titleStyle={styles.actionButtonTitle}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <FontAwesome6
                name={isSoundEnabled ? "volume-high" : "volume-xmark"}
                size={22}
                color={theme.colors.secondary}
              />
              <Text style={styles.rowLabel}>Sound Effects</Text>
            </View>
            <Switch
              value={isSoundEnabled}
              onValueChange={toggleSound}
              trackColor={{
                true: theme.colors.primary,
                false: theme.colors.grey4,
              }}
              thumbColor={theme.colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Statistics</Text>
            <Button
              onPress={() => setResetDialogVisible(true)}
              disabled={isResetting}
              loading={isResetting}
              title="Reset"
              icon={
                <Ionicons
                  name="trash-bin"
                  size={16}
                  color={theme.colors.white}
                />
              }
              containerStyle={[
                styles.baseButtonContainer,
                styles.warningButtonContainer,
              ]}
              buttonStyle={[styles.baseButtonStyle, styles.warningButtonStyle]}
              titleStyle={styles.actionButtonTitle}
            />
          </View>
        </View>

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Change Email Dialog */}
      <Dialog
        isVisible={showEmailModal}
        onBackdropPress={() => setShowEmailModal(false)}
        overlayStyle={styles.dialogOverlay}
      >
        <Dialog.Title
          title="Update Email Address"
          titleStyle={styles.dialogTitle}
        />
        <Text style={styles.dialogText}>
          Enter your new email address below. A confirmation link will be sent.
        </Text>
        <Input
          placeholder="new.email@example.com"
          value={newEmail}
          onChangeText={setNewEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Dialog.Actions>
          <Button
            title="Cancel"
            type="outline"
            onPress={() => setShowEmailModal(false)}
            buttonStyle={styles.dialogButton}
          />
          <Button
            title="Submit"
            onPress={handleChangeEmail}
            buttonStyle={styles.dialogButton}
          />
        </Dialog.Actions>
      </Dialog>

      {/* Reset Statistics Dialog */}
      <Dialog
        isVisible={isResetDialogVisible}
        onBackdropPress={() => setResetDialogVisible(false)}
        overlayStyle={styles.dialogOverlay}
      >
        <Dialog.Title
          title="Reset All Statistics?"
          titleStyle={styles.dialogTitle}
        />
        <Text style={styles.dialogText}>
          This will permanently delete all task completion history. This action
          cannot be undone.
        </Text>
        <Dialog.Actions>
          <Button
            title="Cancel"
            type="outline"
            onPress={() => setResetDialogVisible(false)}
            buttonStyle={styles.dialogButton}
          />
          <Button
            title="Confirm Reset"
            onPress={handleResetStats}
            loading={isResetting}
            buttonStyle={[
              styles.dialogButton,
              { backgroundColor: theme.colors.warning },
            ]}
          />
        </Dialog.Actions>
      </Dialog>
    </Background>
  );
}
