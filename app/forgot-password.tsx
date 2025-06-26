import { Button, Input, Text }from "@rn-vui/themed";
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
      const redirectToUrl = "routinetrace://resetpassword"; // Determined deep linking URL
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
      <View style={{ alignSelf: "center", margin: 40 }}>
        <Text h3>Forgot Your Password?</Text>
        <View style={{ marginVertical: 60 }}>
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
          containerStyle={{ marginTop: 20 }}
        />
      </View>
    </Background>
  );
}
