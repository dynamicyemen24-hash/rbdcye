// Enterprise Event Bus - For decoupled communication
type EventHandler<T = any> = (payload: T) => void | Promise<void>;

interface EventMetadata {
  timestamp: number;
  source: string;
  correlationId?: string;
  userId?: string;
}

interface StoredEvent {
  type: string;
  payload: any;
  metadata: EventMetadata;
}

class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private eventHistory: StoredEvent[] = [];
  private readonly MAX_HISTORY = 1000;

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  subscribe<T>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);

    return () => {
      this.handlers.get(eventType)?.delete(handler as EventHandler);
    };
  }

  async publish<T>(
    eventType: string,
    payload: T,
    source = "unknown",
    correlationId?: string,
    userId?: string
  ): Promise<void> {
    const event: StoredEvent = {
      type: eventType,
      payload,
      metadata: {
        timestamp: Date.now(),
        source,
        correlationId,
        userId,
      },
    };

    this.eventHistory.push(event);
    if (this.eventHistory.length > this.MAX_HISTORY) {
      this.eventHistory = this.eventHistory.slice(-this.MAX_HISTORY);
    }

    const handlers = this.handlers.get(eventType) || new Set();
    const promises = Array.from(handlers).map((handler) =>
      Promise.resolve(handler(payload)).catch((err) =>
        console.error(`[EventBus] Error in handler for ${eventType}:`, err)
      )
    );

    await Promise.all(promises);
  }

  getHistory(eventType?: string): StoredEvent[] {
    if (!eventType) return [...this.eventHistory];
    return this.eventHistory.filter((e) => e.type === eventType);
  }

  clear() {
    this.handlers.clear();
    this.eventHistory = [];
  }
}

export const eventBus = EventBus.getInstance();

// Domain Events
export const DOMAIN_EVENTS = {
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  PROJECT_CREATED: "project.created",
  PROJECT_UPDATED: "project.updated",
  DONATION_CREATED: "donation.created",
  VOLUNTEER_REGISTERED: "volunteer.registered",
  NEWS_PUBLISHED: "news.published",
  STORY_CREATED: "story.created",
} as const;

// Event Sourcing - Store all state changes
export class EventSourcer {
  private events: Map<string, StoredEvent[]> = new Map();
  private snapshots: Map<string, { state: any; timestamp: number }> = new Map();

  recordEvent(aggregateId: string, event: StoredEvent) {
    const aggregateEvents = this.events.get(aggregateId) || [];
    aggregateEvents.push(event);
    this.events.set(aggregateId, aggregateEvents);

    if (aggregateEvents.length % 10 === 0) {
      this.takeSnapshot(aggregateId);
    }
  }

  takeSnapshot(aggregateId: string) {
    const events = this.events.get(aggregateId) || [];
    const state = this.rebuildState(events);
    this.snapshots.set(aggregateId, {
      state,
      timestamp: Date.now(),
    });
  }

  rebuildState(events: StoredEvent[]): any {
    return events.reduce((state, event) => {
      return { ...state, ...event.payload };
    }, {});
  }

  getAggregate(aggregateId: string) {
    const events = this.events.get(aggregateId) || [];
    const snapshot = this.snapshots.get(aggregateId);

    if (snapshot && events.length > 10) {
      const recentEvents = events.slice(
        events.findIndex((e) => e.metadata.timestamp > snapshot.timestamp)
      );
      return this.rebuildState([snapshot.state, ...recentEvents]);
    }

    return this.rebuildState(events);
  }
}

export const eventSourcer = new EventSourcer();
