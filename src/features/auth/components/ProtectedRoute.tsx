import { useAuth } from '../contexts/AuthContext';

function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  return null; // Placeholder - routing handled by App.tsx
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredAction?: string;
}

export function ProtectedRoute({ children, requiredPermission, requiredAction }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]" style={{ direction: "rtl" }}>
        <div className="w-8 h-8 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && requiredAction && !hasPermission(requiredPermission, requiredAction)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]" style={{ direction: "rtl" }}>
        <div className="text-center p-8">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-[var(--foreground)] mb-2" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            غير مصرح لك بالوصول
          </h2>
          <p className="text-[var(--muted-foreground)]">
            ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

