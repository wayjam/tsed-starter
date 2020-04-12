import {
  Controller,
  PathParams,
  BodyParams,
  Post,
  Delete,
  Put,
  Get,
  Status,
  Res,
  QueryParams
} from '@tsed/common';
import { Summary, Description, Returns, ReturnsArray } from '@tsed/swagger';
import { Todo } from '@/models/todos';
import { TodoService } from '@/services/todos';
import { NotFound } from 'ts-httpexceptions';
@Controller({
  path: '/todos',
  children: []
})
export class TodosCtrl {
  constructor(private todoSvc: TodoService) {}

  @Get('/')
  @Status(200)
  @Summary('Listing todos')
  @Description('Listing todos with specify parameters')
  @ReturnsArray(Todo)
  public async list(
    @Res() res: Res,
    @QueryParams('is_finished') isFinished: boolean
  ): Promise<Todo[]> {
    const result = await this.todoSvc.list(isFinished);
    res.setHeader('X-Total', result.length);
    return result;
  }

  @Get('/:id')
  @Status(200)
  @Summary('Get a todo')
  @Returns(Todo)
  public async get(@PathParams('id') id: number): Promise<Todo> {
    const todo = await this.todoSvc.lookup(id);
    if (todo) {
      return todo;
    }
    throw new NotFound('Todo not found');
  }

  @Post('/')
  @Status(201)
  @Summary('Create a todo')
  public async create(@BodyParams('content') content: string): Promise<Todo> {
    const todo: Todo = new Todo();
    todo.content = content;
    todo.finished = false;
    todo.time = new Date();
    await this.todoSvc.create(todo);
    return todo;
  }

  @Put('/:id')
  @Status(200)
  @Summary('Update a todo')
  public async update(
    @PathParams('id') id: number,
    @BodyParams('content') content: string,
    @BodyParams('finished') finished: boolean
  ) {
    const todo: Todo = await this.todoSvc.lookup(id);
    todo.content = content;
    todo.finished = finished;
    await this.todoSvc.update(todo);
  }

  @Delete('/:id')
  @Status(204)
  @Summary('Delete a todo')
  public async remove(@PathParams('id') id: number) {
    await this.todoSvc.delete(id);
  }
}
