// App Shell - Enterprise-grade with Performance Optimizations
import { lazy, Suspense, useCallback, memo } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import Navbar from "./components/Navbar";
import { NewsTicker } from "./components/NewsTicker";
import { PageProgress } from "./components/PageProgress";
import { InstallPrompt } from "./components/PWA/InstallPrompt";
import { StepScroll } from "./components/StepScroll";
import { UpdateNotification } from "./components/UpdateNotification";

// Lazy load all pages with better error handling
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.default })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.default })));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage").then(m => ({ default: m.default })));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage").then(m => ({ default: m.default })));
const PartnersPage = lazy(() => import("./pages/PartnersPage").then(m => ({ default: m.default })));
const MediaPage = lazy(() => import("./pages/MediaPage").then(m => ({ default: m.default })));
const ReportsPage = lazy(() => import("./pages/ReportsPage").then(m => ({ default: m.default })));
const TransparencyPage = lazy(() => import("./pages/TransparencyPage").then(m => ({ default: m.default })));
const VolunteerPage = lazy(() => import("./pages/VolunteerPage").then(m => ({ default: m.default })));
const ZakatPage = lazy(() => import("./pages/ZakatPage").then(m => ({ default: m.default })));
const DonatePage = lazy(() => import("./pages/DonatePage").then(m => ({ default: m.default })));
const AdminPage = lazy(() => import("./pages/AdminPage").then(m => ({ default: m.default })));
const SuccessStoriesPage = lazy(() => import("./pages/SuccessStoriesPage").then(m => ({ default: m.default })));
const NewsPage = lazy(() => import("./pages/NewsPage").then(m => ({ default: m.default })));
const ContactPage = lazy(() => import("./pages/ContactPage").then(m => ({ default: m.default })));
const EndowmentPage = lazy(() => import("./pages/EndowmentPage").then(m => ({ default: m.default })));
const LoginPage = lazy(() => import("./pages/index").then(m => ({ default: m.LoginPage })));
const DonorPortalPage = lazy(() => import("./pages/DonorPortalPage").then(m => ({ default: m.default })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.default })));

// Memoized Page Loader
const PageLoader = memo(function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]" dir="rtl">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-[var(--brand-green)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--muted-foreground)] text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
});

// Memoized Wrapper for lazy pages with error boundary
const PageWrapper = memo(function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
});

const AppContent = memo(function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.slice(1).split('/')[0];
  
  const setCurrentPage = useCallback((page: string) => {
    navigate(`/${page === 'home' ? '' : page}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <NewsTicker />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <UpdateNotification />
      <PageProgress />
      <InstallPrompt />
      
      <StepScroll />
      
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
          <Route path="/programs" element={<PageWrapper><ProgramsPage /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><ProjectsPage /></PageWrapper>} />
          <Route path="/success" element={<PageWrapper><SuccessStoriesPage /></PageWrapper>} />
          <Route path="/news" element={<PageWrapper><NewsPage /></PageWrapper>} />
          <Route path="/media" element={<PageWrapper><MediaPage /></PageWrapper>} />
          <Route path="/reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
          <Route path="/transparency" element={<PageWrapper><TransparencyPage /></PageWrapper>} />
          <Route path="/volunteer" element={<PageWrapper><VolunteerPage /></PageWrapper>} />
          <Route path="/zakat" element={<PageWrapper><ZakatPage /></PageWrapper>} />
          <Route path="/endowment" element={<PageWrapper><EndowmentPage /></PageWrapper>} />
          <Route path="/donate" element={<PageWrapper><DonatePage /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />
          <Route path="/partners" element={<PageWrapper><PartnersPage /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/donor" element={<PageWrapper><DonorPortalPage /></PageWrapper>} />
          <Route path="/admin/*" element={<PageWrapper><AdminPage /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><NotFoundPage /></PageWrapper>} />
        </Routes>
      </main>
      
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
});

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
