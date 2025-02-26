// Rate limiter class for configurable rate limiting
export class RateLimiter {
  private store = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request is allowed based on the rate limit
   * @param identifier - Unique identifier for the requester (e.g., IP address)
   * @returns Result of the rate limit check
   */
  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const key = `rate-limit:${this.config.name}:${identifier}`;

    // Clean up expired entries
    this.cleanupExpired();

    const entry = this.store.get(key);

    // If no entry exists or it has expired, create a new one
    if (!entry || now > entry.resetTime) {
      const newEntry = {
        count: 1,
        resetTime: now + this.config.interval * 1000,
      };
      this.store.set(key, newEntry);

      return {
        success: true,
        remaining: this.config.limit - 1,
        reset: newEntry.resetTime,
      };
    }

    // Check if limit exceeded
    const remaining = this.config.limit - entry.count;
    if (remaining <= 0) {
      return {
        success: false,
        remaining: 0,
        reset: entry.resetTime,
      };
    }

    // Increment count
    entry.count += 1;
    this.store.set(key, entry);

    return {
      success: true,
      remaining,
      reset: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries to prevent memory leaks
   */
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Types
export interface RateLimitConfig {
  name: string; // Unique name for this rate limiter
  limit: number; // Maximum number of requests
  interval: number; // Time window in seconds
}

export interface RateLimitResult {
  success: boolean; // Whether the request is allowed
  remaining: number; // Remaining requests in the current window
  reset: number; // Timestamp when the rate limit resets
}

// Create pre-configured rate limiters
export const searchRateLimiter = new RateLimiter({
  name: "search",
  limit: 30, // 30 requests per minute for search
  interval: 60, // 1 minute
});

export const submissionRateLimiter = new RateLimiter({
  name: "submission",
  limit: 5, // 5 submissions per 10 minutes
  interval: 600, // 10 minutes
});

// For backward compatibility
export async function checkRateLimit(
  identifier: string,
  action: string = "default"
): Promise<RateLimitResult> {
  // Choose the appropriate rate limiter based on the action
  if (action === "search") {
    return searchRateLimiter.check(identifier);
  } else if (action === "submission") {
    return submissionRateLimiter.check(identifier);
  } else {
    // Default rate limiter for other actions
    const defaultRateLimiter = new RateLimiter({
      name: "default",
      limit: 10,
      interval: 60,
    });
    return defaultRateLimiter.check(identifier);
  }
}
