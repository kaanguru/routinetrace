// import * as Sentry from "@sentry/react-native";
import { Result, ResultAsync } from "neverthrow";
/**
 * Reports errors from a `Result` or `ResultAsync` instance to Sentry and logs them.
 * Preserves the original Result structure for further processing.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error.
 * @param {Result<T, E> | ResultAsync<T, E>} result - The Result or ResultAsync to inspect.
 * @returns {Result<T, E> | ResultAsync<T, E>} The original Result or ResultAsync after error handling.
 */

// Overload signature for synchronous Result
export function reportError<T, E>(result: Result<T, E>): Result<T, E>;
// Overload signature for asynchronous ResultAsync
export function reportError<T, E>(result: ResultAsync<T, E>): ResultAsync<T, E>;
export default function reportError<T, E>(
  result: Result<T, E> | ResultAsync<T, E>
): Result<T, E> | ResultAsync<T, E> {
  if (result instanceof ResultAsync) {
    // Handle ResultAsync by mapping the error
    return result.mapErr((error) => {
      handleError(error);
      return error;
    });
  } else {
    if (result.isErr()) {
      handleError(result.error);
    }
    return result;
  }
}

function handleError<E>(error: E): void {
  /*   if (error instanceof Error) {
    Sentry.captureException(error);
  } else {
    const errorObj = new Error(String(error));
    Sentry.captureException(errorObj, { extra: { originalError: error } });
  } */
  console.error("Error ❌❌❌:", error);
}
