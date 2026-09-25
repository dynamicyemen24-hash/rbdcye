import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

describe("React module identity", () => {
  it("uses one React instance for ESM and CommonJS test execution", async () => {
    const require = createRequire(import.meta.url);
    const commonJsReact = require("react") as Record<string, unknown>;
    const esmReact = (await import("react")) as Record<string, unknown>;
    const importedReact = (esmReact.default ?? esmReact) as Record<string, unknown>;

    expect(importedReact).toBe(commonJsReact);
    expect(importedReact.useState).toBe(commonJsReact.useState);
  });
});
