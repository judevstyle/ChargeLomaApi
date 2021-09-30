import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const messageResponse = exception.getResponse() as any;
    
    response
      .status(status)
      .json({
        statusCode: status,
        data:null,
        success: false,
        message: messageResponse?.message?messageResponse?.message:exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}