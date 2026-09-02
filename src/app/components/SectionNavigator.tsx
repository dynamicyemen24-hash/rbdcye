// Section Navigator - Smooth scrolling navigation for homepage sections
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface SectionNavigatorProps {
  readonly sections?: string[];
  readonly position?: "bottom-left" | "bottom-right" | "bottom-center";
}

// Default sections for homepage
const DEFAULT_SECTIONS = [
  "hero", 
  "impact-stats", 
  "quick-donation", 
  "zakat-calculator", 
  "programs", 
  "success-stories", 
  "partners",
  "news", 
  "contact"
];

export function SectionNavigator({ 
  sections = DEFAULT_SECTIONS, 
  position = "bottom-right" 
}: SectionNavigatorProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showNavigator, setShowNavigator] = useState(true);

  // Update current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const _scrollPosition = window.scrollY;
      
      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setCurrentSectionIndex(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Scroll to next section
  const scrollToNextSection = () => {
    const nextIndex = Math.min(currentSectionIndex + 1, sections.length - 1);
    scrollToSection(sections[nextIndex]);
    setCurrentSectionIndex(nextIndex);
  };

  // Scroll to previous section
  const scrollToPrevSection = () => {
    const prevIndex = Math.max(currentSectionIndex - 1, 0);
    scrollToSection(sections[prevIndex]);
    setCurrentSectionIndex(prevIndex);
  };

  // Scroll to specific section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Hide navigator on mobile when at top
  useEffect(() => {
    const handleResize = () => {
      setShowNavigator(window.innerWidth > 768);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const positionClasses = {
    "bottom-left": "bottom-6 left-6",
    "bottom-right": "bottom-6 right-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2"
  };

  if (!showNavigator) return null;

  return (
    <div className={`fixed ${positionClasses[position]} z-50 flex flex-col items-center gap-2 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg border border-[var(--border)]`}>
      {/* Previous Section Button */}
      <button
        onClick={scrollToPrevSection}
        disabled={currentSectionIndex === 0}
        className={`p-2 rounded-full transition-all ${
          currentSectionIndex === 0 
            ? "text-gray-300 cursor-not-allowed" 
            : "text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)]"
        }`}
        aria-label="الانتقال إلى القسم السابق"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Section Indicators */}
      <div className="flex flex-col gap-1">
        {sections.map((sectionId, index) => (
          <button
            key={sectionId}
            onClick={() => scrollToSection(sectionId)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSectionIndex
                ? "bg-[var(--brand-green)] scale-125"
                : "bg-gray-300 hover:bg-[var(--brand-green)]/50"
            }`}
            aria-label={`الانتقال إلى القسم ${index + 1}`}
          />
        ))}
      </div>

      {/* Next Section Button */}
      <button
        onClick={scrollToNextSection}
        disabled={currentSectionIndex === sections.length - 1}
        className={`p-2 rounded-full transition-all ${
          currentSectionIndex === sections.length - 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-[var(--brand-green)] hover:bg-[var(--brand-green-pale)]"
        }`}
        aria-label="الانتقال إلى القسم التالي"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
}

// Hook for section navigation
export function useSectionNavigation(sections: string[] = DEFAULT_SECTIONS) {
  const [currentSection, setCurrentSection] = useState<string>(sections[0] || "hero");

  useEffect(() => {
    const handleScroll = () => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setCurrentSection(sectionId);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return { currentSection, sections };
}

