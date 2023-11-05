export type TMiddleware = (next: () => any) => any;

export async function runMiddleware(
  list: TMiddleware[],
  index = 0,
  result = { out: undefined }
): Promise<any> {
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