/**
 * Modal de personnalisation du consentement.
 *
 * - Liste des 4 catégories avec toggles on/off
 * - Catégorie "Nécessaires" : toggle grisé, toujours actif
 * - Détail des cookies par catégorie (expandable <details>)
 * - Focus trap (WCAG 2.1 AA)
 * - Boutons : Confirmer mes choix | Tout accepter
 */

import { CATEGORIES, CATEGORY_IDS } from '../core/categories.js';
import { createFocusTrap } from './a11y.js';

/**
 * Crée le modal et l'insère dans le DOM.
 * @param {object} config - Configuration (textes, catégories, callbacks)
 * @returns {object} { overlay, show(categories), hide() }
 */
export function createModal(config) {
  const texts = config.texts || {};
  const categoryTexts = texts.categories || {};
  let focusTrap = null;

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'cm-overlay cm-hidden';
  overlay.setAttribute('role', 'presentation');

  // Modal
  const modal = document.createElement('div');
  modal.className = 'cm-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', texts.modalTitle || 'Paramètres des cookies');

  overlay.appendChild(modal);

  function render(categories) {
    modal.innerHTML = `
      <h2 class="cm-modal-title">${texts.modalTitle || 'Paramètres des cookies'}</h2>
      <p class="cm-modal-desc">${texts.modalDesc || 'Choisissez les catégories de cookies que vous souhaitez autoriser.'}</p>
      <div class="cm-categories">
        ${CATEGORY_IDS.map(id => renderCategory(id, categories[id], categoryTexts[id])).join('')}
      </div>
      <div class="cm-modal-footer">
        <button class="cm-btn cm-btn-secondary" data-cm-action="confirm">
          ${texts.confirm || 'Confirmer mes choix'}
        </button>
        <button class="cm-btn cm-btn-primary" data-cm-action="accept-all">
          ${texts.acceptAll || 'Tout accepter'}
        </button>
      </div>
    `;
  }

  function renderCategory(id, isActive, catText) {
    const cat = CATEGORIES[id];
    const label = catText?.label || id;
    const desc = catText?.description || '';
    const cookies = catText?.cookies || [];

    return `
      <div class="cm-category">
        <div class="cm-category-header">
          <div>
            <span class="cm-category-name">${label}</span>
            ${cat.required ? '<span class="cm-category-required">(obligatoire)</span>' : ''}
          </div>
          <label class="cm-toggle">
            <input type="checkbox"
              data-cm-category="${id}"
              ${isActive ? 'checked' : ''}
              ${cat.required ? 'disabled' : ''}
              aria-label="${label}"
            >
            <span class="cm-toggle-track"></span>
          </label>
        </div>
        ${desc || cookies.length ? `
          <details class="cm-category-details">
            <summary>${texts.moreInfo || 'En savoir plus'}</summary>
            ${desc ? `<p>${desc}</p>` : ''}
            ${cookies.length ? `
              <ul class="cm-cookie-list">
                ${cookies.map(c => `<li><strong>${c.name}</strong> — ${c.description}${c.duration ? ` (${c.duration})` : ''}</li>`).join('')}
              </ul>
            ` : ''}
          </details>
        ` : ''}
      </div>
    `;
  }

  // Event delegation
  overlay.addEventListener('click', (e) => {
    // Clic sur l'overlay (hors modal) → fermer
    if (e.target === overlay) {
      hide();
      return;
    }

    const btn = e.target.closest('[data-cm-action]');
    if (!btn) return;

    const action = btn.dataset.cmAction;
    if (action === 'accept-all' && config.onAcceptAll) {
      config.onAcceptAll();
      hide();
    }
    if (action === 'confirm') {
      const selected = getSelectedCategories();
      if (config.onConfirm) config.onConfirm(selected);
      hide();
    }
  });

  // Escape ferme le modal
  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hide();
    }
  });

  function getSelectedCategories() {
    const checkboxes = modal.querySelectorAll('[data-cm-category]');
    const selected = [];
    checkboxes.forEach(cb => {
      if (cb.checked) selected.push(cb.dataset.cmCategory);
    });
    return selected;
  }

  function show(categories) {
    render(categories);
    overlay.classList.remove('cm-hidden');
    focusTrap = createFocusTrap(modal);
    focusTrap.activate();
  }

  function hide() {
    overlay.classList.add('cm-hidden');
    if (focusTrap) {
      focusTrap.deactivate();
      focusTrap = null;
    }
    if (config.onClose) config.onClose();
  }

  return { overlay, show, hide };
}
