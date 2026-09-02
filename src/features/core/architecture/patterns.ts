// Enterprise Architecture Patterns - Advanced System Design

// ============================================================
// 1. Strategy Pattern
// ============================================================
interface Strategy<T> {
  execute(context: T): Promise<any>;
}

class StrategyContext<T> {
  private strategies: Map<string, Strategy<T>> = new Map();
  private currentStrategy?: string;

  registerStrategy(name: string, strategy: Strategy<T>) {
    this.strategies.set(name, strategy);
  }

  setStrategy(name: string) {
    if (this.strategies.has(name)) {
      this.currentStrategy = name;
    }
  }

  async execute(context: T): Promise<any> {
    if (!this.currentStrategy) {
      throw new Error('No strategy selected');
    }
    const strategy = this.strategies.get(this.currentStrategy);
    if (!strategy) {
      throw new Error(`Strategy ${this.currentStrategy} not found`);
    }
    return strategy.execute(context);
  }
}

// ============================================================
// 2. Observer Pattern (Event-Driven)
// ============================================================
interface Observer<T> {
  update(data: T): void | Promise<void>;
}

class Observable<T> {
  private observers: Set<Observer<T>> = new Set();

  subscribe(observer: Observer<T>): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  async notify(data: T): Promise<void> {
    const promises = Array.from(this.observers).map(observer => 
      Promise.resolve(observer.update(data)).catch(err => 
        console.error('Observer error:', err)
      )
    );
    await Promise.all(promises);
  }
}

// ============================================================
// 3. Decorator Pattern
// ============================================================
interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  operation(): string {
    return 'ConcreteComponent';
  }
}

abstract class ComponentDecorator implements Component {
  constructor(protected component: Component) {}

  operation(): string {
    return this.component.operation();
  }
}

class LoggingDecorator extends ComponentDecorator {
  operation(): string {
    const result = super.operation();
    if (import.meta.env.DEV) console.log(`[LOG] ${result}`);
    return result;
  }
}

class CachingDecorator extends ComponentDecorator {
  private cache = new Map<string, string>();

  operation(): string {
    const key = this.component.constructor.name;
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    const result = super.operation();
    this.cache.set(key, result);
    return result;
  }
}

// ============================================================
// 4. Factory Pattern
// ============================================================
interface Product {
  name: string;
  price: number;
}

class ProductA implements Product {
  name = 'Product A';
  price = 100;
}

class ProductB implements Product {
  name = 'Product B';
  price = 200;
}

class ProductFactory {
  static create(type: 'A' | 'B'): Product {
    switch (type) {
      case 'A':
        return new ProductA();
      case 'B':
        return new ProductB();
      default:
        throw new Error(`Unknown product type: ${type}`);
    }
  }
}

// ============================================================
// 5. Adapter Pattern
// ============================================================
interface Target {
  request(): string;
}

class Adaptee {
  specificRequest(): string {
    return 'Adaptee specific request';
  }
}

class Adapter implements Target {
  constructor(private adaptee: Adaptee) {}

  request(): string {
    return this.adaptee.specificRequest();
  }
}

// ============================================================
// 6. Proxy Pattern
// ============================================================
interface Service {
  request(): Promise<string>;
}

class RealService implements Service {
  async request(): Promise<string> {
    return 'Real service response';
  }
}

class ProxyService implements Service {
  constructor(private realService: Service, private cache: Map<string, string>) {}

  async request(): Promise<string> {
    const cacheKey = 'service_request';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const result = await this.realService.request();
    this.cache.set(cacheKey, result);
    return result;
  }
}

// ============================================================
// 7. Command Pattern (already in CQRS)
// ============================================================
// See cqrs/commandHandler.ts

// ============================================================
// 8. Chain of Responsibility Pattern
// ============================================================
abstract class Handler {
  constructor(protected next?: Handler) {}

  abstract handle(request: string): string | undefined;

  pass(request: string): string | undefined {
    if (this.next) {
      return this.next.handle(request);
    }
    return undefined;
  }
}

class AuthHandler extends Handler {
  handle(request: string): string | undefined {
    if (!request.includes('token')) {
      return 'Auth failed';
    }
    return this.pass(request);
  }
}

class ValidationHandler extends Handler {
  handle(request: string): string | undefined {
    if (request.length < 10) {
      return 'Validation failed';
    }
    return this.pass(request);
  }
}

class BusinessHandler extends Handler {
  handle(request: string): string | undefined {
    return this.pass(request) || 'Business logic executed';
  }
}

// ============================================================
// 9. Repository Pattern (already in CQRS)
// ============================================================
// See cqrs/commandHandler.ts

// ============================================================
// 10. Unit of Work Pattern (already in CQRS)
// ============================================================
// See cqrs/commandHandler.ts

// ============================================================
// 11. Dependency Injection Container
// ============================================================
interface ServiceDescriptor {
  token: any;
  implementation: new (...args: any[]) => any;
  singleton?: boolean;
  instance?: any;
}

class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, ServiceDescriptor> = new Map();

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  register(token: string, implementation: new (...args: any[]) => any, singleton = true) {
    this.services.set(token, {
      token,
      implementation,
      singleton,
      instance: singleton ? new implementation() : undefined,
    });
  }

  resolve<T>(token: string): T {
    const descriptor = this.services.get(token);
    if (!descriptor) {
      throw new Error(`Service ${token} not registered`);
    }

    if (descriptor.singleton && descriptor.instance) {
      return descriptor.instance as T;
    }

    return new descriptor.implementation() as T;
  }
}

export const diContainer = DIContainer.getInstance();

// ============================================================
// 12. Pipeline Pattern (Middleware)
// ============================================================
interface PipelineContext<T> {
  request: T;
  response?: any;
  next: () => Promise<void>;
}

type Middleware<T> = (context: PipelineContext<T>) => Promise<void>;

class Pipeline<T> {
  private middlewares: Middleware<T>[] = [];

  use(middleware: Middleware<T>) {
    this.middlewares.push(middleware);
  }

  async execute(request: T): Promise<any> {
    let index = 0;
    const context: PipelineContext<T> = {
      request,
      next: async () => {
        index++;
        if (index < this.middlewares.length) {
          await this.middlewares[index](context);
        }
      },
    };

    await this.middlewares[0](context);
    return context.response;
  }
}

// ============================================================
// 13. Saga Pattern (Distributed Transactions)
// ============================================================
interface SagaStep {
  name: string;
  execute(): Promise<void>;
  compensate(): Promise<void>;
}

class Saga {
  private steps: SagaStep[] = [];
  private executedSteps: SagaStep[] = [];

  addStep(step: SagaStep) {
    this.steps.push(step);
    return this;
  }

  async run(): Promise<void> {
    for (const step of this.steps) {
      try {
        await step.execute();
        this.executedSteps.push(step);
      } catch (error) {
        await this.compensate();
        throw error;
      }
    }
  }

  private async compensate(): Promise<void> {
    for (let i = this.executedSteps.length - 1; i >= 0; i--) {
      try {
        await this.executedSteps[i].compensate();
      } catch (error) {
        console.error('Compensation error:', error);
      }
    }
    this.executedSteps = [];
  }
}

// ============================================================
// 14. Specification Pattern
// ============================================================
interface Specification<T> {
  isSatisfiedBy(entity: T): boolean;
  and(spec: Specification<T>): Specification<T>;
  or(spec: Specification<T>): Specification<T>;
  not(): Specification<T>;
}

class ConcreteSpecification<T> implements Specification<T> {
  constructor(private predicate: (entity: T) => boolean) {}

  isSatisfiedBy(entity: T): boolean {
    return this.predicate(entity);
  }

  and(spec: Specification<T>): Specification<T> {
    return new ConcreteSpecification(entity => 
      this.isSatisfiedBy(entity) && spec.isSatisfiedBy(entity)
    );
  }

  or(spec: Specification<T>): Specification<T> {
    return new ConcreteSpecification(entity => 
      this.isSatisfiedBy(entity) || spec.isSatisfiedBy(entity)
    );
  }

  not(): Specification<T> {
    return new ConcreteSpecification(entity => !this.isSatisfiedBy(entity));
  }
}

// ============================================================
// 15. Mediator Pattern (Event Aggregator)
// ============================================================
interface IMediator {
  send<T>(message: T): Promise<any>;
  publish<T>(notification: T): Promise<void>;
}

class Mediator implements IMediator {
  private handlers: Map<string, Array<(message: any) => Promise<any>>> = new Map();

  register<T>(messageType: string, handler: (message: T) => Promise<any>) {
    if (!this.handlers.has(messageType)) {
      this.handlers.set(messageType, []);
    }
    this.handlers.get(messageType)!.push(handler);
  }

  async send<T>(message: T): Promise<any> {
    const messageType = (message as any).constructor.name;
    const handlers = this.handlers.get(messageType) || [];
    
    for (const handler of handlers) {
      try {
        await handler(message);
      } catch (error) {
        console.error('Handler error:', error);
      }
    }
  }

  async publish<T>(notification: T): Promise<void> {
    await this.send(notification);
  }
}

export const mediator = new Mediator();


