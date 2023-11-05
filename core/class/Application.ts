import { makeResponse } from "core/utils/makeResponse";
import { runHttpMiddleware, THttpMiddleware, TResult } from "core/utils/runHttpMiddleware";

import { Context } from "./Context";

export type TErrorMiddleware = (error: any, ctx: Context) => ReturnType<THttpMiddleware>;

export class Application {
  #list: THttpMiddleware[] = [];
  #error: TErrorMiddleware[] = [];

  #port: number;
  #host?: string;

  constructor(port: number, host?: string) {
    this.#port = port;
    this.#host = host;
  }

  use(middleware: THttpMiddleware) {
    this.#list.push(middleware);
    return this;
  }

  error(middleware: TErrorMiddleware) {
    this.#error.push(middleware);
    return this;
  }

  serve() {
    return Bun.serve({
      port: this.#port,
      hostname: this.#host,
      fetch: async (request, server) => {
        const ctx = new Context(request, server);

        await Promise.resolve()
          .then(async () => {
            ctx.body = await runHttpMiddleware([
              ...this.#list,
              (ctx) => {
                ctx.statusCode = 404;
                return `Can not ${ctx.req.method} ${ctx.url}`;
              }
            ], ctx
            ) ?? ctx.body;
          })
          .catch(async (error) => {
            if (!this.#error.length)
              throw error;

            ctx.body = await runHttpMiddleware([
              ...this.#error.map(
                middleware => () => (
                  middleware(error, ctx)
                )
              ),
              (error) => { throw error; }
            ], ctx
            ) ?? ctx.body;
          })
          .catch((error) => {
            ctx.statusCode = 500;
            ctx.statusMessage = 'Server error';
            ctx.body = `${error}`;
          });

        return makeResponse(ctx);
      }
    });
  }
}