import { ComponentType, lazy, LazyExoticComponent } from "react";

/**
 * Lazy loads a React component with automatic exponential retry
 * to handle temporary network dropouts, container redeployments,
 * or stale chunk hashes after deployment builds.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
  retries = 5,
  interval = 1000
): LazyExoticComponent<T> {
  return lazy(
    () =>
      new Promise<{ default: T }>((resolve, reject) => {
        const attempt = (remaining: number) => {
          componentImport()
            .then((res) => {
              if (typeof window !== "undefined") {
                window.sessionStorage.removeItem("chunk_retry_reloaded");
              }
              resolve(res);
            })
            .catch((error) => {
              // Check if error is a dynamic import / chunk load failure
              const isChunkError =
                error?.message?.includes("Failed to fetch dynamically imported module") ||
                error?.message?.includes("Importing a module script failed") ||
                error?.name === "ChunkLoadError";

              if (remaining <= 0) {
                // If this is a chunk loading error and we haven't reloaded the page yet for this session,
                // automatically reload to fetch fresh bundle manifests
                if (
                  isChunkError &&
                  typeof window !== "undefined" &&
                  !window.sessionStorage.getItem("chunk_retry_reloaded")
                ) {
                  window.sessionStorage.setItem("chunk_retry_reloaded", "true");
                  window.location.reload();
                  return;
                }
                reject(error);
                return;
              }
              setTimeout(() => {
                attempt(remaining - 1);
              }, interval);
            });
        };
        attempt(retries);
      })
  );
}

export default lazyWithRetry;
