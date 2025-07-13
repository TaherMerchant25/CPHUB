import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export class CacheService {
  private static instance: CacheService;
  
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<boolean> {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return true;
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(":")}`;
  }
}

export const cache = CacheService.getInstance();
