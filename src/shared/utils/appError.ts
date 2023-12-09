import HTTP_STATUS from 'http-status-codes';
import { ZodIssue } from 'zod';

export interface AppErrorResponse {
  message: string;
  statusCode: number;
  status: string;

  serializeErrors(): AppError;
}

interface ErrorItem {
  code: string;
  path: (string | number)[];
  message: string;
}

export interface AppError {
  message: string;
  statusCode: number;
  status: string;
  errors: ErrorItem[];
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  private readonly errors: ErrorItem[];

  protected constructor(message: string, errors?: ErrorItem[]) {
    super(message);
    this.errors = errors ?? [];
  }

  serializeErrors(): AppError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      errors: this.errors,
    };
  }
}

export class ZodRequestValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string, issues: ZodIssue[]) {
    super(message, issues);
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';

  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
