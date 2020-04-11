import express from 'express';
import { logger, setupLogger } from '@/logging';
import { GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings } from '@tsed/common';
import { NewConfig } from './config';
import '@tsed/typeorm';
if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line:no-var-requires
  require('@tsed/swagger');
}

const config = NewConfig();

@ServerSettings(config)
export class Application extends ServerLoader {
  protected $beforeInit() {
    this.expressApp.set('config', config);
    setupLogger(logger, config);
  }

  protected $beforeRoutesInit(): void | Promise<any> {
    this.use(GlobalAcceptMimesMiddleware)
      .use(express.json({ limit: '50mb' }))
      .use(express.urlencoded({ extended: false, limit: '50mb' }));
    return null;
  }

  protected $onReady() {
    logger.info('Server initialized');
  }

  protected $onServerInitError(error: any): any {
    logger.error('Server encounter an error =>', error);
  }
}
