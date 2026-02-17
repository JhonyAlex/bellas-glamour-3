/**
 * Simple in-memory cache for database queries on Spaceship shared hosting
 * Reduces load on Prisma Query Engine with aggressive process limits
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const cache = new Map<string, CacheEntry<any>>();

export function getCacheKey(...parts: (string | number | boolean | undefined)[]): string {
  return parts.filter(p => p !== undefined).join(':');
}

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number = 60000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  });
}

export function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.startsWith(pattern)) {
      cache.delete(key);
    }
  }
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  };
}
