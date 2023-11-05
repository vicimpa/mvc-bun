import { Context } from "core/class/Context";

const baseProto = Object.getPrototypeOf({});

export function makeResponse(ctx: Context) {
  let body: ConstructorParameters<typeof Response>[0];

  if (ctx.body instanceof Date) {
    body = ctx.body.toISOString();
  } else if (typeof ctx.body === 'number') {
    body = `${ctx.body}`;
  } else if (Object.getPrototypeOf(ctx.body) === baseProto) {
    ctx.headers.set('Content-Type', 'application/json');
    body = JSON.stringify(ctx.body);
  } else {
    body = ctx.body as any;
  }

  return new Response(body, {
    status: ctx.statusCode,
    statusText: ctx.statusMessage,
    headers: ctx.headers
  });
}