import { Button, Input, Text } from "@rneui/themed";
import { View, Alert } from "react-native";
import { useForm } from "@tanstack/react-form";
import userSchema from "@/schemas/userSchema";
import FormFieldInfo from "@/components/FormFieldInfo";
import Background from "@/components/Background";
import { useAuth } from "@/context/AuthenticationProvider";

export default function ForgotPassword() {
  const { resetPasswordMutation } = useAuth();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: userSchema.pick({ email: true }),
    },
    onSubmit: async ({ value }) => {
      const redirectToUrl = "com.cemkaan.rt://reset-password"; // Determined deep linking URL
      await resetPasswordMutation.mutateAsync({
        email: value.email,
        redirectTo: redirectToUrl,
      });

      // Display generic message regardless of success or failure for security
      Alert.alert(
        "Password Reset Process Initiated",
        "If an account with that email exists, you will receive a password reset link.",
      );
    },
  });

  return (
    <Background>
      <Text
        style={{
          marginHorizontal: "auto",
          fontFamily: "Ubuntu_400Regular",
          fontSize: 24,
          paddingHorizontal: 40,
          textAlign: "center",
          color: "#3E0C83",
          marginBottom: 20,
        }}
      >
        Forgot Your Password?
      </Text>
      <View style={{ width: "80%" }}>
        <form.Field name="email" asyncDebounceMs={300}>
          {(field) => (
            <>
              <Input
                placeholder="Enter your email"
                keyboardType="email-address"
                value={field.state.value != null ? field.state.value : ""}
                onBlur={field.handleBlur}
                onChangeText={(text) => field.handleChange(text)}
                autoCapitalize="none"
              />
              <FormFieldInfo field={field} />
            </>
          )}
        </form.Field>
      </View>
      <Button
        disabled={resetPasswordMutation.isPending}
        onPress={() => form.handleSubmit()}
        title="Send Reset Email"
        containerStyle={{ width: "80%", marginTop: 20 }}
      />
    </Background>
  );
}
