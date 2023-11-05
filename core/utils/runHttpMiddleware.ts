import { Context, TBody } from "core/class/Context";

import { runMiddleware } from "./runMiddleware";

export type TResult = TBody | void;
export type THttpMiddleware = (ctx: Context) => TResult | Promise<TResult>;

export async function runHttpMiddleware(list: THttpMiddleware[], ctx: Context): Promise<TResult> {
  return ctx.body = await runMiddleware(list.map(middleware => {
    return async (next) => {
      ctx.next = next;
      return ctx.body = await middleware(ctx) ?? ctx.body;
    };
  })) ?? ctx.body;
}