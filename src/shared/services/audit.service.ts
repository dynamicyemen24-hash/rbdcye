// ============================================================
// Audit Trail Service - Enterprise Grade Logging
// ============================================================
export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action:
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "READ"
    | "LOGIN"
    | "LOGOUT"
    | "EXPORT"
    | "IMPORT"
    | "APPROVE"
    | "REJECT";
  resource: string;
  resourceId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  status: "SUCCESS" | "FAILURE" | "PENDING";
  metadata?: Record<string, unknown>;
}

// Maximum number of audit entries to store locally
const MAX_LOCAL_ENTRIES = 10000;
const BATCH_SIZE = 50;
const SYNC_INTERVAL_MS = 60000; // 1 minute

class AuditService {
  private entries: AuditEntry[] = [];
  private pendingSync: AuditEntry[] = [];
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.loadFromStorage();
    this.startSyncTimer();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem("rh_audit_log");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.entries = parsed;
        }
      }
    } catch {
      // Silently fail - start with empty log
    }
  }

  private saveToStorage(): void {
    try {
      // Keep only latest entries to avoid storage quota issues
      const trimmed = this.entries.slice(0, MAX_LOCAL_ENTRIES);
      localStorage.setItem("rh_audit_log", JSON.stringify(trimmed));
    } catch {
      // If storage fails, trim aggressively
      try {
        this.entries = this.entries.slice(0, 1000);
        localStorage.setItem("rh_audit_log", JSON.stringify(this.entries));
      } catch {
        // Give up on storage
      }
    }
  }

  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.syncTimer = setInterval(() => {
      this.syncToServer();
    }, SYNC_INTERVAL_MS);
  }

  private async syncToServer(): Promise<void> {
    if (this.pendingSync.length === 0) return;

    const batch = this.pendingSync.splice(0, BATCH_SIZE);

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ entries: batch }),
      });

      if (!response.ok) {
        // Put back for retry
        this.pendingSync.unshift(...batch);
      }
    } catch {
      // Put back for retry
      this.pendingSync.unshift(...batch);
    }
  }

  private getClientInfo(): { ipAddress?: string; userAgent?: string } {
    try {
      return {
        ipAddress: typeof window !== "undefined" ? window.location.hostname : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      };
    } catch {
      return {};
    }
  }

  async log(
    entry: Omit<AuditEntry, "id" | "timestamp" | "ipAddress" | "userAgent">
  ): Promise<AuditEntry> {
    const clientInfo = this.getClientInfo();

    const fullEntry: AuditEntry = {
      ...entry,
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      ipAddress: clientInfo.ipAddress,
      userAgent: clientInfo.userAgent,
    };

    // Add to local log
    this.entries.unshift(fullEntry);
    this.saveToStorage();

    // Queue for server sync
    this.pendingSync.push(fullEntry);

    // If we have enough entries, sync immediately
    if (this.pendingSync.length >= BATCH_SIZE) {
      this.syncToServer().catch(() => {});
    }

    return fullEntry;
  }

  getEntries(
    options: {
      limit?: number;
      offset?: number;
      userId?: string;
      action?: AuditEntry["action"];
      resource?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): AuditEntry[] {
    let filtered = [...this.entries];

    if (options.userId) {
      filtered = filtered.filter((e) => e.userId === options.userId);
    }
    if (options.action) {
      filtered = filtered.filter((e) => e.action === options.action);
    }
    if (options.resource) {
      filtered = filtered.filter((e) => e.resource === options.resource);
    }
    if (options.startDate) {
      filtered = filtered.filter((e) => e.timestamp >= options.startDate!);
    }
    if (options.endDate) {
      filtered = filtered.filter((e) => e.timestamp <= options.endDate!);
    }

    const offset = options.offset || 0;
    const limit = options.limit || 50;

    return filtered.slice(offset, offset + limit);
  }

  getStats(): {
    total: number;
    today: number;
    byAction: Record<string, number>;
    byResource: Record<string, number>;
  } {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const byAction: Record<string, number> = {};
    const byResource: Record<string, number> = {};
    let todayCount = 0;

    this.entries.forEach((entry) => {
      byAction[entry.action] = (byAction[entry.action] || 0) + 1;
      byResource[entry.resource] = (byResource[entry.resource] || 0) + 1;
      if (entry.timestamp.startsWith(today)) {
        todayCount++;
      }
    });

    return {
      total: this.entries.length,
      today: todayCount,
      byAction,
      byResource,
    };
  }

  clearAll(): void {
    this.entries = [];
    this.pendingSync = [];
    localStorage.removeItem("rh_audit_log");
  }

  async logLogin(
    userId: string,
    userName: string,
    userRole: string,
    success: boolean
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      userName,
      userRole,
      action: success ? "LOGIN" : "LOGIN",
      resource: "auth",
      details: success ? `تسجيل دخول ناجح: ${userName}` : `محاولة تسجيل دخول فاشلة: ${userName}`,
      status: success ? "SUCCESS" : "FAILURE",
      metadata: { loginMethod: "credentials" },
    });
  }

  async logLogout(userId: string, userName: string, userRole: string): Promise<AuditEntry> {
    return this.log({
      userId,
      userName,
      userRole,
      action: "LOGOUT",
      resource: "auth",
      details: `تسجيل خروج: ${userName}`,
      status: "SUCCESS",
    });
  }

  async logCrud(
    action: "CREATE" | "UPDATE" | "DELETE",
    resource: string,
    resourceId: string | undefined,
    details: string,
    userId: string,
    userName: string,
    userRole: string,
    metadata?: Record<string, unknown>
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      userName,
      userRole,
      action,
      resource,
      resourceId,
      details,
      status: "SUCCESS",
      metadata,
    });
  }

  async logExport(
    resource: string,
    details: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      userName,
      userRole,
      action: "EXPORT",
      resource,
      details,
      status: "SUCCESS",
    });
  }

  async logApproval(
    resource: string,
    resourceId: string,
    approved: boolean,
    details: string,
    userId: string,
    userName: string,
    userRole: string
  ): Promise<AuditEntry> {
    return this.log({
      userId,
      userName,
      userRole,
      action: approved ? "APPROVE" : "REJECT",
      resource,
      resourceId,
      details,
      status: approved ? "SUCCESS" : "FAILURE",
    });
  }
}

export const auditService = new AuditService();
