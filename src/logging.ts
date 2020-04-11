import { Logger, BaseLayout, LogEvent, Layout } from 'ts-log-debug';
import * as Util from 'util';
import { IConfig } from './config';

@Layout({ name: 'customJson' })
export class JsonLayout extends BaseLayout {
  public transform(loggingEvent: LogEvent, timezoneOffset?: number): string {
    const log = {
      time: loggingEvent.startTime,
      level: loggingEvent.level.toString(),
      message: (Util.format as any)(...[].concat(loggingEvent.data as any)),
      context: loggingEvent.context
    };

    return JSON.stringify(log) + (this.config.separator || '');
  }
}

const logger: Logger = new Logger('common');

export function setupLogger(l: Logger, config: IConfig) {
  l.appenders.set('stdout', {
    type: 'stdout',
    layout: { type: 'customJson', separator: ',' }
  });
  l.level = config.debug ? 'all' : 'info';
}

export { logger };
