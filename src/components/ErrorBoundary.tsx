import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export class ErrorBoundary extends Component<Props, State> {
  private requestId: string;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
    this.requestId = generateRequestId();
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);

    if (process.env.NODE_ENV === 'production') {
      console.error(
        `[ErrorBoundary:${this.requestId}]`,
        error.message,
        errorInfo.componentStack
      );
    }
  }

  handleRetry = () => {
    this.requestId = generateRequestId();
    this.setState((prev) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--secondary)]" dir="rtl">
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              عذراً، حدث خطأ غير متوقع
            </h2>
            <p className="text-[var(--muted-foreground)] mb-2">
              {this.state.error?.message || 'نعمل على إصلاح هذا الخطأ.'}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]/60 mb-6">
              معرّف الطلب: {this.requestId}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--brand-green)] text-white rounded-xl hover:bg-[var(--brand-green-light)] transition-colors"
                style={{ fontWeight: 600 }}
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                style={{ fontWeight: 600 }}
              >
                إعادة تحميل الصفحة
              </button>
            </div>
            {this.state.retryCount > 0 && (
              <p className="text-xs text-[var(--muted-foreground)]/50 mt-4">
                عدد المحاولات: {this.state.retryCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


