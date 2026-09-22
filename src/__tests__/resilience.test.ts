import { describe, expect, it, beforeEach } from "vitest";
import { isChunkLoadError, isFormInteractionActive, isStaleBuild, shouldAllowHardReload } from "@/utils/resilience";

describe("isChunkLoadError", () => {
  it("detects dynamic-import failures", () => {
    expect(isChunkLoadError("Failed to fetch dynamically imported module: /assets/js/X.js")).toBe(true);
  });

  it("detects chunk load failures", () => {
    expect(isChunkLoadError("Loading chunk vendor-react failed")).toBe(true);
    expect(isChunkLoadError("Loading CSS chunk 5 failed")).toBe(true);
  });

  it("detects module script failures", () => {
    expect(isChunkLoadError("Importing a module script failed.")).toBe(true);
  });

  it("rejects ordinary errors and empty input", () => {
    expect(isChunkLoadError("TypeError: Cannot read properties of null")).toBe(false);
    expect(isChunkLoadError("")).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
    expect(isChunkLoadError(undefined)).toBe(false);
    expect(isChunkLoadError(42)).toBe(false);
  });
});

describe("isStaleBuild", () => {
  it("returns false for identical builds", () => {
    expect(
      isStaleBuild("2.1.0+2026-09-18T00:00:00.000Z", {
        version: "2.1.0",
        buildTime: "2026-09-18T00:00:00.000Z",
      }),
    ).toBe(false);
  });

  it("returns true when version or buildTime differs", () => {
    expect(
      isStaleBuild("2.1.0+2026-09-18T00:00:00.000Z", {
        version: "2.1.0",
        buildTime: "2026-09-18T01:00:00.000Z",
      }),
    ).toBe(true);
    expect(
      isStaleBuild("2.1.0+2026-09-18T00:00:00.000Z", {
        version: "2.2.0",
        buildTime: "2026-09-18T00:00:00.000Z",
      }),
    ).toBe(true);
  });

  it("returns false when deployed info is missing or running id unknown", () => {
    expect(isStaleBuild("2.1.0+t", null)).toBe(false);
    expect(isStaleBuild("unknown", { version: "2.1.0", buildTime: "t" })).toBe(false);
    expect(isStaleBuild("", { version: "2.1.0", buildTime: "t" })).toBe(false);
  });
});

describe("shouldAllowHardReload", () => {
  it("allows the first reload", () => {
    expect(shouldAllowHardReload(null, 0, 1_000_000)).toBe(true);
  });

  it("blocks reloads inside the cooldown window", () => {
    expect(shouldAllowHardReload(1_000_000, 1, 1_000_005)).toBe(false);
  });

  it("allows reloads after the cooldown window", () => {
    expect(shouldAllowHardReload(1_000_000, 1, 1_000_000 + 15_000)).toBe(true);
  });

  it("blocks reloads after the session budget is exhausted", () => {
    expect(shouldAllowHardReload(null, 3, 1_000_000)).toBe(false);
    expect(shouldAllowHardReload(0, 99, 9_999_999)).toBe(false);
  });
});

describe("isFormInteractionActive", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("is inactive on a page without forms", () => {
    expect(isFormInteractionActive()).toBe(false);
  });

  it("is inactive when form fields are empty", () => {
    document.body.innerHTML =
      '<form><input id="a" type="text" value=""><textarea></textarea></form>';
    (document.activeElement as HTMLElement | null)?.blur?.();
    expect(isFormInteractionActive()).toBe(false);
  });

  it("is active when a field holds a value", () => {
    document.body.innerHTML = '<form><input id="a" type="text" value="0"></form>';
    expect(isFormInteractionActive()).toBe(true);
  });

  it("is active when a field is focused", () => {
    document.body.innerHTML = '<form><input id="a" type="text" value=""></form>';
    document.getElementById("a")?.focus();
    expect(isFormInteractionActive()).toBe(true);
  });

  it("ignores hidden inputs", () => {
    document.body.innerHTML =
      '<form><input type="hidden" value="csrf-token"><input type="text" value=""></form>';
    (document.activeElement as HTMLElement | null)?.blur?.();
    expect(isFormInteractionActive()).toBe(false);
  });

  it("is active for checked checkboxes", () => {
    document.body.innerHTML = '<form><input type="checkbox" checked></form>';
    expect(isFormInteractionActive()).toBe(true);
  });
});
