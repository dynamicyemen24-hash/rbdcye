import React, {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

/**
 * ============================================================================
 * Production Error Boundary
 * ============================================================================
 *
 * Responsibilities:
 * - Catch render/lifecycle errors in descendant React components.
 * - Provide an accessible fallback UI.
 * - Support controlled recovery through resetKeys.
 * - Support retry and full-page reload strategies.
 * - Expose errors to an application-level observability layer.
 * - Never silently swallow production failures.
 *
 * Important:
 * Error Boundaries do NOT catch:
 * - Event handler errors
 * - setTimeout/setInterval errors
 * - Errors inside arbitrary async callbacks
 * - Server-side rendering errors
 * - Errors thrown by the ErrorBoundary itself
 *
 * Those cases require their own error-handling mechanisms.
 */

export interface ErrorBoundaryErrorContext {
  error: Error;
  errorInfo?: ErrorInfo;
  componentStack?: string;
  boundaryName?: string;
  timestamp: string;
  source: "react-error-boundary";
}

export interface ErrorBoundaryProps {
  children: ReactNode;

  /**
   * Optional custom fallback.
   *
   * If a function is supplied, it receives the error and reset callback.
   */
  fallback?: ReactNode | ErrorFallbackRenderer;

  /**
   * Optional boundary identifier used for diagnostics.
   */
  boundaryName?: string;

  /**
   * Optional values that should reset the boundary when changed.
   *
   * Example:
   * resetKeys={[route.pathname, userId]}
   */
  resetKeys?: readonly unknown[];

  /**
   * Called after React catches an error.
   */
  onError?: (context: ErrorBoundaryErrorContext) => void;

  /**
   * Called after a successful boundary reset.
   */
  onReset?: () => void;

  /**
   * Whether the fallback should offer a full page reload.
   */
  allowReload?: boolean;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  reloadPage: () => void;
  allowReload: boolean;
}

export type ErrorFallbackRenderer = (
  props: ErrorFallbackProps,
) => ReactNode;

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ============================================================================
 * Safe Error Normalization
 * ============================================================================
 */

function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string") {
    return new Error(error);
  }

  try {
    return new Error(
      `Unknown application error: ${JSON.stringify(error)}`,
    );
  } catch {
    return new Error("Unknown application error");
  }
}

/**
 * ============================================================================
 * Error Key Comparison
 * ============================================================================
 *
 * React Error Boundaries often need to recover when the route,
 * resource, or entity being rendered changes.
 *
 * We intentionally use Object.is rather than deep comparison.
 */

function hasResetKeysChanged(
  previous: readonly unknown[] | undefined,
  next: readonly unknown[] | undefined,
): boolean {
  if (previous === next) {
    return false;
  }

  if (!previous || !next) {
    return Boolean(previous) !== Boolean(next);
  }

  if (previous.length !== next.length) {
    return true;
  }

  for (let index = 0; index < previous.length; index += 1) {
    if (!Object.is(previous[index], next[index])) {
      return true;
    }
  }

  return false;
}

/**
 * ============================================================================
 * Default Fallback
 * ============================================================================
 */

function DefaultErrorFallback({
  resetErrorBoundary,
  reloadPage,
  allowReload,
}: ErrorFallbackProps) {
  return (
    <main
      role="main"
      aria-labelledby="application-error-title"
      className="
        min-h-[100svh]
        min-h-[100dvh]
        w-full
        bg-[var(--background)]
        text-[var(--foreground)]
        px-4
        py-8
        sm:px-6
        lg:px-8
        flex
        items-center
        justify-center
      "
    >
      <section
        role="alert"
        aria-describedby="application-error-description"
        className="
          w-full
          max-w-xl
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          p-6
          shadow-lg
          sm:p-8
          text-center
        "
      >
        <div
          aria-hidden="true"
          className="
            mx-auto
            mb-5
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[color-mix(in_srgb,var(--destructive)_12%,transparent)]
            text-[var(--destructive)]
          "
        >
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.3 3.6 2.8 17a2 2 0 0 0 1.75 3h14.9a2 2 0 0 0 1.75-3l-7.5-13.4a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>

        <h1
          id="application-error-title"
          className="
            text-xl
            font-bold
            leading-tight
            sm:text-2xl
          "
        >
          حدث خطأ غير متوقع
        </h1>

        <p
          id="application-error-description"
          className="
            mx-auto
            mt-3
            max-w-lg
            text-sm
            leading-7
            text-[var(--muted-foreground)]
            sm:text-base
          "
        >
          تعذر تحميل هذا الجزء من التطبيق بشكل صحيح.
          يمكنك المحاولة مرة أخرى، وإذا استمرت المشكلة يمكنك
          إعادة تحميل الصفحة.
        </p>

        <div
          className="
            mt-7
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:justify-center
          "
        >
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="
              inline-flex
              min-h-11
              min-w-11
              items-center
              justify-center
              rounded-xl
              bg-[var(--brand-green)]
              px-5
              py-3
              font-bold
              text-white
              transition-[background-color,transform]
              duration-150
              hover:bg-[var(--brand-green-light)]
              active:scale-[0.98]
              focus-visible:outline
              focus-visible:outline-3
              focus-visible:outline-offset-3
              focus-visible:outline-[var(--brand-green)]
            "
          >
            حاول مرة أخرى
          </button>

          {allowReload && (
            <button
              type="button"
              onClick={reloadPage}
              className="
                inline-flex
                min-h-11
                min-w-11
                items-center
                justify-center
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                px-5
                py-3
                font-bold
                text-[var(--foreground)]
                transition-[background-color,transform]
                duration-150
                hover:bg-[var(--muted)]
                active:scale-[0.98]
                focus-visible:outline
                focus-visible:outline-3
                focus-visible:outline-offset-3
                focus-visible:outline-[var(--brand-green)]
              "
            >
              إعادة تحميل الصفحة
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

/**
 * ============================================================================
 * Production Error Boundary
 * ============================================================================
 */

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private previousResetKeys?: readonly unknown[];

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };

    this.previousResetKeys = props.resetKeys;
  }

  /**
   * React invokes this before rendering the fallback.
   */
  static getDerivedStateFromError(
    error: Error,
  ): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error: normalizeError(error),
    };
  }

  /**
   * React invokes this after the fallback state has been committed.
   */
  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo,
  ): void {
    const normalizedError = normalizeError(error);

    this.setState({
      error: normalizedError,
      errorInfo,
    });

    const context: ErrorBoundaryErrorContext = {
      error: normalizedError,
      errorInfo,
      componentStack: errorInfo.componentStack ?? undefined,
      boundaryName: this.props.boundaryName,
      timestamp: new Date().toISOString(),
      source: "react-error-boundary",
    };

    /**
     * Never silently swallow errors.
     *
     * The application may connect `onError` to:
     * - Sentry
     * - OpenTelemetry
     * - Cloudflare observability
     * - an internal logging service
     * - a local development logger
     *
     * Do not send sensitive user data by default.
     */
    this.props.onError?.(context);

    /**
     * Development diagnostics only.
     *
     * Avoid logging the complete error object in production
     * if it can expose sensitive information.
     */
    if (import.meta.env?.DEV) {
      console.error(
        `[ErrorBoundary${this.props.boundaryName
          ? `:${this.props.boundaryName}`
          : ""}]`,
        normalizedError,
        errorInfo,
      );
    }
  }

  /**
   * Reset the boundary when its logical resource changes.
   */
  componentDidUpdate(
    prevProps: ErrorBoundaryProps,
  ): void {
    const currentKeys = this.props.resetKeys;

    if (
      this.state.hasError &&
      hasResetKeysChanged(
        this.previousResetKeys,
        currentKeys,
      )
    ) {
      this.resetErrorBoundary();
    }

    this.previousResetKeys = currentKeys;

    /**
     * Keep the comparison based on previous props as a defensive
     * compatibility check for consumers that mutate arrays.
     */
    if (
      this.state.hasError &&
      prevProps.resetKeys !== currentKeys &&
      hasResetKeysChanged(
        prevProps.resetKeys,
        currentKeys,
      )
    ) {
      this.resetErrorBoundary();
    }
  }

  /**
   * Clear the boundary and return to the normal render tree.
   */
  private resetErrorBoundary = (): void => {
    this.setState(
      {
        hasError: false,
        error: null,
        errorInfo: null,
      },
      () => {
        this.props.onReset?.();
      },
    );
  };

  /**
   * Full page recovery.
   *
   * We intentionally use location.reload() instead of attempting
   * to reconstruct application state manually.
   */
  private reloadPage = (): void => {
    if (typeof window === "undefined") {
      return;
    }

    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError || !this.state.error) {
      return this.props.children;
    }

    const fallbackProps: ErrorFallbackProps = {
      error: this.state.error,
      resetErrorBoundary: this.resetErrorBoundary,
      reloadPage: this.reloadPage,
      allowReload: this.props.allowReload ?? true,
    };

    if (typeof this.props.fallback === "function") {
      return this.props.fallback(fallbackProps);
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return <DefaultErrorFallback {...fallbackProps} />;
  }
}

/**
 * ============================================================================
 * Global Error Handling
 * ============================================================================
 *
 * IMPORTANT:
 *
 * Global handlers should OBSERVE and REPORT errors.
 * They should NOT blindly call preventDefault().
 *
 * Calling preventDefault() globally can:
 * - hide useful browser diagnostics
 * - interfere with debugging
 * - suppress resource error reporting
 * - make production incidents harder to investigate
 */

export interface GlobalErrorHandlerOptions {
  onError?: (
    error: Error,
    context: {
      type: "error" | "unhandledrejection";
      event: ErrorEvent | PromiseRejectionEvent;
    },
  ) => void;
}

/**
 * Installs global error observers.
 *
 * Returns a cleanup function.
 */
export function setupGlobalErrorHandler(
  options: GlobalErrorHandlerOptions = {},
): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleError = (event: ErrorEvent): void => {
    const error = normalizeError(
      event.error ?? event.message ?? "Unknown global error",
    );

    options.onError?.(error, {
      type: "error",
      event,
    });

    /**
     * Do NOT call event.preventDefault().
     */
  };

  const handleUnhandledRejection = (
    event: PromiseRejectionEvent,
  ): void => {
    const error = normalizeError(event.reason);

    options.onError?.(error, {
      type: "unhandledrejection",
      event,
    });

    /**
     * Do NOT call event.preventDefault().
     *
     * The application may explicitly decide to suppress an error
     * only when it has a known, safe recovery strategy.
     */
  };

  window.addEventListener(
    "error",
    handleError,
    { capture: true },
  );

  window.addEventListener(
    "unhandledrejection",
    handleUnhandledRejection,
  );

  return () => {
    window.removeEventListener(
      "error",
      handleError,
      { capture: true },
    );

    window.removeEventListener(
      "unhandledrejection",
      handleUnhandledRejection,
    );
  };
}

/**
 * ============================================================================
 * Optional Root-Level Error Boundary
 * ============================================================================
 *
 * Keep the root boundary small and stable.
 *
 * More granular boundaries should normally be added around:
 * - routes
 * - dashboards
 * - complex widgets
 * - third-party integrations
 * - independently failing modules
 */

export function AppErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ErrorBoundary
      boundaryName="application-root"
      allowReload
    >
      {children}
    </ErrorBoundary>
  );
}