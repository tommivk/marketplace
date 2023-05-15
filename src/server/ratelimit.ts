import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Allow 2 requests per 5 minutes
export const uploadLinkLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "5 m"),
  analytics: true,
});

export const dailyUploadLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "1 d"),
  analytics: true,
});

export const createItemLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "5 m"),
  analytics: true,
});

export const emailLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
});

export const emailDailyLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(200, "1 d"),
  analytics: true,
});
