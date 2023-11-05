export type TMiddleware = (next: () => any) => any;

export async function runMiddleware<T extends TMiddleware>(
  list: T[],
  index = 0,
  result: { out: ReturnType<T> | undefined; } = { out: undefined }
) {
  const middleware = list[index];

  if (!middleware)
    throw new Error('Can\'t run next middleware');

  result.out = await middleware(async () => (
    result.out = (
      await runMiddleware(list, index + 1, result)
    ) ?? result.out
  )) ?? result.out;

  return result.out;
}