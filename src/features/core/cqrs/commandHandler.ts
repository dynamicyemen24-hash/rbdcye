// CQRS + Repository Pattern + Unit of Work - Enterprise Architecture

type AnyCommand = Command<any>;
type AnyQuery = Query<any>;

// Command base
interface Command<TResult = void> {
  execute(): Promise<TResult>;
}

// Query base
interface Query<TResult> {
  execute(): Promise<TResult>;
}

// Command Handler
interface CommandHandler<TCommand extends AnyCommand, TResult = void> {
  handle(command: TCommand): Promise<TResult>;
}

// Query Handler
interface QueryHandler<TQuery extends AnyQuery, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

// Unit of Work
interface UnitOfWork {
  begin(): void;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  registerNew<T>(entity: T): void;
  registerModified<T>(entity: T): void;
  registerDeleted<T>(entity: T): void;
}

class InMemoryUnitOfWork implements UnitOfWork {
  private newEntities: any[] = [];
  private modifiedEntities: any[] = [];
  private deletedEntities: any[] = [];

  begin(): void {
    this.newEntities = [];
    this.modifiedEntities = [];
    this.deletedEntities = [];
  }

  commit(): Promise<void> {
    return Promise.resolve();
  }

  rollback(): Promise<void> {
    this.newEntities = [];
    this.modifiedEntities = [];
    this.deletedEntities = [];
    return Promise.resolve();
  }

  registerNew<T>(entity: T): void {
    this.newEntities.push(entity);
  }

  registerModified<T>(entity: T): void {
    this.modifiedEntities.push(entity);
  }

  registerDeleted<T>(entity: T): void {
    this.deletedEntities.push(entity);
  }

  getChanges() {
    return {
      new: [...this.newEntities],
      modified: [...this.modifiedEntities],
      deleted: [...this.deletedEntities],
    };
  }
}

// Command Bus
class CommandBus {
  private static instance: CommandBus;
  private handlers = new Map<string, CommandHandler<any>>();

  static getInstance(): CommandBus {
    if (!CommandBus.instance) {
      CommandBus.instance = new CommandBus();
    }
    return CommandBus.instance;
  }

  register<TCommand extends AnyCommand, TResult>(
    commandType: string,
    handler: CommandHandler<TCommand, TResult>
  ): void {
    this.handlers.set(commandType, handler as CommandHandler<any>);
  }

  async execute<TCommand extends AnyCommand, TResult = any>(
    command: TCommand
  ): Promise<TResult> {
    const commandType = command.constructor.name || 'UnknownCommand';
    const handler = this.handlers.get(commandType);
    
    if (!handler) {
      throw new Error(`No handler registered for command: ${commandType}`);
    }

    return handler.handle(command) as Promise<TResult>;
  }
}

// Query Bus
class QueryBus {
  private static instance: QueryBus;
  private handlers = new Map<string, QueryHandler<any, any>>();

  static getInstance(): QueryBus {
    if (!QueryBus.instance) {
      QueryBus.instance = new QueryBus();
    }
    return QueryBus.instance;
  }

  register<TQuery extends AnyQuery, TResult>(
    queryType: string,
    handler: QueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(queryType, handler);
  }

  async execute<TQuery extends AnyQuery, TResult = any>(
    query: TQuery
  ): Promise<TResult> {
    const queryType = query.constructor.name || 'UnknownQuery';
    const handler = this.handlers.get(queryType);
    
    if (!handler) {
      throw new Error(`No handler registered for query: ${queryType}`);
    }

    return handler.handle(query);
  }
}

export const commandBus = CommandBus.getInstance();
export const queryBus = QueryBus.getInstance();
export const unitOfWork = new InMemoryUnitOfWork();

// Example Commands
export class CreateProjectCommand implements Command<{ id: string }> {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly budget: number,
    public readonly category: string,
  ) {}

  async execute(): Promise<{ id: string }> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    unitOfWork.registerNew({
      id,
      title: this.title,
      description: this.description,
      budget: this.budget,
      category: this.category,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
    });

    await unitOfWork.commit();
    return { id };
  }
}

export class UpdateProjectStatusCommand implements Command<void> {
  constructor(
    public readonly projectId: string,
    public readonly status: string,
  ) {}

  async execute(): Promise<void> {
    // In a real app, fetch and update
    await unitOfWork.commit();
  }
}

// Example Queries
export class GetProjectsQuery implements Query<any[]> {
  constructor(
    public readonly filter?: { status?: string; category?: string },
    public readonly page = 1,
    public readonly limit = 10,
  ) {}

  async execute(): Promise<any[]> {
    // In a real app, fetch from repository
    return [];
  }
}

export class GetProjectByIdQuery implements Query<any> {
  constructor(public readonly id: string) {}

  async execute(): Promise<any> {
    return null;
  }
}

// Repository Pattern
export interface Repository<TEntity, TId> {
  findById(id: TId): Promise<TEntity | null>;
  findAll(options?: { filter?: any; page?: number; limit?: number }): Promise<TEntity[]>;
  save(entity: TEntity): Promise<TEntity>;
  delete(id: TId): Promise<void>;
}

export class InMemoryRepository<TEntity extends { id: string }> implements Repository<TEntity, string> {
  private entities = new Map<string, TEntity>();

  async findById(id: string): Promise<TEntity | null> {
    return this.entities.get(id) || null;
  }

  async findAll(options?: { filter?: any; page?: number; limit?: number }): Promise<TEntity[]> {
    let results = Array.from(this.entities.values());
    
    if (options?.filter) {
      results = results.filter(entity => 
        Object.entries(options.filter).every(([key, value]) => 
          entity[key as keyof TEntity] === value
        )
      );
    }

    if (options?.page && options?.limit) {
      const start = (options.page - 1) * options.limit;
      results = results.slice(start, start + options.limit);
    }

    return results;
  }

  async save(entity: TEntity): Promise<TEntity> {
    this.entities.set(entity.id, entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    this.entities.delete(id);
  }
}

// Factory for repositories
export const repositories = new Map<string, Repository<any, string>>();

export function getRepository<TEntity extends { id: string }>(
  name: string,
  repositoryClass: new () => Repository<TEntity, string>
): Repository<TEntity, string> {
  if (!repositories.has(name)) {
    repositories.set(name, new repositoryClass());
  }
  return repositories.get(name)!;
}

