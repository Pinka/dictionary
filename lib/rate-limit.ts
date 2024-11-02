// Simple in-memory store for rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  interval: number; // in seconds
  limit: number;
}

const RATE_LIMIT_CONFIG: RateLimitConfig = {
  interval: 3600, // 1 hour
  limit: 10, // 10 requests per hour
};

export async function checkRateLimit(identifier: string) {
  const now = Date.now();
  const userLimit = rateLimit.get(identifier);

  // Clean up expired entries
  if (userLimit && now > userLimit.resetTime) {
    rateLimit.delete(identifier);
  }

  if (!userLimit) {
    // First request
    rateLimit.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.interval * 1000,
    });
    return {
      success: true,
      remaining: RATE_LIMIT_CONFIG.limit - 1,
      reset: now + RATE_LIMIT_CONFIG.interval * 1000,
    };
  }

  const remaining = RATE_LIMIT_CONFIG.limit - userLimit.count;

  if (remaining <= 0) {
    return {
      success: false,
      remaining: 0,
      reset: userLimit.resetTime,
    };
  }

  // Increment count
  rateLimit.set(identifier, {
    count: userLimit.count + 1,
    resetTime: userLimit.resetTime,
  });

  return {
    success: true,
    remaining,
    reset: userLimit.resetTime,
  };
}
