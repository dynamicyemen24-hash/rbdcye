// Domain-Driven Design - Aggregates, Entities, Value Objects

// ============================================================
// Value Objects
// ============================================================
class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid email: ${value}`);
    }
  }

  private isValid(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string = 'OMR'
  ) {
    if (amount < 0) {
      throw new Error(`Invalid amount: ${amount}`);
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }
}

class ProjectId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Project ID cannot be empty');
    }
  }

  getValue(): string {
    return this.value;
  }
}

// ============================================================
// Entities
// ============================================================
interface EntityIdentity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

abstract class Entity<TId> {
  protected readonly _id: TId;
  protected _version: number = 0;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  get version(): number {
    return this._version;
  }

  protected incrementVersion() {
    this._version++;
  }

  equals(other: Entity<TId>): boolean {
    return this._id === other._id;
  }
}

// ============================================================
// Aggregates
// ============================================================
interface AggregateRoot {
  id: string;
  version: number;
  uncommittedEvents: any[];
  applyEvent(event: any): void;
}

class ProjectAggregate extends Entity<ProjectId> {
  private title: string = '';
  private description: string = '';
  private budget: Money | null = null;
  private status: string = 'active';
  private progress: number = 0;
  private beneficiaries: number = 0;
  public uncommittedEvents: any[] = [];

  constructor(id: ProjectId) {
    super(id);
  }

  create(title: string, description: string, budget: Money) {
    if (this._version !== 0) {
      throw new Error('Project already created');
    }

    this.title = title;
    this.description = description;
    this.budget = budget;
    this.status = 'active';
    
    this.incrementVersion();
    this.uncommittedEvents.push({
      type: 'ProjectCreated',
      data: { id: this._id.getValue(), title, description, budget: budget.getAmount() },
      timestamp: new Date(),
    });
  }

  updateProgress(newProgress: number) {
    if (newProgress < 0 || newProgress > 100) {
      throw new Error('Progress must be between 0 and 100');
    }

    const oldProgress = this.progress;
    this.progress = newProgress;
    this.incrementVersion();

    this.uncommittedEvents.push({
      type: 'ProjectProgressUpdated',
      data: { id: this._id.getValue(), oldProgress, newProgress },
      timestamp: new Date(),
    });
  }

  addBeneficiaries(count: number) {
    if (count < 0) {
      throw new Error('Cannot add negative beneficiaries');
    }

    this.beneficiaries += count;
    this.incrementVersion();

    this.uncommittedEvents.push({
      type: 'BeneficiariesAdded',
      data: { id: this._id.getValue(), count, total: this.beneficiaries },
      timestamp: new Date(),
    });
  }

  applyEvent(event: any): void {
    switch (event.type) {
      case 'ProjectCreated':
        this.title = event.data.title;
        this.description = event.data.description;
        this.budget = new Money(event.data.budget);
        break;
      case 'ProjectProgressUpdated':
        this.progress = event.data.newProgress;
        break;
      case 'BeneficiariesAdded':
        this.beneficiaries = event.data.total;
        break;
    }
    this.incrementVersion();
  }

  getStatus(): string {
    return this.status;
  }

  getProgress(): number {
    return this.progress;
  }

  getBudget(): Money | null {
    return this.budget;
  }
}

// ============================================================
// Repository Pattern
// ============================================================
interface Repository<TEntity, TId> {
  findById(id: TId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}

class InMemoryProjectRepository implements Repository<ProjectAggregate, ProjectId> {
  private projects: Map<string, ProjectAggregate> = new Map();

  async findById(id: ProjectId): Promise<ProjectAggregate | null> {
    return this.projects.get(id.getValue()) || null;
  }

  async save(project: ProjectAggregate): Promise<ProjectAggregate> {
    this.projects.set(project.id.getValue(), project);
    return project;
  }

  async delete(id: ProjectId): Promise<void> {
    this.projects.delete(id.getValue());
  }
}

// ============================================================
// Domain Events
// ============================================================
interface DomainEvent {
  aggregateId: string;
  type: string;
  data: any;
  timestamp: Date;
  version: number;
}

class DomainEventBus {
  private static instance: DomainEventBus;
  private handlers: Map<string, Array<(event: DomainEvent) => void>> = new Map();

  static getInstance(): DomainEventBus {
    if (!DomainEventBus.instance) {
      DomainEventBus.instance = new DomainEventBus();
    }
    return DomainEventBus.instance;
  }

  register(eventType: string, handler: (event: DomainEvent) => void) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  publish(event: DomainEvent) {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error(`Error handling ${event.type}:`, error);
      }
    });
  }
}

export const domainEventBus = DomainEventBus.getInstance();

// ============================================================
// Event Handlers (Side Effects)
// ============================================================
class ProjectCreatedHandler {
  handle(event: DomainEvent) {
    const { title } = event.data;
    console.log(`[ProjectCreated] New project: ${title}`);
    
    // Send notification
    // Update analytics
    // Create related entities
  }
}

class ProjectProgressUpdatedHandler {
  handle(event: DomainEvent) {
    const { newProgress } = event.data;
    console.log(`[ProgressUpdate] Project progress: ${newProgress}%`);
    
    // Update dashboard stats
    // Check milestone completion
    // Send progress report
  }
}

// Register handlers
domainEventBus.register('ProjectCreated', new ProjectCreatedHandler().handle.bind(new ProjectCreatedHandler()));
domainEventBus.register('ProjectProgressUpdated', new ProjectProgressUpdatedHandler().handle.bind(new ProjectProgressUpdatedHandler()));

// ============================================================
// Unit of Work Pattern
// ============================================================
interface UoWAggregate {
  uncommittedEvents: any[];
  version: number;
  id: any;
}

class UnitOfWork {
  private newAggregates: UoWAggregate[] = [];
  private modifiedAggregates: UoWAggregate[] = [];
  private deletedAggregates: UoWAggregate[] = [];
  private eventBus = domainEventBus;

  registerNew<T extends UoWAggregate>(aggregate: T) {
    this.newAggregates.push(aggregate);
  }

  registerModified<T extends UoWAggregate>(aggregate: T) {
    this.modifiedAggregates.push(aggregate);
  }

  registerDeleted<T extends UoWAggregate>(aggregate: T) {
    this.deletedAggregates.push(aggregate);
  }

  async commit(): Promise<void> {
    // Persist all changes
    for (const aggregate of this.newAggregates) {
      await this.persist(aggregate);
    }
    for (const aggregate of this.modifiedAggregates) {
      await this.update(aggregate);
    }
    for (const aggregate of this.deletedAggregates) {
      await this.remove(aggregate);
    }

    // Publish all events
    for (const aggregate of [...this.newAggregates, ...this.modifiedAggregates]) {
      aggregate.uncommittedEvents.forEach(event => {
        this.eventBus.publish({
          aggregateId: aggregate.id,
          type: event.type,
          data: event.data,
          timestamp: event.timestamp,
          version: aggregate.version,
        });
      });
    }

    // Clear uncommitted events
    this.newAggregates = [];
    this.modifiedAggregates = [];
    this.deletedAggregates = [];
  }

  private async persist(aggregate: any): Promise<void> {
    // Persist to database
    console.log(`[UoW] Persisting ${aggregate.constructor.name}`);
  }

  private async update(aggregate: any): Promise<void> {
    console.log(`[UoW] Updating ${aggregate.constructor.name}`);
  }

  private async remove(aggregate: any): Promise<void> {
    console.log(`[UoW] Removing ${aggregate.constructor.name}`);
  }
}

export { 
  Email,
  Money,
  ProjectId,
  Entity,
  ProjectAggregate,
  InMemoryProjectRepository,
  UnitOfWork,
  type DomainEvent
};

