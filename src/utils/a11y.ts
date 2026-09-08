// Focus management utilities for accessibility
export function focusElement(selector: string): void {
  const element = document.querySelector(selector);
  if (element instanceof HTMLElement) {
    element.focus();
  }
}

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

export function announceToScreenReader(message: string): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

export function setPageTitle(title: string): void {
  document.title = `${title} | رحماء بينهم`;
}

export function skipToMainContent(): void {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.setAttribute("tabindex", "-1");
    mainContent.focus();
  }
}
