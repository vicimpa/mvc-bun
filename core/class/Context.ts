import { Server } from "bun";

export type TBody = ConstructorParameters<typeof Response>[0] | object | number;

export class Context {
  #request: Request;
  #server: Server;
  #url: URL;

  next!: () => Promise<any>;

  get server() { return this.#server; }
  get serv() { return this.#server; }
  get req() { return this.#request; }
  get request() { return this.#request; }

  get url() { return this.#url.pathname; }
  get method() { return this.#request.method; }
  get reqestHeaders() { return this.#request.headers; }

  statusCode = 200;
  statusMessage = 'Success';

  headers = new Headers();
  body: TBody = 'Empty';

  constructor(request: Request, server: Server) {
    this.#request = request;
    this.#server = server;
    this.#url = new URL(request.url);
  }
}