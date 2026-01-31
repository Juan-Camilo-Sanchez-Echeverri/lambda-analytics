import type { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

import { QueryFailedError } from 'typeorm';

import { ErrorsResponse } from '../responses/errors.response';

interface PostgresError {
  code: string;
  detail?: string;
  constraint?: string;
  column?: string;
  table?: string;
}

const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
} as const;

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const pgError = exception.driverError as unknown as PostgresError;

    const { status, message, property } = this.parseError(pgError);

    const responseBody: ErrorsResponse = {
      error: 'DatabaseError',
      status,
      path: request.url,
      details: [{ property, errors: [message] }],
    };

    return response.status(status).json(responseBody);
  }

  private parseError(error: PostgresError): {
    status: HttpStatus;
    message: string;
    property: string | null;
  } {
    switch (error.code) {
      case PG_ERROR_CODES.UNIQUE_VIOLATION:
        return {
          status: HttpStatus.CONFLICT,
          message: this.parseUniqueViolation(error),
          property: this.extractFieldFromDetail(error.detail),
        };

      case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: this.parseForeignKeyViolation(error),
          property: this.extractFieldFromDetail(error.detail),
        };

      case PG_ERROR_CODES.NOT_NULL_VIOLATION:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Field '${error.column}' is required`,
          property: error.column ?? null,
        };

      case PG_ERROR_CODES.CHECK_VIOLATION:
        return {
          status: HttpStatus.BAD_REQUEST,
          message: `Invalid value for constraint '${error.constraint}'`,
          property: null,
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error',
          property: null,
        };
    }
  }

  private parseUniqueViolation(error: PostgresError): string {
    const field = this.extractFieldFromDetail(error.detail);
    const value = this.extractValueFromDetail(error.detail);

    if (field && value) {
      return `A record with ${field} '${value}' already exists`;
    }

    if (field) {
      return `The value of '${field}' is already in use`;
    }

    return 'A record with this data already exists';
  }

  private parseForeignKeyViolation(error: PostgresError): string {
    const field = this.extractFieldFromDetail(error.detail);

    if (error.detail?.includes('is not present')) {
      return `The referenced ${field ?? 'record'} does not exist`;
    }

    if (error.detail?.includes('is still referenced')) {
      return `Cannot delete because it has associated records`;
    }

    return 'Database reference error';
  }

  private extractFieldFromDetail(detail?: string): string | null {
    if (!detail) return null;

    const match = detail.match(/Key \((\w+)\)=/);
    return match ? match[1] : null;
  }

  private extractValueFromDetail(detail?: string): string | null {
    if (!detail) return null;

    const match = detail.match(/Key \(\w+\)=\(([^)]+)\)/);
    return match ? match[1] : null;
  }
}
