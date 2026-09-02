// Step Scroll Hook - Section-by-Section Smooth Scrolling
// Implements the "خاصية الصعود التدريجي المنظم" feature
import { useState, useEffect, useCallback, useRef } from 'react';

interface Section {
  id: string;
  element: HTMLElement;
  top: number;
  bottom: number;
}

export function useStepScroll() {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [showStepUp, setShowStepUp] = useState(false);
  const [showStepDown, setShowStepDown] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isScrollingRef = useRef(false);

  // Collect all major sections
  useEffect(() => {
    const collectSections = () => {
      const sectionElements = document.querySelectorAll<HTMLElement>(
        'section[id], div[id][class*="section"], [data-section]'
      );
      
      const collected: Section[] = Array.from(sectionElements)
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.height > 100; // Only substantial sections
        })
        .map(el => ({
          id: el.id || el.dataset.section || '',
          element: el,
          top: el.offsetTop,
          bottom: el.offsetTop + el.offsetHeight,
        }))
        .filter(s => s.id); // Must have an ID

      setSections(collected);
    };

    collectSections();
    // Re-collect on resize
    window.addEventListener('resize', collectSections);
    return () => window.removeEventListener('resize', collectSections);
  }, []);

  // Track current section via IntersectionObserver
  useEffect(() => {
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            const aRect = a.boundingClientRect;
            const bRect = b.boundingClientRect;
            return Math.abs(aRect.top) - Math.abs(bRect.top);
          });

        if (visibleEntries.length > 0) {
          const closest = visibleEntries[0];
          const idx = sections.findIndex(s => s.element === closest.target);
          if (idx !== -1) {
            setCurrentSectionIndex(idx);
          }
        }
      },
      { threshold: [0.1, 0.3, 0.5], rootMargin: '-80px 0px -20% 0px' }
    );

    sections.forEach(s => observerRef.current?.observe(s.element));
    return () => observerRef.current?.disconnect();
  }, [sections]);

  // Update button visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      setShowStepUp(scrollY > 200);
      setShowStepDown(scrollY < maxScroll - 200);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to previous section (up)
  const scrollToPrevious = useCallback(() => {
    if (sections.length === 0 || currentSectionIndex <= 0) return;
    
    isScrollingRef.current = true;
    const targetIndex = currentSectionIndex - 1;
    const target = sections[targetIndex];
    
    if (target) {
      target.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSectionIndex(targetIndex);
    }

    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, [sections, currentSectionIndex]);

  // Scroll to next section (down)
  const scrollToNext = useCallback(() => {
    if (sections.length === 0 || currentSectionIndex >= sections.length - 1) return;
    
    isScrollingRef.current = true;
    const targetIndex = currentSectionIndex + 1;
    const target = sections[targetIndex];
    
    if (target) {
      target.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentSectionIndex(targetIndex);
    }

    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, [sections, currentSectionIndex]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentSectionIndex(0);
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight, 
      behavior: 'smooth' 
    });
    setCurrentSectionIndex(sections.length - 1);
  }, [sections.length]);

  return {
    currentSectionIndex,
    totalSections: sections.length,
    showStepUp,
    showStepDown,
    scrollToPrevious,
    scrollToNext,
    scrollToTop,
    scrollToBottom,
  };
}

