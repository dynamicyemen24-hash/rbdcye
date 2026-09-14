import { offlineManager } from "./offline-manager";

type SyncResult = { ok: boolean; count: number; error?: string };

// Background sync — يعمل بصمت، يزامن كل الكيانات الحرجة أوفلاين-أولاً
class SyncService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;
  private lastSyncAt: number | null = null;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    // Sync every 60s when online (reduced from 30s to save battery/data)
    this.intervalId = setInterval(() => {
      if (navigator.onLine) void this.syncAll();
    }, 60_000);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && navigator.onLine) void this.syncAll();
    });
    window.addEventListener("online", () => void this.syncAll());
    // periodic sync after offline queue flush
    window.addEventListener("rbdcye:online" as unknown as string, () => void this.syncAll());
  }

  stop(): void {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
    this.isRunning = false;
  }

  getLastSyncAt(): number | null { return this.lastSyncAt; }

  async syncAll(): Promise<Record<string, SyncResult>> {
    const results: Record<string, SyncResult> = {};
    // Run in parallel where safe, sequential for dependencies
    const tasks: Array<[string, () => Promise<number>] > = [
      ["projects", () => this.syncProjects()],
      ["news", () => this.syncNews()],
      ["stories", () => this.syncStories()],
      ["partners", () => this.syncPartners()],
      ["reports", () => this.syncReports()],
      ["media", () => this.syncMedia()],
      ["policies", () => this.syncPolicies()],
      ["pages", () => this.syncPages()],
    ];

    await Promise.all(tasks.map(async ([key, fn]) => {
      try { const count = await fn(); results[key] = { ok: true, count }; }
      catch (e) { results[key] = { ok: false, count: 0, error: e instanceof Error ? e.message : String(e) }; }
    }));

    // flush queued mutations after pulling fresh data
    try { await offlineManager.processSyncQueue(); } catch { /* ignore */ }

    this.lastSyncAt = Date.now();
    try { await offlineManager.put("cache_meta", { key: "last_sync", timestamp: this.lastSyncAt, results }); } catch { /* ignore */ }
    window.dispatchEvent(new CustomEvent("rbdcye:sync-complete", { detail: results }));
    return results;
  }

  private async syncViaDataService(entity: string, store: string): Promise<number> {
    try {
      const { dataService } = await import("@/shared/services/data.service");
      const items = await dataService.getAll(entity, true);
      if (Array.isArray(items) && items.length > 0) {
        // putMany if available, fallback to sequential
        try { await offlineManager.putMany(store, items); }
        catch { for (const it of items) await offlineManager.put(store, it); }
        await offlineManager.put("cache_meta", { key: `${store}_synced`, timestamp: Date.now(), count: items.length });
        return items.length;
      }
      return 0;
    } catch { return 0; }
  }

  private syncProjects(): Promise<number> { return this.syncViaDataService("rh_projects_data", "projects"); }
  private syncNews(): Promise<number> { return this.syncViaDataService("rh_news_data", "news"); }
  private syncStories(): Promise<number> { return this.syncViaDataService("rh_stories_data", "stories"); }
  private syncPartners(): Promise<number> { return this.syncViaDataService("rh_partners_data", "partners"); }
  private syncReports(): Promise<number> { return this.syncViaDataService("rh_reports_data", "reports"); }
  private syncMedia(): Promise<number> { return this.syncViaDataService("rh_media_data", "media"); }

  private async syncPolicies(): Promise<number> {
    try {
      const { donationDBService } = await import("../donation/donation-db.service");
      const policies = await donationDBService.getPolicies();
      for (const p of policies) await offlineManager.put("policies", { id: (p as unknown as { key: string }).key, ...(p as object) });
      return policies.length;
    } catch { return 0; }
  }

  private async syncPages(): Promise<number> {
    // pages are static routes — cache meta only
    try {
      await offlineManager.put("cache_meta", { key: "pages_synced", timestamp: Date.now() });
      return 1;
    } catch { return 0; }
  }

  // Manual per-entity sync for admin actions
  async syncEntity(entity: string): Promise<SyncResult> {
    const map: Record<string, string> = {
      projects: "rh_projects_data", news: "rh_news_data", stories: "rh_stories_data",
      partners: "rh_partners_data", reports: "rh_reports_data", media: "rh_media_data",
    };
    const dsKey = map[entity] || entity;
    try { const c = await this.syncViaDataService(dsKey, entity); return { ok: true, count: c }; }
    catch (e) { return { ok: false, count: 0, error: e instanceof Error ? e.message : String(e) }; }
  }
}

export const syncService = new SyncService();
