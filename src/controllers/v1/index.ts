import { Controller, Get } from '@tsed/common';

@Controller('/')
export class IndexController {
  @Get('/')
  public index() {
    return { msg: 'hello', version: 'v1' };
  }
}
