# توثيق API - منصة رحماء بينهم

## 📚 نظرة عامة

توثيق شامل لجميع الواجهات البرمجية والنظام المعماري المتقدم للمنصة.

## 🏗️ البنية المعمارية

### الطبقات (Layers)
```
┌─────────────────────────────────────────┐
│     Presentation Layer (UI/UX)         │
│  ┌───────────────────────────────────┐  │
│  │  Next.js Pages + Components      │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Application Layer                   │
│  ┌───────────────────────────────────┐  │
│  │  Commands + Queries + Services   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Domain Layer                        │
│  ┌───────────────────────────────────┐  │
│  │  Aggregates + Events + Rules     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Infrastructure Layer                 │
│  ┌───────────────────────────────────┐  │
│  │  Repositories + APIs + Cache     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 📦 Core Modules

### 1. Event Bus System
```typescript
// النشر والاشتراك في الأحداث
eventBus.publish('user.login', { userId: '123' });
eventBus.subscribe('user.login', (data) => {
  console.log('User logged in:', data);
});
```

### 2. CQRS Pattern
```typescript
// Commands
const command = new CreateProjectCommand(title, description, budget);
await commandBus.execute(command);

// Queries
const query = new GetProjectsQuery({ status: 'active' });
const projects = await queryBus.execute(query);
```

### 3. State Management
```typescript
// إنشاء Slice
const userSlice = createSlice({
  name: 'user',
  initialState: { authenticated: false },
  reducers: {
    login: (state) => { state.authenticated = true; },
    logout: (state) => { state.authenticated = false; },
  },
});

// الاستخدام
const { state, dispatch } = useSlice(userSlice);
```

## 🔒 Security APIs

### Token Management
```typescript
import { AuthProvider } from '@/features/auth/contexts/AuthContext';

// المصادقة والتوكن تُدار عبر AuthContext — لا توكنات مكشوفة في الكود
```

### Input Sanitization
```typescript
import { sanitizeHtml, sanitizeInput, escapeHtml } from '@/shared/utils/security';

// تنظيف HTML (يسمح بالوسوم الآمنة فقط)
const cleanHTML = sanitizeHtml(userInput);
// تنظيف مدخلات النماذج
const clean = sanitizeInput(userInput);
```

## 📊 Monitoring APIs

### Performance Monitoring
```typescript
import { performanceMonitor } from '@/utils/performanceMonitoring';

// الحصول على المقاييس
const metrics = performanceMonitor.getMetrics();
console.log('FCP:', metrics.FCP);
console.log('LCP:', metrics.LCP);
```

### Health Checks
```typescript
import { healthCheckService, createDefaultChecks } from '@/utils/healthCheck';

// إنشاء الفحوصات
createDefaultChecks();

// تشغيل الفحوصات
const health = await healthCheckService.runChecks();
console.log('Health:', health.status);
```

### Intelligent Monitoring
```typescript
import { intelligentMonitoring, correlationEngine } from '@/features/core/intelligence/aiMonitoring';

// تسجيل المقاييس
intelligentMonitoring.recordMetric('api.latency', 150);

// اكتشاف الشذوذ
const anomalies = intelligentMonitoring.getAnomalies();

// التوصيات
const recommendations = intelligentMonitoring.generateRecommendations();
```

## 🚀 Resilience Patterns

### Circuit Breaker
```typescript
import { defaultCircuitBreaker } from '@/features/core/resilience';

const result = await defaultCircuitBreaker.execute(
  async () => await fetchData(),
  () => cachedData // fallback
);
```

### Retry with Backoff
```typescript
import { retry } from '@/features/core/resilience';

const result = await retry(
  async () => await fetchData(),
  { maxRetries: 3, initialDelay: 1000 }
);
```

### Rate Limiting
```typescript
import { rateLimiter } from '@/features/core/security';

const result = await rateLimiter.checkLimit('user-123');
if (!result.allowed) {
  throw new Error('Rate limit exceeded');
}
```

## 🎯 Feature Flags

```typescript
import { featureFlags, initializeDefaultFlags } from '@/features/core/features';

// تهيئة الأعلام
initializeDefaultFlags();

// فحص العلم
if (featureFlags.isEnabled('enhanced_donation')) {
  // تفعيل الميزة
}

// الحصول على متغير
const variant = featureFlags.getVariant('advanced_analytics');
```

## 🏥 Health Check System

### Available Checks
- **memory**: مراقبة استخدام الذاكرة
- **serviceWorker**: فحص Service Worker
- **network**: حالة الاتصال
- **cache**: حالة التخزين المؤقت
- **auth**: حالة المصادقة

### Custom Health Check
```typescript
healthCheckService.registerCheck('custom', async () => {
  const result = await customCheck();
  return {
    name: 'custom',
    status: result.ok ? 'pass' : 'fail',
    duration: 0,
    message: result.message,
  };
});
```

## 📈 Observability Stack

### Metrics Collector
```typescript
import { metrics } from '@/features/core/observability';

const counter = metrics.createCounter('api.requests', { endpoint: '/api/users' });
counter.increment();
```

### Structured Logger
```typescript
import { logger } from '@/features/core/observability';

logger.info('User action', { userId: '123', action: 'login' });
logger.error('Failed operation', error, { context: 'auth' });
```

### Distributed Tracing
```typescript
import { tracer } from '@/features/core/observability';

const span = tracer.startSpan('fetchUserData');
tracer.addTag('userId', '123');
// ... operation
tracer.endSpan();
```

## 🔐 Security APIs

### CSP Manager
```typescript
import { cspManager } from '@/features/core/security';

cspManager.setDirective('script-src', ["'self'", "'unsafe-inline'"]);
const policy = cspManager.generatePolicy();
```

### Audit Logger
```typescript
import { auditLogger } from '@/features/core/security';

auditLogger.log('user.login', 'authentication', true, {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
});
```

## 🧪 Testing Framework

### Unit Tests
```typescript
import { describe, it, expect, mock } from '@/features/core/testing';

describe('AuthService', () => {
  it('should login successfully', async () => {
    const result = await authService.login(credentials);
    expect(result.success).toBe(true);
  });
});
```

### Integration Tests
```typescript
import { testRunner } from '@/features/core/testing';

const results = await testRunner.run();
console.log('Pass rate:', results.stats.passRate);
```

## 📋 Validation System

### Built-in Rules
```typescript
import { formValidator, Rules } from '@/utils/validation';

const validation = formValidator.validateForm({
  email: [Rules.required(), Rules.email()],
  password: [Rules.required(), Rules.minLength(8)],
  phone: [Rules.phone()],
}, formData);

if (!validation.isValid) {
  console.error(validation.errors);
}
```

### Schema Validation
```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = schema.safeParse(data);
```

## 🎨 Architecture Patterns

### Strategy Pattern
```typescript
const context = new StrategyContext<Order>();
context.registerStrategy('express', new ExpressShipping());
context.registerStrategy('standard', new StandardShipping());
context.setStrategy('express');
await context.execute(order);
```

### Decorator Pattern
```typescript
const component = new CachingDecorator(
  new LoggingDecorator(
    new ConcreteComponent()
  )
);
```

### Pipeline Pattern
```typescript
const pipeline = new Pipeline<Request>();
pipeline.use(authMiddleware);
pipeline.use(validationMiddleware);
pipeline.use(businessLogicMiddleware);
await pipeline.execute(request);
```

## 🔄 Event Sourcing

```typescript
import { eventSourcer } from '@/features/core/events';

// تسجيل الأحداث
eventSourcer.recordEvent('project-123', {
  type: 'ProjectCreated',
  data: { title: 'New Project' },
});

// إعادة بناء الحالة
const state = eventSourcer.getAggregate('project-123');
```

## 🌐 SEO System

```typescript
import { seoManager, useSEO } from '@/utils/seoAdvanced';

useSEO({
  title: 'Project Page',
  description: 'Project description',
  type: 'website',
  image: '/og-image.png',
});
```

## 🎭 Feature Flags Integration

```typescript
// في المكون
const { enabled, variant } = useFeatureFlag('new_feature');

if (enabled) {
  return <NewFeature variant={variant} />;
}
return <OldFeature />;
```

## 📦 Complete API Reference

### Core Exports
- `createSlice` - State management
- `eventBus` - Event publishing/subscribing
- `commandBus` - CQRS commands
- `queryBus` - CQRS queries
- `smartCache` - Smart caching
- `errorTracker` - Error tracking
- `performanceMonitor` - Performance monitoring
- `healthCheckService` - Health monitoring
- `intelligentMonitoring` - AI monitoring
- `featureFlags` - Feature management

### Utility Exports
- `formValidator` - Form validation
- `retry` - Retry logic
- `circuitBreaker` - Circuit breaker
- `resilient` - Combined resilience
- `cryptoService` - Crypto utilities
- `auditLogger` - Audit logging

## 🚀 Getting Started

```typescript
import { initializeCoreServices } from '@/features/core';

// تهيئة جميع الخدمات
await initializeCoreServices();
```

## 📝 Best Practices

1. **Always use resilience patterns** for external calls
2. **Validate all inputs** using the validation system
3. **Log important events** using structured logging
4. **Monitor performance** using the monitoring system
5. **Use feature flags** for safe deployments
6. **Follow DDD principles** for domain logic
7. **Implement proper error handling** with the error tracker
8. **Use type-safe APIs** throughout the application

## 🔍 Troubleshooting

### Common Issues

1. **Type Errors**: Ensure all exports are correctly typed
2. **Import Errors**: Check path aliases in tsconfig.json
3. **Performance Issues**: Use smartCache for expensive operations
4. **Memory Leaks**: Use cleanup functions in useEffect

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('DEBUG', 'true');
```

---

**Version**: 2.0.0 Enterprise
**Last Updated**: 2024