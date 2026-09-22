// Self-healing & update enforcement — مناعة ذاتية وفرض التحديثات
// Makes the app stronger and smarter: recovers from chunk/SW/IndexedDB failures
// and enforces newly deployed versions instead of serving stale bundles.
declare const __APP_VERSION__: string | undefined;
declare const __APP_BUILD_TIME__: string | undefined;

const RELOAD_STAMP_KEY = "rbdcye:hard-reload-at";
const RELOAD_COUNT_KEY = "rbdcye:hard-reload-count";
const RELOAD_COOLDOWN_MS = 15_000;
const MAX_RELOADS_PER_SESSION = 3;
const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;
const VERSION_FETCH_TIMEOUT_MS = 8_000;

export interface DeployedBuild {
  version: string;
  buildTime: string;
}

// ---- Pure helpers (unit-tested) ----

const CHUNK_ERROR_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /loading chunk [\w-]+ failed/i,
  /importing a module script failed/i,
  /unable to preload css/i,
  /chunkloaderror/i,
  /loading css chunk/i,
];

/** Detect stale-chunk failures (new deploy invalidated old hashed bundles). */
export function isChunkLoadError(message: unknown): boolean {
  if (typeof message !== "string" || message.length === 0) return false;
  return CHUNK_ERROR_PATTERNS.some((re) => re.test(message));
}

/** True when the deployed build differs from the running one. */
export function isStaleBuild(runningBuildId: string, deployed: DeployedBuild | null): boolean {
  if (!deployed || !runningBuildId || runningBuildId === "unknown") return false;
  if (!deployed.version || !deployed.buildTime) return false;
  return `${deployed.version}+${deployed.buildTime}` !== runningBuildId;
}

/** Cooldown + budget guard so auto-reload can never loop forever. */
export function shouldAllowHardReload(
  lastReloadAt: number | null,
  reloadCount: number,
  now: number,
): boolean {
  if (reloadCount >= MAX_RELOADS_PER_SESSION) return false;
  if (lastReloadAt !== null && now - lastReloadAt < RELOAD_COOLDOWN_MS) return false;
  return true;
}

/**
 * True while the user is actively interacting with a form (focused field or
 * entered data). Forced update reloads must defer in that case — yanking the
 * page mid-donation would destroy user input. Pure + unit-tested.
 */
export function isFormInteractionActive(root?: ParentNode): boolean {
  try {
    const doc = root ?? (typeof document !== "undefined" ? document : null);
    if (!doc) return false;
    const ae = (doc as Document).activeElement;
    if (ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)) return true;
    const fields = (doc as Document).querySelectorAll("form input, form textarea, form select");
    for (const el of fields) {
      const input = el as HTMLInputElement;
      if (input.type === "hidden") continue;
      if (input.type === "checkbox" || input.type === "radio") {
        if (input.checked) return true;
        continue;
      }
      if (typeof input.value === "string" && input.value.trim() !== "") return true;
    }
  } catch {
    // DOM inspection must never throw
  }
  return false;
}

// ---- Runtime ----

/** Build id baked in at compile time via vite `define`. */
export function runningBuildId(): string {
  let version: string | null = null;
  let buildTime: string | null = null;
  try {
    if (typeof __APP_VERSION__ !== "undefined" && __APP_VERSION__) version = __APP_VERSION__;
  } catch {
    version = null;
  }
  try {
    if (typeof __APP_BUILD_TIME__ !== "undefined" && __APP_BUILD_TIME__) buildTime = __APP_BUILD_TIME__;
  } catch {
    buildTime = null;
  }
  if (!version || !buildTime) return "unknown";
  return `${version}+${buildTime}`;
}

function readSessionNum(key: string): number | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/**
 * Hard reload with loop protection (cooldown + max 3 per session).
 * Uses location.replace with a cache-busting param so stale HTML is never reused.
 * Returns true when a reload was triggered.
 */
export function hardReload(reason: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const now = Date.now();
    const last = readSessionNum(RELOAD_STAMP_KEY);
    const count = readSessionNum(RELOAD_COUNT_KEY) ?? 0;
    if (!shouldAllowHardReload(last, count, now)) return false;
    try {
      sessionStorage.setItem(RELOAD_STAMP_KEY, String(now));
      sessionStorage.setItem(RELOAD_COUNT_KEY, String(count + 1));
    } catch {
      // Storage unavailable — proceed; loop risk is bounded by SW/cache refresh
    }
    window.dispatchEvent(new CustomEvent("rbdcye:hard-reload", { detail: { reason } }));
  } catch {
    return false;
  }
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("rbdcye-refresh", String(Date.now()));
    window.location.replace(url.toString());
  } catch {
    window.location.reload();
  }
  return true;
}

/** Guarantee the React mount point exists — self-repairs a missing #root (React #299). */
export function ensureRootElement(id = "root"): HTMLElement | null {
  if (typeof document === "undefined") return null;
  let el = document.getElementById(id);
  if (el) return el;
  el = document.createElement("div");
  el.id = id;
  const host = document.getElementById("main-content") ?? document.body;
  host.appendChild(el);
  return el;
}

/** Install global listeners that auto-recover from stale-chunk load failures. */
let chunkRecoveryInstalled = false;
export function installChunkErrorRecovery(): void {
  if (typeof window === "undefined" || chunkRecoveryInstalled) return;
  chunkRecoveryInstalled = true;

  window.addEventListener(
    "error",
    (event) => {
      try {
        const errEvent = event as ErrorEvent;
        const msg = errEvent.message || (errEvent.error instanceof Error ? errEvent.error.message : "");
        const target = errEvent.target as (HTMLElement & { src?: string; href?: string }) | null;
        const resourceUrl = target?.src ?? target?.href ?? "";
        const isAppBundle = /\/assets\/(js|css)\//.test(resourceUrl);
        if (isChunkLoadError(msg) || (isAppBundle && !msg)) {
          hardReload("chunk-error");
        }
      } catch {
        // Listener must never throw
      }
    },
    true,
  );

  window.addEventListener(
    "unhandledrejection",
    (event) => {
      try {
        const reason = (event as PromiseRejectionEvent).reason;
        const msg =
          reason instanceof Error ? `${reason.message}\n${reason.stack ?? ""}` : String(reason ?? "");
        if (isChunkLoadError(msg)) hardReload("chunk-error");
      } catch {
        // Listener must never throw
      }
    },
    true,
  );
}

/** Fetch the currently deployed build id (always bypasses HTTP cache). */
export async function fetchDeployedBuild(): Promise<DeployedBuild | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), VERSION_FETCH_TIMEOUT_MS);
    try {
      const res = await fetch("/version.json", { cache: "no-store", signal: controller.signal });
      if (!res.ok) return null;
      const data = (await res.json()) as Partial<DeployedBuild>;
      if (typeof data.version === "string" && typeof data.buildTime === "string") {
        return { version: data.version, buildTime: data.buildTime };
      }
      return null;
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return null;
  }
}

/** Ask the waiting Service Worker to take over; resolves true when control changes. */
async function waitForControllerChange(timeoutMs: number): Promise<boolean> {
  try {
    return await new Promise<boolean>((resolve) => {
      const timer = setTimeout(() => resolve(false), timeoutMs);
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          clearTimeout(timer);
          resolve(true);
        },
        { once: true },
      );
    });
  } catch {
    return false;
  }
}

/**
 * Bring the Service Worker up to date:
 * - "activated" — a waiting worker took control (page should reload into it)
 * - "current" — no update pending (a plain reload suffices)
 * - "broken" — update failed/stuck (caller should nuke SW + caches, then reload)
 */
export async function updateServiceWorker(timeoutMs = 5000): Promise<"activated" | "current" | "broken"> {
  if (!("serviceWorker" in navigator)) return "current";
  try {
    const registration = await navigator.serviceWorker.ready;
    let target = registration.waiting ?? registration.installing;
    if (!target) {
      try {
        await registration.update();
      } catch {
        return "broken";
      }
      target = registration.waiting ?? registration.installing;
      if (!target) return "current";
    }
    try {
      target.postMessage({ type: "SKIP_WAITING" });
    } catch {
      return "broken";
    }
    return (await waitForControllerChange(timeoutMs)) ? "activated" : "broken";
  } catch {
    return "broken";
  }
}

/** Last-resort repair: unregister all Service Workers and wipe all caches. */
export async function nukeServiceWorkersAndCaches(): Promise<void> {
  try {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
    }
  } catch {
    // ignore — proceed to cache wipe
  }
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k).catch(() => false)));
    }
  } catch {
    // ignore — reload will still fetch fresh HTML
  }
}

async function checkAndEnforce(): Promise<void> {
  try {
    if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    const deployed = await fetchDeployedBuild();
    if (isStaleBuild(runningBuildId(), deployed)) {
      // Never yank the page while the user is filling a form — the 5-minute
      // interval retries once their input is submitted or cleared.
      if (isFormInteractionActive()) return;
      // Nuke SW + caches only when the worker is genuinely stuck; a plain
      // reload suffices when it is already current.
      if ((await updateServiceWorker()) === "broken") {
        await nukeServiceWorkersAndCaches();
      }
      hardReload("version-mismatch");
    }
  } catch {
    // Version enforcement must never break the app
  }
}

/**
 * Enforce deployed updates: checks /version.json on boot, on return-to-tab,
 * on reconnect, and every 5 minutes — then activates the new SW and reloads.
 * PROD only; dev builds are never force-reloaded.
 */
let versionEnforced = false;
export function enforceAppVersion(): void {
  if (typeof window === "undefined" || versionEnforced) return;
  versionEnforced = true;
  try {
    if (!import.meta.env.PROD) return;
  } catch {
    return;
  }
  void checkAndEnforce();
  window.addEventListener("online", () => void checkAndEnforce());
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void checkAndEnforce();
  });
  setInterval(() => void checkAndEnforce(), VERSION_CHECK_INTERVAL_MS);
}
