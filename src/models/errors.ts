import { Exception } from 'ts-httpexceptions';

interface IHeaders {
  [key: string]: any;
}

interface IErrorResponse {
  status: number | string;
  code: string;
  message?: string;
}

type IErrors = string[] | string;

export class CustomException extends Exception {
  public headers: IHeaders;
  public errors: IErrors;

  constructor(status?: number, message?: string, extra?: { headers?: IHeaders; errors: IErrors }) {
    super(status, message);
    this.headers = extra.headers;
    this.errors = extra.errors;
  }
}

export class ErrorResponse {
  private status: number | string;
  private code: string;
  private message?: string;

  constructor({ status, code, message }: IErrorResponse) {
    this.status = status;
    this.code = code || status.toString();
    this.message = message;
  }

  public toJSON(): IErrorResponse {
    return {
      status: this.status,
      code: this.code,
      message: this.message
    };
  }

  public toString() {
    return JSON.stringify(this.toJSON());
  }
}
