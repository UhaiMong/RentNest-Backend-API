import { ZodError } from "zod";
import httpStatus from "http-status";
export const getErrorStatusCode = (error: unknown) => {
  if (error instanceof ZodError) return httpStatus.BAD_REQUEST;

  if (
    error instanceof Error &&
    "statusCode" in error &&
    typeof (error as any).statusCode === "number"
  ) {
    return (error as any).statusCode;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (
      message.includes("duplicate") ||
      message.includes("already exists") ||
      message.includes("email")
    ) {
      return httpStatus.CONFLICT;
    }
    if (message.includes("not found")) {
      return httpStatus.NOT_FOUND;
    }
  }

  return httpStatus.INTERNAL_SERVER_ERROR;
};
