// App Shell - Enterprise-grade with Performance Optimizations
import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense, useCallback, useState, useEffect, memo } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageSkeleton } from "@/components/LoadingSkeleton";
import { pageTransition } from "@/utils/animations";
import { prefersReducedMotionSync } from "@/utils/media";
import { reportWebVitals } from "@/utils/performance";

import { BackToTop } from "./components/BackToTop";
import CookieConsent from "./components/CookieConsent";
import { FixedDonateButton } from "./components/FixedDonateButton";
import { Footer } from "./components/Footer";
import { GlobalUtilityBar } from "./components/GlobalUtilityBar";
import { HeaderComponentsBar } from "./components/HeaderComponentsBar";
import Navbar from "./components/Navbar";
import { NewsTicker } from "./components/NewsTicker";
import { PageProgress } from "./components/PageProgress";
import { EnhancedInstallPrompt } from "./components/PWA/EnhancedInstallPrompt";
import { ScrollProgress } from "./components/ScrollProgress";
import SearchOverlay from "./components/SearchOverlay";
import { SocialProof } from "./components/SocialProof";
import { SocialProofToast } from "./components/SocialProofToast";
import { StepScroll } from "./components/StepScroll";
import OfflineIndicator from "./components/PWA/OfflineIndicator";
import { UpdateNotification } from "./components/UpdateNotification";
import { UrgencyBanner } from "./components/UrgencyBanner";


// Setup global error handling — log to console in dev, suppress in prod
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (import.meta.env.DEV) console.error("[GlobalError]", e.error);
    e.preventDefault();
  });
  window.addEventListener("unhandledrejection", (e) => {
    if (import.meta.env.DEV) console.error("[UnhandledRejection]", e.reason);
    e.preventDefault();
  });
  // Report Web Vitals in production
  reportWebVitals();
}

// Lazy load all pages with better error handling
const HomePage = lazy(() => import("./pages/HomePage").then((m) => ({ default: m.default })));
const AboutPage = lazy(() => import("./pages/AboutPage").then((m) => ({ default: m.default })));
const ProgramsPage = lazy(() =>
  import("./pages/ProgramsPage").then((m) => ({ default: m.default }))
);
const ProjectsPage = lazy(() =>
  import("./pages/ProjectsPage").then((m) => ({ default: m.default }))
);
const PartnersPage = lazy(() =>
  import("./pages/PartnersPage").then((m) => ({ default: m.default }))
);
const MediaPage = lazy(() => import("./pages/MediaPage").then((m) => ({ default: m.default })));
const ReportsPage = lazy(() => import("./pages/ReportsPage").then((m) => ({ default: m.default })));
const TransparencyPage = lazy(() =>
  import("./pages/TransparencyPage").then((m) => ({ default: m.default }))
);
const VolunteerPage = lazy(() =>
  import("./pages/VolunteerPage").then((m) => ({ default: m.default }))
);
const ZakatPage = lazy(() => import("./pages/ZakatPage").then((m) => ({ default: m.default })));
const DonatePage = lazy(() => import("./pages/DonatePage").then((m) => ({ default: m.default })));
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.default })));
const SuccessStoriesPage = lazy(() =>
  import("./pages/SuccessStoriesPage").then((m) => ({ default: m.default }))
);
const NewsPage = lazy(() => import("./pages/NewsPage").then((m) => ({ default: m.default })));
const ContactPage = lazy(() => import("./pages/ContactPage").then((m) => ({ default: m.default })));
const MessagesPage = lazy(() =>
  import("./pages/MessagesPage").then((m) => ({ default: m.default }))
);
const SubscriptionsPage = lazy(() =>
  import("./pages/SubscriptionsPage").then((m) => ({ default: m.default }))
);
const EndowmentPage = lazy(() =>
  import("./pages/EndowmentPage").then((m) => ({ default: m.default }))
);
const LoginPage = lazy(() => import("./pages/index").then((m) => ({ default: m.LoginPage })));
const DonorPortalPage = lazy(() =>
  import("./pages/DonorPortalPage").then((m) => ({ default: m.default }))
);
const PrivacyPolicyPage = lazy(() =>
  import("./pages/PrivacyPolicyPage").then((m) => ({ default: m.default }))
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.default }))
);

const BeneficiaryRequestPage = lazy(() =>
  import("./pages/BeneficiaryRequestPage").then((m) => ({ default: m.BeneficiaryRequestPage }))
);
const ComplaintsSuggestionPage = lazy(() =>
  import("./pages/ComplaintsSuggestionPage").then((m) => ({ default: m.ComplaintsSuggestionPage }))
);
const ServiceCatalogPage = lazy(() =>
  import("./pages/ServiceCatalogPage").then((m) => ({ default: m.ServiceCatalogPage }))
);
const CommunityImpactPage = lazy(() =>
  import("./pages/CommunityImpactPage").then((m) => ({ default: m.CommunityImpactPage }))
);
const HelpCenterPage = lazy(() =>
  import("./pages/HelpCenterPage").then((m) => ({ default: m.HelpCenterPage }))
);
const ZakatCalculatorPage = lazy(() =>
  import("./pages/ZakatCalculatorPage").then((m) => ({ default: m.default }))
);
const SadaqahJariyahPage = lazy(() =>
  import("./pages/SadaqahJariyahPage").then((m) => ({ default: m.default }))
);
const TrainingPage = lazy(() =>
  import("./pages/TrainingPage").then((m) => ({ default: m.default }))
);
const ImpactCenterPage = lazy(() =>
  import("./pages/ImpactCenterPage").then((m) => ({ default: m.default }))
);
const SmartAdvisorPage = lazy(() =>
  import("./pages/SmartAdvisorPage").then((m) => ({ default: m.default }))
);
const DonorPassportPage = lazy(() =>
  import("./pages/DonorPassportPage").then((m) => ({ default: m.default }))
);
const InteractiveMapPage = lazy(() =>
  import("./pages/InteractiveMapPage").then((m) => ({ default: m.default }))
);
const CorporatePage = lazy(() =>
  import("./pages/CorporatePage").then((m) => ({ default: m.default }))
);
const ImpactForBusinessPage = lazy(() =>
  import("./pages/ImpactForBusinessPage").then((m) => ({ default: m.default }))
);
const DonorJourneyPage = lazy(() =>
  import("./pages/DonorJourneyPage").then((m) => ({ default: m.default }))
);
const CampaignsPage = lazy(() =>
  import("./pages/CampaignsPage").then((m) => ({ default: m.default }))
);
const MajorDonorsPage = lazy(() =>
  import("./pages/MajorDonorsPage").then((m) => ({ default: m.default }))
);
const ImpactEnginePage = lazy(() =>
  import("./pages/ImpactEnginePage").then((m) => ({ default: m.default }))
);

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

// Memoized Wrapper for lazy pages with smooth transitions
const PageWrapper = memo(function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </motion.div>
  );
});

const AppContent = memo(function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const currentPage = location.pathname === "/" ? "home" : location.pathname.slice(1).split("/")[0];

  const setCurrentPage = useCallback(
    (page: string) => {
      // Respect users who prefer reduced motion: skip the transition entirely
      const reduced = prefersReducedMotionSync();
      const go = () => {
        navigate(`/${page === "home" ? "" : page}`, { replace: false });
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- precise: any retained for Sanity PortableText dynamic — typed via unknown in v3.2
      const doc = document as any as { startViewTransition?: (cb: () => void) => void };
      if (!reduced && doc.startViewTransition) doc.startViewTransition(go);
      else go();
    },
    [navigate]
  );

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    name: "مؤسسة رحماء بينهم للإغاثة والتنمية",
    alternateName: "رحماء بينهم",
    legalName: "مؤسسة رحماء بينهم للإغاثة والتنمية باليمن",
    url: "https://rbdcye.org",
    logo: "https://rbdcye.org/logo.svg",
    description: "مؤسسة إنسانية تنموية مستقلة مرخصة برقم ٤٨٢ باليمن — إغاثة، تعليم، مياه، تنمية مستدامة",
    foundingDate: "2014",
    areaServed: { "@type": "Country", name: "اليمن" },
    address: {
      "@type": "PostalAddress",
      addressCountry: "YE",
      addressLocality: "صنعاء",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+967-780-777-007",
      contactType: "customer service",
      email: "info@rbdcye.org",
    },
    sameAs: [
      "https://facebook.com/rbdcye",
      "https://twitter.com/rbdcye",
      "https://youtube.com/@rbdcye",
      "https://instagram.com/rbdcye",
    ],
  };

  // Keyboard shortcut: Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Signal first paint — the boot splash (index.html #app-loader) hides instantly.
  // Double rAF fires after the browser has painted this shell.
  useEffect(() => {
    let cancelled = false;
    const notify = () => {
      if (cancelled) return;
      window.dispatchEvent(new CustomEvent("rbdcye:app-ready"));
    };
    if (typeof requestAnimationFrame === "function") {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(notify);
      });
      return () => {
        cancelled = true;
        cancelAnimationFrame(raf);
      };
    }
    notify();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeaderComponentsBar onNavigate={setCurrentPage} />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <NewsTicker />
      <UpdateNotification />
      <OfflineIndicator />
      <PageProgress />
      <EnhancedInstallPrompt />

      <StepScroll />

      <main id="main-content" className="min-h-screen">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <HomePage />
                </PageWrapper>
              }
            />
            <Route
              path="/about"
              element={
                <PageWrapper>
                  <AboutPage />
                </PageWrapper>
              }
            />
            <Route
              path="/programs"
              element={
                <PageWrapper>
                  <ProgramsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/projects"
              element={
                <PageWrapper>
                  <ProjectsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/success"
              element={
                <PageWrapper>
                  <SuccessStoriesPage />
                </PageWrapper>
              }
            />
            <Route
              path="/news"
              element={
                <PageWrapper>
                  <NewsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/media"
              element={
                <PageWrapper>
                  <MediaPage />
                </PageWrapper>
              }
            />
            <Route
              path="/reports"
              element={
                <PageWrapper>
                  <ReportsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/transparency"
              element={
                <PageWrapper>
                  <TransparencyPage />
                </PageWrapper>
              }
            />
            <Route
              path="/volunteer"
              element={
                <PageWrapper>
                  <VolunteerPage />
                </PageWrapper>
              }
            />
            <Route
              path="/zakat"
              element={
                <PageWrapper>
                  <ZakatPage />
                </PageWrapper>
              }
            />
            <Route
              path="/endowment"
              element={
                <PageWrapper>
                  <EndowmentPage />
                </PageWrapper>
              }
            />
            <Route
              path="/donate"
              element={
                <PageWrapper>
                  <DonatePage />
                </PageWrapper>
              }
            />
            <Route
              path="/contact"
              element={
                <PageWrapper>
                  <ContactPage />
                </PageWrapper>
              }
            />
            <Route
              path="/messages"
              element={
                <PageWrapper>
                  <MessagesPage />
                </PageWrapper>
              }
            />
            <Route
              path="/subscribe"
              element={
                <PageWrapper>
                  <SubscriptionsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/partners"
              element={
                <PageWrapper>
                  <PartnersPage />
                </PageWrapper>
              }
            />
            <Route
              path="/login"
              element={
                <PageWrapper>
                  <LoginPage />
                </PageWrapper>
              }
            />
            <Route
              path="/donor"
              element={
                <PageWrapper>
                  <DonorPortalPage />
                </PageWrapper>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <PageWrapper>
                  <PrivacyPolicyPage />
                </PageWrapper>
              }
            />
            <Route
              path="/requests"
              element={
                <PageWrapper>
                  <BeneficiaryRequestPage />
                </PageWrapper>
              }
            />
            <Route
              path="/feedback"
              element={
                <PageWrapper>
                  <ComplaintsSuggestionPage />
                </PageWrapper>
              }
            />
            <Route
              path="/services"
              element={
                <PageWrapper>
                  <ServiceCatalogPage />
                </PageWrapper>
              }
            />
            <Route
              path="/impact"
              element={
                <PageWrapper>
                  <CommunityImpactPage />
                </PageWrapper>
              }
            />
            <Route
              path="/impact-center"
              element={
                <PageWrapper>
                  <ImpactCenterPage />
                </PageWrapper>
              }
            />
            <Route
              path="/help"
              element={
                <PageWrapper>
                  <HelpCenterPage />
                </PageWrapper>
              }
            />
            <Route
              path="/zakat-calculator"
              element={
                <PageWrapper>
                  <ZakatCalculatorPage />
                </PageWrapper>
              }
            />
            <Route
              path="/sadaqah-jariyah"
              element={
                <PageWrapper>
                  <SadaqahJariyahPage />
                </PageWrapper>
              }
            />
            <Route
              path="/training"
              element={
                <PageWrapper>
                  <TrainingPage />
                </PageWrapper>
              }
            />
            <Route
              path="/smart-advisor"
              element={
                <PageWrapper>
                  <SmartAdvisorPage />
                </PageWrapper>
              }
            />
            <Route
              path="/donor-passport"
              element={
                <PageWrapper>
                  <DonorPassportPage />
                </PageWrapper>
              }
            />
            <Route
              path="/interactive-map"
              element={
                <PageWrapper>
                  <InteractiveMapPage />
                </PageWrapper>
              }
            />
            <Route
              path="/corporate"
              element={
                <PageWrapper>
                  <CorporatePage />
                </PageWrapper>
              }
            />
            <Route
              path="/impact-for-business"
              element={
                <PageWrapper>
                  <ImpactForBusinessPage />
                </PageWrapper>
              }
            />
            <Route
              path="/donor-journey"
              element={
                <PageWrapper>
                  <DonorJourneyPage />
                </PageWrapper>
              }
            />
            <Route
              path="/campaigns"
              element={
                <PageWrapper>
                  <CampaignsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/major-donors"
              element={
                <PageWrapper>
                  <MajorDonorsPage />
                </PageWrapper>
              }
            />
            <Route
              path="/impact-engine"
              element={
                <PageWrapper>
                  <ImpactEnginePage />
                </PageWrapper>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PageWrapper>
                  <AdminPage />
                </PageWrapper>
              }
            />
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFoundPage />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
        </ErrorBoundary>
      </main>

      <SocialProof />
      <UrgencyBanner
        title="حملة كسوة الشتاء ٢٠٢٦"
        message="نسعى لتوفير كسوات شتوية لأكثر من ٢,٠٠٠ أسرة محتاجة"
        ctaText="تبرع الآن"
        ctaLink="/donate"
        type="urgent"
        dismissKey="winter_2026"
      />

      <Footer setCurrentPage={setCurrentPage} />

      {/* Global Utility Bar - accessible from any page */}
      <GlobalUtilityBar onSearchOpen={() => setIsSearchOpen(true)} />

      {/* Global Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setCurrentPage={setCurrentPage}
      />

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Fixed Donate Button - always visible */}
      <FixedDonateButton />

      {/* Social Proof Toast */}
      <SocialProofToast />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
});

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
