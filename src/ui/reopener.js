/**
 * Bouton flottant de re-consentement.
 *
 * - Petit bouton bas-gauche avec icône cookie
 * - Apparaît après le premier choix utilisateur
 * - Clic → ouvre le modal de personnalisation
 * - Désactivable via config.reopener = false
 */

/**
 * Crée le bouton reopener et l'insère dans le DOM.
 * @param {object} config - { onClick }
 * @returns {HTMLElement}
 */
export function createReopener(config) {
  const el = document.createElement('button');
  el.className = 'cm-reopener cm-hidden';
  el.setAttribute('aria-label', config.ariaLabel || 'Modifier mes préférences cookies');
  el.setAttribute('title', config.title || 'Cookies');
  el.textContent = '\u{1F36A}'; // 🍪

  el.addEventListener('click', () => {
    if (config.onClick) config.onClick();
  });

  return el;
}
