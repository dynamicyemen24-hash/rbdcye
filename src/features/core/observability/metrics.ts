// Enterprise Observability - Metrics, Logging, Tracing

// Metrics types
interface Counter {
  increment(value?: number): void;
  decrement(value?: number): void;
  getValue(): number;
}

interface Gauge {
  setValue(value: number): void;
  increment(value?: number): void;
  decrement(value?: number): void;
  getValue(): number;
}

interface Histogram {
  observe(value: number): void;
  getPercentile(p: number): number;
  getAverage(): number;
  getCount(): number;
}

interface MetricData {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: number;
}

// Metrics Collector
class MetricsCollector {
  private static instance: MetricsCollector;
  private counters: Map<string, { value: number; tags: Record<string, string> }> = new Map();
  private gauges: Map<string, { value: number; tags: Record<string, string> }> = new Map();
  private histograms: Map<string, { values: number[]; tags: Record<string, string> }> = new Map();
  private listeners: Set<(data: MetricData) => void> = new Set();

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  createCounter(name: string, tags: Record<string, string> = {}): Counter {
    const key = this.getKey(name, tags);
    
    return {
      increment: (value = 1) => {
        const current = this.counters.get(key)?.value || 0;
        this.counters.set(key, { value: current + value, tags });
        this.notify({ name, value: current + value, tags, timestamp: Date.now() });
      },
      decrement: (value = 1) => {
        const current = this.counters.get(key)?.value || 0;
        this.counters.set(key, { value: Math.max(0, current - value), tags });
      },
      getValue: () => this.counters.get(key)?.value || 0,
    };
  }

  createGauge(name: string, tags: Record<string, string> = {}): Gauge {
    const key = this.getKey(name, tags);
    
    return {
      setValue: (value: number) => {
        this.gauges.set(key, { value, tags });
        this.notify({ name, value, tags, timestamp: Date.now() });
      },
      increment: (value = 1) => {
        const current = this.gauges.get(key)?.value || 0;
        this.gauges.set(key, { value: current + value, tags });
        this.notify({ name, value: current + value, tags, timestamp: Date.now() });
      },
      decrement: (value = 1) => {
        const current = this.gauges.get(key)?.value || 0;
        this.gauges.set(key, { value: current - value, tags });
        this.notify({ name, value: current - value, tags, timestamp: Date.now() });
      },
      getValue: () => this.gauges.get(key)?.value || 0,
    };
  }

  createHistogram(name: string, tags: Record<string, string> = {}): Histogram {
    const key = this.getKey(name, tags);
    
    return {
      observe: (value: number) => {
        const existing = this.histograms.get(key) || { values: [], tags };
        existing.values.push(value);
        this.histograms.set(key, existing);
        this.notify({ name, value, tags, timestamp: Date.now() });
      },
      getPercentile: (p: number) => {
        const values = this.histograms.get(key)?.values || [];
        if (values.length === 0) return 0;
        
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((p / 100) * sorted.length) - 1;
        return sorted[Math.max(0, index)];
      },
      getAverage: () => {
        const values = this.histograms.get(key)?.values || [];
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
      },
      getCount: () => this.histograms.get(key)?.values.length || 0,
    };
  }

  subscribe(listener: (data: MetricData) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getMetrics() {
    return {
      counters: Object.fromEntries(this.counters),
      gauges: Object.fromEntries(this.gauges),
      histograms: Object.fromEntries(
        Array.from(this.histograms.entries()).map(([key, { values }]) => [
          key,
          {
            values,
            count: values.length,
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            p95: this.getPercentileFromArray(values, 95),
            p99: this.getPercentileFromArray(values, 99),
          },
        ])
      ),
    };
  }

  private getKey(name: string, tags: Record<string, string>): string {
    const tagStr = Object.entries(tags).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${v}`).join(',');
    return `${name}{${tagStr}}`;
  }

  private notify(data: MetricData) {
    for (const listener of this.listeners) {
      try {
        listener(data);
      } catch (error) {
        console.error('Metrics listener error:', error);
      }
    }
  }

  private getPercentileFromArray(arr: number[], percentile: number): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }
}

export const metrics = MetricsCollector.getInstance();

// Structured Logger
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  traceId?: string;
  spanId?: string;
  userId?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;
  private listeners: Set<(entry: LogEntry) => void> = new Set();

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      traceId: this.generateTraceId(),
      userId: this.getUserId(),
    };

    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }

    // Console output in development
    if (import.meta.env.DEV) {
      const styles = {
        debug: 'color: #6b7280',
        info: 'color: #3b82f6',
        warn: 'color: #f59e0b',
        error: 'color: #ef4444',
      };
      
      console.log(
        `%c[${entry.level.toUpperCase()}] ${message}`,
        styles[level],
        context || {}
      );
    }

    // Notify listeners
    for (const listener of this.listeners) {
      try {
        listener(entry);
      } catch (error) {
        console.error('Logger listener error:', error);
      }
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : null,
    });
  }

  subscribe(listener: (entry: LogEntry) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let logs = [...this.logs];
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    return logs.slice(-limit);
  }

  clear() {
    this.logs = [];
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    try {
      const userStr = localStorage.getItem('auth_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
      }
    } catch {
      // ignore
    }
    return undefined;
  }
}

export const logger = Logger.getInstance();

// Distributed Tracing
interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  tags: Record<string, string>;
  logs: Array<{ timestamp: number; message: string }>;
}

class Tracer {
  private static instance: Tracer;
  private spans: Map<string, Span> = new Map();
  private activeSpan: Span | null = null;
  private listeners: Set<(span: Span) => void> = new Set();

  static getInstance(): Tracer {
    if (!Tracer.instance) {
      Tracer.instance = new Tracer();
    }
    return Tracer.instance;
  }

  startSpan(operationName: string, parentSpanId?: string): Span {
    const span: Span = {
      traceId: this.activeSpan?.traceId || this.generateTraceId(),
      spanId: this.generateSpanId(),
      parentSpanId: parentSpanId || this.activeSpan?.spanId,
      operationName,
      startTime: Date.now(),
      tags: {},
      logs: [],
    };

    this.spans.set(span.spanId, span);
    this.activeSpan = span;

    return span;
  }

  endSpan(spanId?: string) {
    const span = spanId ? this.spans.get(spanId) : this.activeSpan;
    if (!span) return;

    span.endTime = Date.now();
    span.duration = span.endTime - span.startTime;

    for (const listener of this.listeners) {
      try {
        listener(span);
      } catch (error) {
        console.error('Tracer listener error:', error);
      }
    }

    if (spanId && spanId === this.activeSpan?.spanId) {
      this.activeSpan = null;
    }
  }

  addTag(key: string, value: string, spanId?: string) {
    const span = spanId ? this.spans.get(spanId) : this.activeSpan;
    if (span) {
      span.tags[key] = value;
    }
  }

  addLog(message: string, spanId?: string) {
    const span = spanId ? this.spans.get(spanId) : this.activeSpan;
    if (span) {
      span.logs.push({
        timestamp: Date.now(),
        message,
      });
    }
  }

  subscribe(listener: (span: Span) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSpans(traceId?: string): Span[] {
    const spans = Array.from(this.spans.values());
    if (traceId) {
      return spans.filter(span => span.traceId === traceId);
    }
    return spans;
  }

  clear() {
    this.spans.clear();
    this.activeSpan = null;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const tracer = Tracer.getInstance();

// Decorator for automatic tracing
export function trace(operationName: string) {
  return function (_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const span = tracer.startSpan(operationName);
      
      try {
        tracer.addTag('class', _target.constructor.name);
        tracer.addTag('method', propertyKey);
        
        const result = await originalMethod.apply(this, args);
        
        tracer.addTag('status', 'success');
        return result;
      } catch (error) {
        tracer.addTag('status', 'error');
        tracer.addTag('error', error instanceof Error ? error.message : 'Unknown error');
        throw error;
      } finally {
        tracer.endSpan(span.spanId);
      }
    };

    return descriptor;
  };
}

// Metrics decorator
export function measure(operationName: string) {
  return function (_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const counter = metrics.createCounter(`${operationName}.count`);
    const histogram = metrics.createHistogram(`${operationName}.duration`);

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      
      try {
        counter.increment();
        const result = await originalMethod.apply(this, args);
        histogram.observe(Date.now() - startTime);
        return result;
      } catch (error) {
        histogram.observe(Date.now() - startTime);
        throw error;
      }
    };

    return descriptor;
  };
}

