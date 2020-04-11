import * as dotenv from 'dotenv';
import { IModuleOptions } from '@tsed/di';
import { ConnectionOptions } from 'typeorm';
import * as Path from 'path';
import * as Definition from './definition';

export interface IConfig extends Partial<IModuleOptions> {
  app: string;
  port: number;
  podIp?: string;
  podName?: string;
}

function getEntities(dbName: string, dbType: string) {
  let tables: any[];
  if (dbType === 'mysql') {
    tables = Definition.modelMapping[dbName];
  }
  if (dbType === 'mongo') {
    tables = Definition.mongoModelMapping[dbName];
  }
  return tables || [];
}

function genMySqlConfig({ debug, host, port, username, password, dbs }: any): ConnectionOptions[] {
  if (process.env.MYSQL_DB && process.env.MYSQL_DB.length > 0) {
    return (dbs as string)
      .split(',')
      .filter(s => s.length > 0)
      .map(db => {
        const [name, alias] = db.split(':');
        return {
          name: `mysql-${name}`,
          type: 'mysql',
          host,
          port: parseInt(port || '3306', 10),
          username,
          password,
          database: alias || name,
          entities: getEntities(name, 'mysql'),
          logging: debug ? ['query', 'error'] : false
        };
      });
  } else {
    return [];
  }
}

function getMongoConfig({ debug, host, port, username, password, dbs }: any): ConnectionOptions[] {
  if (process.env.MONGO_DB && process.env.MONGO_DB.length > 0) {
    return (dbs as string)
      .split(',')
      .filter(s => s.length > 0)
      .map(db => {
        const [name, alias] = db.split(':');
        return {
          name: `mongo-${name}`,
          type: 'mongodb',
          host,
          port: parseInt(port || '27017', 10),
          username,
          password,
          database: alias || name,
          entities: getEntities(name, 'mongo'),
          authSource: 'admin',
          useNewUrlParser: true,
          useUnifiedTopology: true,
          logging: debug ? ['query', 'error'] : false
        };
      });
  } else {
    return [];
  }
}

export function NewConfig(): IConfig {
  // load .env
  dotenv.config();
  const debug = process.env.NODE_ENV !== 'production';
  const rootDir = Path.resolve(__dirname);
  let httpsPort: number | boolean | string = false;
  if (process.env.HTTPS_PORT) {
    httpsPort = process.env.HTTPS_PORT === 'false' ? false : process.env.HTTPS_PORT;
  }
  const mysqlTypeorm: ConnectionOptions[] = genMySqlConfig({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    debug,
    dbs: process.env.MYSQL_DB
  });
  const mongoTypeorm: ConnectionOptions[] = getMongoConfig({
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    debug,
    dbs: process.env.MONGO_DB
  });

  const app = process.env.APP_NAME || 'tsed-starter';
  const cfg: IConfig = {
    app,
    rootDir,
    acceptMimes: ['application/json'],
    mount: Definition.routes,
    componentsScan: [...Definition.middlewares, ...Definition.services, ...Definition.converters],
    typeorm: [...mysqlTypeorm, ...mongoTypeorm],
    debug,
    httpsPort,
    podIp: process.env.POD_IP, // for k8s
    podName: process.env.POD_NAME,
    port: Number.parseInt(process.env.PORT || '80', 10)
  };
  if (debug) {
    cfg.swagger = {
      path: '/api-docs'
    };
  }
  if (process.env.IGNORE_DBCONN === 'true') {
    cfg.typeorm = [];
  }
  cfg.logger = {
    debug,
    logRequest: debug,
    level: debug ? 'debug' : 'off', // disable default logger in prod
    requestFields: ['method', 'url', 'headers', 'query', 'params', 'duration'],
    disableRoutesSummary: false
  };
  if (debug && process.env.DISABLE_REQUEST_LOG === 'true') {
    cfg.logger.logRequest = false;
    cfg.logger.level = 'info';
  }
  return cfg;
}
