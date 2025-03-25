/* eslint-disable neverthrow/must-use-result */
import { ErrorInfo } from "react";
import { err, Result } from "neverthrow";
import reportError from "@/utils/reportError";

/**
 * Handles errors caught by React Error Boundaries.
 * Reports the error using the `reportError` utility.
 *
 * @param error - The error caught by the Error Boundary.
 * @param info - Extra error info provided by React.
 */

const handleErrorBoundaryError = (error: Error, info?: ErrorInfo) => {
  const errorResult: Result<never, Error> = err(error);
  reportError(errorResult);
};

export default handleErrorBoundaryError;
