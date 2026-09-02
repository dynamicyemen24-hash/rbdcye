// Admin Page - Standalone Admin Dashboard Route
// Protected route - requires authentication
import { lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AdminDashboard } from "@/app/components/AdminDashboard";
import { useAuth } from "@/features/auth/contexts/AuthContext";

// Lazy load heavy admin components
const MessagesPage = lazy(() => import("@/features/admin/pages/MessagesPage"));

// Loading skeleton for admin
function AdminLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-10 bg-[var(--muted)] rounded-lg w-1/3"></div>
            <div className="h-10 bg-[var(--muted)] rounded-lg w-32"></div>
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={`admin-stat-${i}`} className="bg-white rounded-xl p-6 border border-[var(--border)]">
                <div className="h-4 bg-[var(--muted)] rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-[var(--muted)] rounded w-3/4"></div>
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="h-6 bg-[var(--muted)] rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`admin-table-row-${i}`} className="h-12 bg-[var(--muted)] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Auth Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <AdminLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default function AdminPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const tabFromUrl = urlParams.get('tab');
  
  const renderContent = () => {
    if (tabFromUrl === 'messages') {
      return <MessagesPage />;
    }
    return <AdminDashboard onClose={() => {}} />;
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AuthGuard>
        <Suspense fallback={<AdminLoadingSkeleton />}>
          {renderContent()}
        </Suspense>
      </AuthGuard>
    </div>
  );
}


