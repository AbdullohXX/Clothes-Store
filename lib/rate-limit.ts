import Redis from 'ioredis'

export type RateLimitResult = { allowed: boolean; remaining: number; resetSeconds: number }

const redisUrl = process.env.REDIS_URL
const redis = redisUrl ? new Redis(redisUrl) : null

// Basic sliding window limiter: key per IP+route, N requests per T seconds
export async function rateLimit(key: string, max: number, windowSeconds: number): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000)
  const windowStart = now - windowSeconds
  const storeKey = `rl:${key}`

  if (!redis) {
    // In-memory fallback
    const globalAny = global as any
    globalAny.__rl = globalAny.__rl || new Map<string, number[]>()
    const arr: number[] = globalAny.__rl.get(storeKey) || []
    const filtered = arr.filter(ts => ts > windowStart)
    if (filtered.length >= max) {
      return { allowed: false, remaining: 0, resetSeconds: Math.max(0, windowSeconds - (now - filtered[0])) }
    }
    filtered.push(now)
    globalAny.__rl.set(storeKey, filtered)
    return { allowed: true, remaining: Math.max(0, max - filtered.length), resetSeconds: windowSeconds }
  }

  const pipeline = redis.multi()
  pipeline.zremrangebyscore(storeKey, 0, windowStart)
  pipeline.zadd(storeKey, now, String(now))
  pipeline.zcard(storeKey)
  pipeline.expire(storeKey, windowSeconds)
  const [, , count] = (await pipeline.exec()) as any
  const requests = Number(count[1])
  const allowed = requests <= max
  return { allowed, remaining: Math.max(0, max - requests), resetSeconds: windowSeconds }
}
