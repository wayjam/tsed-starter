/*
 * Definition of Service
 * let the framework can load
 */
// deps import here
import { EntitySchema } from 'typeorm';
// definition import below
import { Todo } from '@/models/todos';

// Define routes
const routes = {
  '/v1': '${rootDir}/controllers/v1/**/*.ts',
  '/': '${rootDir}/controllers/*.ts'
};

// Define middlewares
const middlewares = ['${rootDir}/middlewares/*.ts'];

// Define servies
const services = ['${rootDir}/services/**/*.ts'];

// Define converters
const converters = ['${rootDir}/converters/**/*.ts'];

// Define Model & DB relationship
// for model store in different database
// Example:
// {
//     'post_service': [
//         Post, Category
//     ],
//     'auth_service': [
//         User, Role
//     ]
// }
interface IModelDBMapping {
  // tslint:disable-next-line
  [dbName: string]: Array<Function | string | EntitySchema<any>>;
}

const modelMapping: IModelDBMapping = {
  todo_service: [Todo]
};

const mongoModelMapping: IModelDBMapping = {};

export { routes, middlewares, services, converters, modelMapping, mongoModelMapping };
