// Operational application error carrying an HTTP status + machine code.
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(400, 'bad_request', message, details);
  }
  static notFound(message: string, details?: unknown) {
    return new AppError(404, 'not_found', message, details);
  }
  static conflict(message: string, details?: unknown) {
    return new AppError(409, 'conflict', message, details);
  }
  static internal(message = 'Internal server error', details?: unknown) {
    return new AppError(500, 'internal_error', message, details);
  }
}
