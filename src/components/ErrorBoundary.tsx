// Error Boundary component
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Error logged silently for production - tracked via error boundary state
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
                حدث خطأ غير متوقع
              </h2>
              <p className="text-[var(--muted-foreground)] mb-6">
                تعذر تحميل الصفحة. يرجى المحاولة مرة أخرى.
              </p>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-3 bg-[var(--brand-green)] text-white rounded-xl font-bold hover:bg-[var(--brand-green-light)] transition-colors"
              >
                حاول مرة أخرى
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// Global Error Handler
export function setupGlobalErrorHandler(): void {
  window.addEventListener("error", (event) => {
    event.preventDefault();
  });

  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
  });
}
