import { Default } from '@tsed/common';

export class CommonPayLoad {
  @Default(0)
  public page: number = 1;

  @Default(15)
  public pageSize: number = 15;
}

export interface ICommonResponse {
  data: any;
}

export interface IErrorResponse {
  msg: string;
  code: number;
}
