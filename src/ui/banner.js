/**
 * Bannière de consentement RGPD.
 *
 * - Position : bas de l'écran
 * - 3 boutons : Tout refuser | Personnaliser | Tout accepter
 * - "Tout refuser" et "Tout accepter" même poids visuel (conformité RGPD)
 * - role="dialog", aria-label
 */

/**
 * Crée la bannière et l'insère dans le DOM.
 * @param {object} config - Configuration (textes, callbacks)
 * @returns {HTMLElement} L'élément bannière
 */
export function createBanner(config) {
  const texts = config.texts || {};
  const el = document.createElement('div');
  el.className = 'cm-banner';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', texts.bannerAriaLabel || 'Gestion des cookies');

  el.innerHTML = `
    <div class="cm-banner-text">
      ${texts.bannerText || 'Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez personnaliser vos préférences.'}
      ${texts.privacyLink ? ` <a href="${texts.privacyLink}">${texts.privacyLinkText || 'Politique de confidentialité'}</a>` : ''}
    </div>
    <div class="cm-banner-actions">
      <button class="cm-btn cm-btn-secondary" data-cm-action="reject">
        ${texts.rejectAll || 'Tout refuser'}
      </button>
      <button class="cm-btn cm-btn-link" data-cm-action="customize">
        ${texts.customize || 'Personnaliser'}
      </button>
      <button class="cm-btn cm-btn-primary" data-cm-action="accept">
        ${texts.acceptAll || 'Tout accepter'}
      </button>
    </div>
  `;

  // Event delegation
  el.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cm-action]');
    if (!btn) return;

    const action = btn.dataset.cmAction;
    if (action === 'accept' && config.onAcceptAll) config.onAcceptAll();
    if (action === 'reject' && config.onRejectAll) config.onRejectAll();
    if (action === 'customize' && config.onCustomize) config.onCustomize();
  });

  return el;
}
