import { Application } from "core/class/Application";

const app = new Application(8000);

app.use(async (ctx) => {
  const time = performance.now();
  await ctx.next();

  console.log(
    ctx.statusCode,
    ctx.method,
    ctx.url,
    performance.now() - time
  );
});

app.use(async (ctx) => {
  await ctx.next();

  return {
    code: ctx.statusCode,
    result: ctx.body
  };
});

app.use(() => (
  'Hello world'
));

app.serve();