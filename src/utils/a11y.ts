// Focus management utilities for accessibility
/**
 * Focus an element safely, returning whether focus was successfully moved.
 * Works with programmatic focus and keyboard navigation.
 */
export function focusElement(selector: string): boolean {
  const element = document.querySelector(selector);
  if (element instanceof HTMLElement) {
    element.focus();
    return true;
  }
  return false;
}

/**
 * Trap focus within a container element for accessible modals/dialogs.
 * Limits Tab navigation to focusable elements within the container.
 * Returns a cleanup function to remove the event listener.
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    return () => {};
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener("keydown", handleKeyDown);
  firstElement.focus();

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Announce a message to screen readers via aria-live region.
 * Uses polite live region for non-interruptive announcements.
 * Reuses existing live region or creates one if needed.
 */
export function announceToScreenReader(message: string): void {
  // Check if live region already exists
  const liveRegion = document.querySelector('[role="status"][aria-live="polite"]');

  if (liveRegion) {
    liveRegion.textContent = message;
  } else {
    const announcement = document.createElement("div");
    announcement.setAttribute("role", "status");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;
    document.body.appendChild(announcement);
  }

  // Clean up after announcement
  setTimeout(() => {
    const region = document.querySelector('[role="status"][aria-live="polite"]');
    if (region && region.parentNode) {
      region.textContent = "";
    }
  }, 1000);
}

/**
 * Set the page title with consistent formatting and localization support.
 * Appends the organization name for brand consistency.
 */
export function setPageTitle(title: string): void {
  const orgName = "رحماء بينهم";
  document.title = `${title} | ${orgName}`;
}

/**
 * Skip to main content — programatically move focus to the main content area.
 * Designed for keyboard users to bypass navigation menus.
 */
export function skipToMainContent(): void {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    // Remove any existing tabindex and set focus with preventScroll for better UX
    mainContent.removeAttribute("tabindex");
    mainContent.focus({
      preventScroll: true
    });
  }
}

/**
 * Manage focus order after modal dialog closes.
 * Returns focus to the element that triggered the modal, or to the first focusable element.
 */
export function restoreFocus(previousFocus: HTMLElement | null): void {
  if (previousFocus && previousFocus.focus) {
    previousFocus.focus({
      preventScroll: true
    });
  } else {
    // Fallback: skip to main content
    skipToMainContent();
  }
}
