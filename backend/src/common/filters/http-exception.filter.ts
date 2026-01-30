import { Request, Response } from 'express';

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { ErrorsResponse } from '../responses/errors.response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error | HttpException, host: ArgumentsHost): Response {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: HttpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorMessage = this.extractMessage(exception);

    const errors = this.extractErrors(exceptionResponse);

    const responseBody: ErrorsResponse = {
      error: errorMessage,
      status,
      path: request.url,
      details: errors,
    };

    return response.status(status).json(responseBody);
  }

  private extractMessage(exception: Error | HttpException): string {
    return exception.constructor.name.replace('Exception', '');
  }

  private extractErrors(response: string | object): ErrorsResponse['details'] {
    if (typeof response === 'object' && 'details' in response) {
      return response.details as ErrorsResponse['details'];
    }

    let message: string;
    if (typeof response === 'object' && 'message' in response) {
      message = response.message as string;
    } else {
      message = response as string;
    }

    return [{ property: null, errors: [message] }];
  }
}
