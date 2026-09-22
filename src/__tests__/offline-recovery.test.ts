import { describe, expect, it } from "vitest";
import { shouldResetDatabase } from "@/services/offline/offline-manager";

describe("shouldResetDatabase", () => {
  it("resets on version mismatch (downgrade / blocked upgrade)", () => {
    expect(shouldResetDatabase(new DOMException("Version mismatch", "VersionError"))).toBe(true);
  });

  it("resets on unknown/corruption errors", () => {
    expect(shouldResetDatabase(new DOMException("Corrupt database", "UnknownError"))).toBe(true);
    expect(shouldResetDatabase(new Error("Corrupted IndexedDB file"))).toBe(true);
  });

  it("never resets on transient or availability errors", () => {
    expect(shouldResetDatabase(new DOMException("Aborted", "AbortError"))).toBe(false);
    expect(shouldResetDatabase(new DOMException("Quota exceeded", "QuotaExceededError"))).toBe(false);
    expect(shouldResetDatabase(new Error("indexeddb-unavailable"))).toBe(false);
    expect(shouldResetDatabase(new Error("indexeddb-blocked"))).toBe(false);
    expect(shouldResetDatabase(new Error("indexeddb-open-failed"))).toBe(false);
  });

  it("never resets on non-error values", () => {
    expect(shouldResetDatabase(null)).toBe(false);
    expect(shouldResetDatabase(undefined)).toBe(false);
    expect(shouldResetDatabase("VersionError")).toBe(false);
    expect(shouldResetDatabase(42)).toBe(false);
  });
});
