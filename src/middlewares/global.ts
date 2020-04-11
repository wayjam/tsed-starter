import { Err, Req, Res, GlobalErrorHandlerMiddleware, OverrideProvider } from '@tsed/common';
import { Constant } from '@tsed/di';
import { Exception } from 'ts-httpexceptions';
import { logger } from '@/logging';
import { ErrorResponse } from '@/models/errors';

@OverrideProvider(GlobalErrorHandlerMiddleware)
export class MyErrorHandler extends GlobalErrorHandlerMiddleware {
  @Constant('custom.errors.headerName', 'X-ERRORS')
  protected headerName: string;

  public use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
    const requestLogger = request.ctx.logger;
    if (error instanceof Exception || error.status) {
      requestLogger.error({
        error: {
          message: error.message,
          status: error.status,
          origin: error.origin
        }
      });
      logger.error(error.stack);
      this.setHeaders(response, error, error.origin);

      response.status(error.status).send(
        new ErrorResponse({
          status: error.status,
          code: error.name || error.type,
          message: error.message
        })
      );

      return;
    }

    if (typeof error === 'string') {
      response.status(404).send(
        new ErrorResponse({
          status: 404,
          code: 'NOT_FOUND'
        })
      );
      return;
    }

    requestLogger.error({
      error: {
        status: 500,
        message: error.message,
        origin: error.origin
      }
    });
    logger.error(error.stack);
    this.setHeaders(response, error, error.origin);

    response.status(error.status || 500).send(
      new ErrorResponse({
        status: 500,
        code: 'INETRNAL_ERROR',
        message: error.message
      })
    );

    return;
  }
}
