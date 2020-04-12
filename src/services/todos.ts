import { logger } from '@/logging';
import { Todo } from '@/models/todos';
import { Service } from '@tsed/common';
import { TypeORMService } from '@tsed/typeorm';
import { Connection, FindManyOptions } from 'typeorm';

@Service()
export class TodoService {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  public $afterRoutesInit() {
    this.connection = this.typeORMService.get('mysql-todo_service');
  }

  public async lookup(id: number): Promise<Todo> {
    const todo: Todo = await this.connection.getRepository(Todo).findOne(id);
    return todo;
  }

  public async list(isFinished?: boolean): Promise<Todo[]> {
    const opts: FindManyOptions = {};
    if (isFinished !== undefined) {
      opts.where = [{ finished: isFinished }];
    }
    const result: Todo[] = await this.connection.getRepository(Todo).find(opts);
    return result;
  }

  public async create(todo: Todo): Promise<Todo> {
    await this.connection.getRepository(Todo).save(todo);
    return todo;
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.connection.getRepository(Todo).delete(id);
    return !!result.affected;
  }

  public async finish(id: number, isFinished: boolean = true): Promise<boolean> {
    const result = await this.connection.getRepository(Todo).update(id, { finished: isFinished });
    return !!result.affected;
  }

  public async update(todo: Todo): Promise<Todo> {
    todo = await this.connection.getRepository(Todo).save(todo);
    return todo;
  }
}
