import { offlineManager } from './offline-manager';
import { donationDBService } from '../donation/donation-db.service';

// Background sync service — runs silently
class SyncService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Sync every 30 seconds when online
    this.intervalId = setInterval(() => {
      if (navigator.onLine) {
        this.syncAll();
      }
    }, 30000);

    // Also sync on visibility change (when user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        this.syncAll();
      }
    });
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  async syncAll(): Promise<void> {
    try {
      await this.syncProjects();
      await this.syncPolicies();
    } catch (err) {
      if (import.meta.env.DEV) console.error('[SyncService]', err);
    }
  }

  private async syncProjects(): Promise<void> {
    try {
      const projects = await donationDBService.getActiveProjects();
      for (const project of projects) {
        await offlineManager.put('projects', project);
      }
      await offlineManager.put('cache_meta', {
        key: 'projects_synced',
        timestamp: Date.now(),
      });
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Sync] Projects failed:', err);
    }
  }

  private async syncPolicies(): Promise<void> {
    try {
      const policies = await donationDBService.getPolicies();
      for (const policy of policies) {
        await offlineManager.put('policies', { id: policy.key, ...policy });
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('[Sync] Policies failed:', err);
    }
  }
}

export const syncService = new SyncService();
