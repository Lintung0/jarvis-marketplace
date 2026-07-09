import { cache } from "./cache"

export function withCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyPrefix: string,
  ttlMs: number
): (...args: TArgs) => Promise<TResult> {
  return async (...args: TArgs): Promise<TResult> => {
    const key = `${keyPrefix}:${JSON.stringify(args)}`
    const cached = cache.get<TResult>(key)
    if (cached !== undefined) return cached
    const result = await fn(...args)
    cache.set(key, result, ttlMs)
    return result
  }
}
