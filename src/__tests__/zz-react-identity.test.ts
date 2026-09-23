import { describe, it } from "vitest";
import { createRequire } from "node:module";

describe("react identity diagnostics", () => {
  it("checks require vs import identity", async () => {
    const req = createRequire(import.meta.url);
    const viaRequire = req("react") as Record<string, unknown>;
    const viaImport = (await import("react")) as Record<string, unknown>;
    const iv = (viaImport.default ?? viaImport) as Record<string, unknown>;
    const KEY =
      "__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE";

    console.log("DIAG2 import===require.default:", iv === viaRequire);
    console.log(
      "DIAG2 useState ref equal:",
      iv.useState === viaRequire.useState,
    );
    console.log("DIAG2 INTERNALS ref equal:", iv[KEY] === viaRequire[KEY]);
    console.log(
      "DIAG2 INTERNALS typeof:",
      typeof iv[KEY],
      typeof viaRequire[KEY],
    );
    console.log(
      "DIAG2 versions:",
      String(iv.version),
      String(viaRequire.version),
    );
    const rdc = await import("react-dom/client");
    console.log("DIAG2 rdc keys:", Object.keys(rdc).join(","));

    // RTL's world: RTL is inlined → same loader as this test's import path.
    const rtl = (await import("@testing-library/react")) as Record<
      string,
      unknown
    >;
    console.log("DIAG2 rtl keys sample:", Object.keys(rtl).slice(0, 5).join(","));
  });
});

