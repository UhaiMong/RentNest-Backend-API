// utils/ApiError.ts
export class ApiError extends Error {
  statusCode: number;
  errors?: any;

  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors || null,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    };
  }
}
