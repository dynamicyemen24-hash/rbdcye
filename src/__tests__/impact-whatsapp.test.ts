import { describe, it, expect, beforeEach } from "vitest";

import {
  calcGrowthRate,
  impactAnalyticsService,
  mergeMetrics,
} from "@/services/impact/impact-analytics.service";
import {
  buildTemplateMessage,
  buildWhatsAppLink,
  isValidPhone,
  normalizeYePhone,
  whatsappService,
} from "@/services/notifications/whatsapp.service";

describe("Impact Analytics", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("falls back to seed metrics when no cache exists", async () => {
    const snapshot = await impactAnalyticsService.getMetrics();
    expect(snapshot.source).toBe("seed");
    expect(snapshot.totalBeneficiaries).toBeGreaterThan(0);
    expect(snapshot.totalProjects).toBeGreaterThan(0);
  });

  it("merges metrics keeping the maximum cumulative values", () => {
    const merged = mergeMetrics(
      {
        totalBeneficiaries: 100,
        totalDonations: 500,
        totalVolunteers: 10,
        totalProjects: 3,
        averageDonation: 50,
        growthRate: 5,
        lastUpdated: "2026-01-01T00:00:00.000Z",
      },
      { totalBeneficiaries: 150, totalDonations: 400 },
    );
    expect(merged.totalBeneficiaries).toBe(150);
    expect(merged.totalDonations).toBe(500);
  });

  it("calculates growth rate safely", () => {
    expect(calcGrowthRate(120, 100)).toBe(20);
    expect(calcGrowthRate(100, 0)).toBe(0);
    expect(calcGrowthRate(100, -5)).toBe(0);
  });

  it("registers donations and volunteers locally (offline-first)", async () => {
    const afterDonation = await impactAnalyticsService.registerDonation(50, 2);
    expect(afterDonation.totalDonations).toBeGreaterThanOrEqual(50);

    const afterVolunteer = await impactAnalyticsService.registerVolunteer();
    expect(afterVolunteer.totalVolunteers).toBeGreaterThan(0);
  });
});

describe("WhatsApp Service", () => {
  it("normalizes Yemeni phone numbers", () => {
    expect(normalizeYePhone("771234567")).toBe("+967771234567");
    expect(normalizeYePhone("+967771234567")).toBe("+967771234567");
    expect(normalizeYePhone("00967771234567")).toBe("+967771234567");
  });

  it("validates phone numbers", () => {
    expect(isValidPhone("+967771234567")).toBe(true);
    expect(isValidPhone("771234567")).toBe(true);
    expect(isValidPhone("123")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });

  it("builds wa.me links with encoded messages", () => {
    const link = buildWhatsAppLink("771234567", "مرحباً");
    expect(link.startsWith("https://wa.me/967771234567?text=")).toBe(true);
  });

  it("builds localized templates", () => {
    const thanks = buildTemplateMessage("donation-thanks", { name: "أحمد", amount: 50 });
    expect(thanks).toContain("أحمد");
    expect(thanks).toContain("50");

    const welcome = buildTemplateMessage("volunteer-welcome", { name: "سارة" });
    expect(welcome).toContain("سارة");
  });

  it("rejects invalid phones without network calls", async () => {
    const result = await whatsappService.sendViaServer("123", "general", {});
    expect(result.ok).toBe(false);
    expect(result.error).toBe("invalid-phone");
  });

  it("exposes the institution number", () => {
    expect(whatsappService.institutionNumber()).toContain("967");
  });
});
