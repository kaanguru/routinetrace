import { err, ok, Result } from "neverthrow";

export default function parseUrlParams(
  url: string | null,
): Result<
  Readonly<{ token?: string; refreshToken?: string; type?: string }>,
  Error
> {
  if (!url) {
    return ok({}); // No URL, no params from URL
  }
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hash) {
      const fragmentParams = new URLSearchParams(parsedUrl.hash.substring(1));
      const token = fragmentParams.get("access_token") || undefined;
      const refreshToken = fragmentParams.get("refresh_token") || undefined;
      const type = fragmentParams.get("type") || undefined;
      return ok({ token, refreshToken, type });
    }
    return ok({}); // URL has no hash, no params from hash
  } catch (e) {
    console.error("Error parsing deep link URL:", e);
    return err(new Error("Error parsing deep link URL."));
  }
}
