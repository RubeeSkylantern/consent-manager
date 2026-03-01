/**
 * UI Manager — assemble bannière, modal et reopener,
 * et les connecte au ConsentManager.
 */

import { createBanner } from './banner.js';
import { createModal } from './modal.js';
import { createReopener } from './reopener.js';
import styles from './styles.css';

/** Injecte les styles CSS dans le <head> */
function injectStyles() {
  if (document.getElementById('cm-styles')) return;
  const style = document.createElement('style');
  style.id = 'cm-styles';
  style.textContent = styles;
  document.head.appendChild(style);
}

/**
 * Initialise toute l'UI et la connecte au ConsentManager.
 * @param {ConsentManager} cm - Instance du ConsentManager
 * @param {object} config - Configuration (textes, thème, etc.)
 */
export function initUI(cm, config = {}) {
  injectStyles();

  // Appliquer le thème via variables CSS
  if (config.theme) {
    const root = document.documentElement;
    const themeMap = {
      primaryColor: '--cm-primary',
      primaryHoverColor: '--cm-primary-hover',
      backgroundColor: '--cm-bg',
      textColor: '--cm-text',
      textSecondaryColor: '--cm-text-secondary',
      borderColor: '--cm-border',
      fontFamily: '--cm-font',
      borderRadius: '--cm-radius',
    };
    for (const [key, cssVar] of Object.entries(themeMap)) {
      if (config.theme[key]) {
        root.style.setProperty(cssVar, config.theme[key]);
      }
    }
  }

  // Créer la bannière
  const bannerEl = createBanner({
    texts: config.texts || {},
    onAcceptAll: () => cm.acceptAll(),
    onRejectAll: () => cm.rejectAll(),
    onCustomize: () => modal.show(cm.getCategories()),
  });

  // Créer le modal
  const modal = createModal({
    texts: config.texts || {},
    onAcceptAll: () => cm.acceptAll(),
    onConfirm: (selected) => cm.acceptCategories(selected),
    onClose: () => {},
  });

  // Créer le reopener (sauf si désactivé)
  const showReopener = config.reopener !== false;
  const reopenerEl = showReopener ? createReopener({
    ariaLabel: config.texts?.reopenerAriaLabel,
    title: config.texts?.reopenerTitle,
    onClick: () => modal.show(cm.getCategories()),
  }) : null;

  // Insérer dans le DOM
  document.body.appendChild(bannerEl);
  document.body.appendChild(modal.overlay);
  if (reopenerEl) document.body.appendChild(reopenerEl);

  // Connecter au ConsentManager
  cm._setUI({
    showBanner() {
      bannerEl.classList.remove('cm-hidden');
      if (reopenerEl) reopenerEl.classList.add('cm-hidden');
    },
    hideBanner() {
      bannerEl.classList.add('cm-hidden');
      if (reopenerEl) reopenerEl.classList.remove('cm-hidden');
    },
    showModal(categories) {
      modal.show(categories);
    },
  });
}
