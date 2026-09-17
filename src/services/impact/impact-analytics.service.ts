// Impact Analytics Service — offline-first، يحسب مؤشرات الأثر محلياً ثم يزامن لاحقاً
// القراءة: IndexedDB (app_cache) ثم localStorage ثم SEED. الكتابة: طابور bg-sync ثم POST عند الاتصال.

import { SEED_IMPACT } from "@/content/website";
import { offlineManager } from "@/services/offline/offline-manager";
import { backgroundSync, fetchWithRetry, getCachedData, setCachedData } from "@/utils/offline";

export interface ImpactMetrics {
  totalBeneficiaries: number;
  totalDonations: number;
  totalVolunteers: number;
  totalProjects: number;
  averageDonation: number;
  growthRate: number;
  lastUpdated: string;
}

export interface ImpactSnapshot extends ImpactMetrics {
  id: string;
  source: "seed" | "cache" | "computed" | "server";
}

const CACHE_KEY = "impact-metrics";
const STORE = "app_cache";
const RECORD_ID = "impact-metrics";
const SNAPSHOT_TTL = 6 * 60 * 60 * 1000; // 6 ساعات
const SYNC_TAG = "impact-snapshot";

function defaultMetrics(): ImpactMetrics {
  return {
    totalBeneficiaries: SEED_IMPACT.beneficiaries,
    totalDonations: 0,
    totalVolunteers: SEED_IMPACT.volunteers,
    totalProjects: SEED_IMPACT.projects,
    averageDonation: 0,
    growthRate: 0,
    lastUpdated: new Date(0).toISOString(),
  };
}

function toNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** دمج عدة مصادر بأولوية: الأحدث يفوز، والأرقام الأكبر للمجاميع التراكمية */
export function mergeMetrics(base: ImpactMetrics, patch: Partial<ImpactMetrics>): ImpactMetrics {
  return {
    totalBeneficiaries: Math.max(toNumber(base.totalBeneficiaries), toNumber(patch.totalBeneficiaries)),
    totalDonations: Math.max(toNumber(base.totalDonations), toNumber(patch.totalDonations)),
    totalVolunteers: Math.max(toNumber(base.totalVolunteers), toNumber(patch.totalVolunteers)),
    totalProjects: Math.max(toNumber(base.totalProjects), toNumber(patch.totalProjects)),
    averageDonation: toNumber(patch.averageDonation, base.averageDonation),
    growthRate: toNumber(patch.growthRate, base.growthRate),
    lastUpdated: patch.lastUpdated ?? base.lastUpdated,
  };
}

/** حساب نسبة النمو بين فترتين — آمن ضد القسمة على صفر */
export function calcGrowthRate(current: number, previous: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return 0;
  const rate = ((current - previous) / previous) * 100;
  return Math.round(rate * 10) / 10;
}

class ImpactAnalyticsService {
  /** قراءة المؤشرات: IndexedDB أولاً (يعمل أوفلاين)، ثم localStorage، ثم القيم الأولية */
  async getMetrics(): Promise<ImpactSnapshot> {
    try {
      const cached = await offlineManager.getCached<ImpactMetrics>(STORE, RECORD_ID);
      if (cached) return { ...cached, id: RECORD_ID, source: "cache" };
    } catch { /* indexedDB غير متاح — نسقط للبديل */ }

    const local = getCachedData<ImpactMetrics | null>(CACHE_KEY, null);
    if (local) return { ...local, id: RECORD_ID, source: "cache" };

    return { ...defaultMetrics(), id: RECORD_ID, source: "seed" };
  }

  /** إعادة الحساب من بيانات التبرعات والمشاريع المخزنة محلياً */
  async recomputeFromLocal(): Promise<ImpactSnapshot> {
    const base = await this.getMetrics();
    try {
      const donations = await offlineManager.getAll<{ amount?: number; beneficiaries?: number }>("donations");
      const projects = await offlineManager.getAll<{ status?: string }>("projects");
      const volunteers = await offlineManager.getAll<unknown>("volunteers");

      const totalDonations = donations.reduce((sum, d) => sum + toNumber(d.amount), 0);
      const donationBeneficiaries = donations.reduce((sum, d) => sum + toNumber(d.beneficiaries), 0);
      const activeProjects = projects.filter((p) => p.status === "active").length;

      const computed = mergeMetrics(base, {
        totalDonations: Math.max(base.totalDonations, totalDonations),
        totalBeneficiaries: Math.max(base.totalBeneficiaries, base.totalBeneficiaries + donationBeneficiaries),
        totalVolunteers: Math.max(base.totalVolunteers, volunteers.length > 0 ? volunteers.length : base.totalVolunteers),
        totalProjects: Math.max(base.totalProjects, activeProjects > 0 ? activeProjects : base.totalProjects),
        averageDonation: donations.length > 0 ? Math.round((totalDonations / donations.length) * 100) / 100 : base.averageDonation,
        lastUpdated: new Date().toISOString(),
      });

      await this.persist(computed);
      return { ...computed, id: RECORD_ID, source: "computed" };
    } catch {
      return base;
    }
  }

  /** تسجيل تبرع جديد محلياً فوراً (أوفلاين-أولاً) مع جدولة المزامنة */
  async registerDonation(amount: number, beneficiaryCount = 1): Promise<ImpactSnapshot> {
    const current = await this.getMetrics();
    const totalDonations = current.totalDonations + Math.max(0, amount);
    const updated: ImpactMetrics = {
      ...current,
      totalDonations,
      totalBeneficiaries: current.totalBeneficiaries + Math.max(0, beneficiaryCount),
      averageDonation: totalDonations > 0 ? Math.round(totalDonations / Math.max(1, totalDonations / Math.max(1, amount))) : current.averageDonation,
      lastUpdated: new Date().toISOString(),
    };
    await this.persist(updated);
    await this.scheduleSync(updated);
    return { ...updated, id: RECORD_ID, source: "computed" };
  }

  async registerVolunteer(): Promise<ImpactSnapshot> {
    const current = await this.getMetrics();
    const updated: ImpactMetrics = {
      ...current,
      totalVolunteers: current.totalVolunteers + 1,
      lastUpdated: new Date().toISOString(),
    };
    await this.persist(updated);
    await this.scheduleSync(updated);
    return { ...updated, id: RECORD_ID, source: "computed" };
  }

  /** مزامنة لقطة المؤشرات إلى قاعدة Neon عبر /api (تعمل فقط عند الاتصال) */
  async syncNow(snapshot?: ImpactMetrics): Promise<boolean> {
    if (typeof navigator !== "undefined" && !navigator.onLine) return false;
    try {
      const payload = snapshot ?? (await this.getMetrics());
      await fetchWithRetry<{ ok: boolean }>("/api/impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, syncedAt: new Date().toISOString() }),
        timeoutMs: 12000,
      }, 2);
      return true;
    } catch {
      return false;
    }
  }

  private async persist(metrics: ImpactMetrics): Promise<void> {
    setCachedData(CACHE_KEY, metrics, SNAPSHOT_TTL);
    try {
      await offlineManager.cacheWithTTL(STORE, RECORD_ID, metrics, SNAPSHOT_TTL);
    } catch { /* IndexedDB اختياري */ }
  }

  private async scheduleSync(metrics: ImpactMetrics): Promise<void> {
    try {
      await backgroundSync(SYNC_TAG, metrics);
    } catch { /* ignore */ }
    if (typeof navigator === "undefined" || navigator.onLine) {
      void this.syncNow(metrics);
    }
  }
}

export const impactAnalyticsService = new ImpactAnalyticsService();
