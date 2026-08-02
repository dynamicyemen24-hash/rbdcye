/**
 * Zakat & Financial Business Logic Tests
 * اختبارات آليّة لحاسبة الزكاة والمدخلات
 */

import { validateEmail, validatePhone, formatCurrency } from '@/shared/utils/validation';

import { describe, it, expect, runTests } from '../testingFramework';

const GOLD_PRICE_PER_GRAM = 30; // 30 OMR
const GOLD_NISAB_GRAMS = 85;
const MONEY_NISAB_OMR = GOLD_NISAB_GRAMS * GOLD_PRICE_PER_GRAM; // 2550 OMR
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

describe('Zakat & Financial Calculations Suite', () => {
  it('calculates money zakat correctly above nisab', () => {
    const cash = 10000;
    const expectedZakat = 10000 * 0.025;
    const result = calculateMoneyZakat(cash);
    expect(result).toBe(expectedZakat);
  });

  it('returns 0 money zakat when below nisab threshold', () => {
    const cash = 1000;
    const result = calculateMoneyZakat(cash);
    expect(result).toBe(0);
  });

  it('calculates gold zakat correctly above 85 grams', () => {
    const goldGrams = 100;
    const expectedValue = 100 * GOLD_PRICE_PER_GRAM * 0.025;
    const result = calculateGoldZakat(goldGrams);
    expect(result).toBe(expectedValue);
  });

  it('returns 0 gold zakat when under 85 grams', () => {
    const goldGrams = 50;
    const result = calculateGoldZakat(goldGrams);
    expect(result).toBe(0);
  });

  it('calculates Fitr zakat proportionally per family member', () => {
    const familyCount = 4;
    const expectedFitr = 4 * 2.5;
    const result = calculateFitrZakat(familyCount);
    expect(result).toBe(expectedFitr);
  });

  it('validates email address formats correctly', () => {
    expect(validateEmail('user@example.com')).toBeTruthy();
    expect(validateEmail('invalid-email')).toBeFalsy();
  });

  it('validates phone number and formats currency', () => {
    expect(validatePhone('+967771234567')).toBeTruthy();
    expect(formatCurrency(100, 'YER')).toContain('YER');
  });
});

// Run test suite
runTests();
