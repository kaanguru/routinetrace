import { supabase } from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { err, ok, ResultAsync } from "neverthrow";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

const useResetPasswordMutation = () => {
  return useMutation<ResultAsync<void, Error>, Error, ResetPasswordFormData>({
    mutationFn: async (
      data: ResetPasswordFormData,
    ): Promise<ResultAsync<void, Error>> => {
      if (data.password !== data.confirmPassword) {
        return err(new Error("Passwords do not match."));
      }
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        return err(error);
      }

      return ok(undefined);
    },
    onSuccess: async (result) => {
      console.log("🚀 ~ useResetPasswordMutation ");
      if ((await result).isOk()) {
        console.log(
          "Password reset successful. Signing out and navigating to login.",
        );
        await supabase.auth.signOut();
        router.replace("/login");
      }
    },
    onError: (error) => {
      console.error("Password reset error:", error);
    },
  });
};
export { useResetPasswordMutation };
