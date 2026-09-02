import { describe, it, expect } from "vitest";
import { validateEmail, validatePhone, formatCurrency } from "@/shared/utils/validation";

describe("Zakat Calculator Business Logic", () => {
  const GOLD_PRICE_PER_GRAM = 30;
  const GOLD_NISAB_GRAMS = 85;
  const MONEY_NISAB_OMR = GOLD_NISAB_GRAMS * GOLD_PRICE_PER_GRAM;
  const FITR_PER_PERSON_OMR = 2.5;

  function calculateMoneyZakat(amount: number): number {
    if (amount >= MONEY_NISAB_OMR) {
      return amount * 0.025;
    }
    return 0;
  }

  function calculateGoldZakat(weightGrams: number): number {
    if (weightGrams >= GOLD_NISAB_GRAMS) {
      return weightGrams * GOLD_PRICE_PER_GRAM * 0.025;
    }
    return 0;
  }

  function calculateFitrZakat(familyMembers: number): number {
    if (familyMembers < 1) return 0;
    return familyMembers * FITR_PER_PERSON_OMR;
  }

  describe("Money Zakat", () => {
    it("calculates zakat correctly above nisab", () => {
      expect(calculateMoneyZakat(10000)).toBe(250);
    });

    it("returns 0 below nisab", () => {
      expect(calculateMoneyZakat(1000)).toBe(0);
    });

    it("handles zero amount", () => {
      expect(calculateMoneyZakat(0)).toBe(0);
    });
  });

  describe("Gold Zakat", () => {
    it("calculates zakat correctly above 85 grams", () => {
      expect(calculateGoldZakat(100)).toBe(75);
    });

    it("returns 0 below nisab", () => {
      expect(calculateGoldZakat(50)).toBe(0);
    });

    it("returns 0 for 84 grams (just below nisab)", () => {
      expect(calculateGoldZakat(84)).toBe(0);
    });
  });

  describe("Fitr Zakat", () => {
    it("calculates correctly per family member", () => {
      expect(calculateFitrZakat(4)).toBe(10);
    });

    it("returns 0 for 0 members", () => {
      expect(calculateFitrZakat(0)).toBe(0);
    });

    it("handles single member", () => {
      expect(calculateFitrZakat(1)).toBe(2.5);
    });
  });

  describe("Validation Integration", () => {
    it("validates email formats", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("invalid-email")).toBe(false);
    });

    it("validates phone numbers", () => {
      expect(validatePhone("+967771234567")).toBe(true);
    });

    it("formats currency", () => {
      const result = formatCurrency(100, "YER");
      expect(result).toContain("YER");
    });
  });
});
