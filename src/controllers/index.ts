import { Controller, Get } from '@tsed/common';
import { logger } from '@/logging';

@Controller('/')
export class IndexController {
  @Get('/')
  public index() {
    logger.debug('accessing index uri');
    return { msg: 'hello', version: 'current' };
  }
}
