// Enterprise Health Check & Monitoring System

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: number;
  checks: HealthCheck[];
  version: string;
  environment: string;
}

interface HealthCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  duration: number;
  message?: string;
  details?: Record<string, any>;
}

class HealthCheckService {
  private static instance: HealthCheckService;
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();
  private alerts: Map<string, number> = new Map();

  static getInstance(): HealthCheckService {
    if (!HealthCheckService.instance) {
      HealthCheckService.instance = new HealthCheckService();
    }
    return HealthCheckService.instance;
  }

  registerCheck(name: string, checkFn: () => Promise<HealthCheck>) {
    this.checks.set(name, checkFn);
  }

  async runChecks(): Promise<HealthStatus> {
    const checks: HealthCheck[] = [];

    for (const [name, checkFn] of this.checks) {
      const startTime = Date.now();
      try {
        const result = await checkFn();
        checks.push(result);

        if (result.status === "fail") {
          this.alerts.set(name, Date.now());
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        checks.push({
          name,
          status: "fail",
          duration,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const hasFailed = checks.some((c) => c.status === "fail");
    const hasWarning = checks.some((c) => c.status === "warn");

    return {
      status: hasFailed ? "unhealthy" : hasWarning ? "degraded" : "healthy",
      timestamp: Date.now(),
      checks,
      version: "2.0.0",
      environment: import.meta.env.MODE || "unknown",
    };
  }

  getAlerts() {
    const now = Date.now();
    const recentAlerts: Array<{ name: string; timestamp: number }> = [];

    for (const [name, timestamp] of this.alerts) {
      if (now - timestamp < 3600000) {
        recentAlerts.push({ name, timestamp });
      }
    }

    return recentAlerts;
  }
}

export const healthCheckService = HealthCheckService.getInstance();

// Predefined health checks
export const createDefaultChecks = () => {
  // Memory usage check
  healthCheckService.registerCheck("memory", async () => {
    const startTime = Date.now();

    if (typeof window !== "undefined" && (window as any).performance?.memory) {
      const memory = (window as any).performance.memory;
      const usedMB = memory.usedJSHeapSize / 1048576;
      const limitMB = memory.jsHeapSizeLimit / 1048576;
      const percentage = (usedMB / limitMB) * 100;

      return {
        name: "memory",
        status: percentage > 90 ? "fail" : percentage > 75 ? "warn" : "pass",
        duration: Date.now() - startTime,
        message: `Memory usage: ${usedMB.toFixed(2)}MB / ${limitMB.toFixed(2)}MB`,
        details: {
          usedMB,
          limitMB,
          percentage,
        },
      };
    }

    return {
      name: "memory",
      status: "pass",
      duration: Date.now() - startTime,
      message: "Memory API not available",
    };
  });

  // Service Worker check
  healthCheckService.registerCheck("serviceWorker", async () => {
    const startTime = Date.now();

    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        return {
          name: "serviceWorker",
          status: "pass",
          duration: Date.now() - startTime,
          message: "Service Worker is active",
          details: {
            scope: registration.scope,
            state: registration.active?.state,
          },
        };
      }
    }

    return {
      name: "serviceWorker",
      status: "warn",
      duration: Date.now() - startTime,
      message: "Service Worker not registered",
    };
  });

  // Network check
  healthCheckService.registerCheck("network", async () => {
    const startTime = Date.now();

    if (navigator.onLine) {
      return {
        name: "network",
        status: "pass",
        duration: Date.now() - startTime,
        message: "Network is online",
        details: {
          online: true,
          connection: (navigator as any).connection?.effectiveType,
        },
      };
    }

    return {
      name: "network",
      status: "fail",
      duration: Date.now() - startTime,
      message: "Network is offline",
    };
  });

  // Cache check
  healthCheckService.registerCheck("cache", async () => {
    const startTime = Date.now();

    try {
      const cacheNames = await caches.keys();
      return {
        name: "cache",
        status: "pass",
        duration: Date.now() - startTime,
        message: `Cache operational with ${cacheNames.length} caches`,
        details: {
          cacheNames,
        },
      };
    } catch (error) {
      return {
        name: "cache",
        status: "fail",
        duration: Date.now() - startTime,
        message: "Cache API not available",
      };
    }
  });

  // Auth check
  healthCheckService.registerCheck("auth", async () => {
    const startTime = Date.now();

    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        return {
          name: "auth",
          status: "pass",
          duration: Date.now() - startTime,
          message: "Authentication token present",
        };
      }

      return {
        name: "auth",
        status: "pass",
        duration: Date.now() - startTime,
        message: "No auth token (user not logged in)",
      };
    } catch (error) {
      return {
        name: "auth",
        status: "fail",
        duration: Date.now() - startTime,
        message: "Cannot access auth state",
      };
    }
  });
};

// Global health endpoint
export async function getHealthStatus(): Promise<HealthStatus> {
  const service = healthCheckService;
  return service.runChecks();
}
