/**
 * Accessibilité (WCAG 2.1 AA)
 * - Focus trap pour le modal
 * - Gestion du clavier (Tab, Escape)
 * - Gestion du focus au retour
 */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Crée un focus trap dans un élément */
export function createFocusTrap(container) {
  let previousFocus = null;

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      const focusable = container.querySelectorAll(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  return {
    activate() {
      previousFocus = document.activeElement;
      container.addEventListener('keydown', handleKeyDown);
      // Focus le premier élément focusable
      const first = container.querySelector(FOCUSABLE);
      if (first) first.focus();
    },

    deactivate() {
      container.removeEventListener('keydown', handleKeyDown);
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    },
  };
}
