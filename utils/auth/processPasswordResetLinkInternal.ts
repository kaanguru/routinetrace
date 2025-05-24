import { err, errAsync, ok, ResultAsync } from "neverthrow";
import { supabase } from "../supabase";

export default function processPasswordResetLinkInternal(
  urlParams: Readonly<{ token?: string; refreshToken?: string; type?: string }>,
  routerParams: Readonly<{
    token?: string;
    refreshToken?: string;
    type?: string;
  }>,
): ResultAsync<void, Error> {
  const finalToken = routerParams.token || urlParams.token;
  const finalRefreshToken = routerParams.refreshToken || urlParams.refreshToken;
  const finalType = routerParams.type || urlParams.type;

  if (finalToken && finalRefreshToken && finalType === "recovery") {
    return ResultAsync.fromPromise(
      supabase.auth.setSession({
        access_token: finalToken,
        refresh_token: finalRefreshToken,
      }),
      (e) =>
        new Error(
          `Unexpected error during session setup: ${(e as Error).message}`,
        ),
    ).andThen((sessionResponse) => {
      if (sessionResponse.error) {
        console.error("Error setting Supabase session:", sessionResponse.error);
        return err(
          new Error(`Failed to set session: ${sessionResponse.error.message}`),
        );
      }
      return ok(undefined);
    });
  }
  return errAsync(new Error("Invalid password reset link."));
}
