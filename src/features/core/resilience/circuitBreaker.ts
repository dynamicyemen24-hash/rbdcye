// Enterprise Resilience Patterns - Circuit Breaker, Retry, Rate Limiter

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

// Circuit Breaker Pattern
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime?: number;
  private successCount = 0;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
      } else {
        if (fallback) return fallback();
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return !!this.lastFailureTime && 
      Date.now() - this.lastFailureTime > this.options.resetTimeout;
  }

  private onSuccess() {
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 2) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.options.failureThreshold) {
      this.state = 'OPEN';
    }
    
    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.lastFailureTime = Date.now();
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = undefined;
    this.successCount = 0;
  }
}

// Retry with Exponential Backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = options;
  let lastError: Error;
  let currentDelay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, currentDelay));
        currentDelay = Math.min(currentDelay * backoffMultiplier, maxDelay);
      }
    }
  }

  throw lastError!;
}

// Rate Limiter
export class RateLimiter {
  private requests: number[] = [];

  constructor(private options: RateLimiterOptions) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.options.windowMs);

    if (this.requests.length >= this.options.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.options.windowMs - (now - oldestRequest);
      
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.execute(fn);
      }
    }

    this.requests.push(now);
    return fn();
  }

  getStatus() {
    const now = Date.now();
    const recentRequests = this.requests.filter(time => now - time < this.options.windowMs);
    
    return {
      currentCount: recentRequests.length,
      maxRequests: this.options.maxRequests,
      remaining: this.options.maxRequests - recentRequests.length,
      resetTime: recentRequests[0] ? recentRequests[0] + this.options.windowMs : now,
    };
  }
}

// Request Deduplication
export class RequestDeduplicator<T> {
  private pending = new Map<string, Promise<T>>();

  async dedupe(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    const promise = fn().finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, promise);
    return promise;
  }

  cancel(key: string) {
    this.pending.delete(key);
  }

  clear() {
    this.pending.clear();
  }
}

// Bulkhead Pattern - Isolate resources
export class Bulkhead {
  private running = 0;
  private queue: Array<() => void> = [];

  constructor(
    private maxConcurrent: number,
    private maxQueue: number = 10
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.running >= this.maxConcurrent) {
      if (this.queue.length >= this.maxQueue) {
        throw new Error('Bulkhead queue is full');
      }
      
      await new Promise<void>(resolve => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await fn();
    } finally {
      this.running--;
      const next = this.queue.shift();
      if (next) next();
    }
  }

  getStatus() {
    return {
      running: this.running,
      queued: this.queue.length,
      maxConcurrent: this.maxConcurrent,
      utilization: (this.running / this.maxConcurrent) * 100,
    };
  }
}

// Create default instances
export const defaultCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
  monitoringPeriod: 60000,
});

export const defaultRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60000,
});

export const defaultBulkhead = new Bulkhead(10, 50);

// Utility: Combine resilience patterns
export async function resilient<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    circuitBreaker?: CircuitBreaker;
    rateLimiter?: RateLimiter;
    bulkhead?: Bulkhead;
    fallback?: () => T;
  } = {}
): Promise<T> {
  const {
    retries = 3,
    circuitBreaker = defaultCircuitBreaker,
    rateLimiter = defaultRateLimiter,
    bulkhead = defaultBulkhead,
    fallback,
  } = options;

  return circuitBreaker.execute(
    () => rateLimiter.execute(
      () => bulkhead.execute(
        () => retry(fn, { maxRetries: retries })
      )
    ),
    fallback
  );
}

