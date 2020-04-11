// @ts-ignore
import * as moduleAlias from 'module-alias';
moduleAlias.addAlias('@', __dirname + '');

import { Application } from './app';
import { logger } from './logging';

const app = new Application();
app.start().catch((err: any) => {
  logger.error(err);
  process.exit(1);
});
