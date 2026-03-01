/**
 * ConsentManager — classe principale orchestrant le consentement RGPD.
 *
 * Responsabilités :
 * - Lit le stockage au démarrage, affiche la bannière si pas de consentement
 * - Gère les actions utilisateur (acceptAll, rejectAll, acceptCategories)
 * - Expose une API pour les développeurs (hasConsent, onConsent)
 * - Coordonne Google Consent Mode v2
 * - Enregistre les preuves de consentement
 */

import { readConsent, writeConsent, clearConsent, isExpired } from './storage.js';
import { CATEGORIES, CATEGORY_IDS, getDefaultConsent } from './categories.js';
import { updateGoogleConsent } from './consent-mode-bridge.js';
import { recordProof, clearProofs } from './proof.js';
import { createEmitter } from './events.js';

export class ConsentManager {
  constructor(config = {}) {
    this.config = config;
    this.emitter = createEmitter();
    this.categories = getDefaultConsent();
    this._initialized = false;
    this._pendingCallbacks = []; // onConsent callbacks en attente
    this._ui = null; // référence vers le module UI
  }

  /** Initialise le consent manager : lit le stockage, affiche la bannière si nécessaire */
  init() {
    if (this._initialized) return;
    this._initialized = true;

    const stored = readConsent();

    if (stored && !isExpired(stored)) {
      // Consentement existant et non expiré
      this.categories = { ...getDefaultConsent(), ...stored.c };
      this._flushPendingCallbacks();
    } else {
      // Pas de consentement ou expiré → afficher la bannière
      this.categories = getDefaultConsent();
      this.showBanner();
    }
  }

  /** Accepte toutes les catégories */
  acceptAll() {
    for (const id of CATEGORY_IDS) {
      this.categories[id] = true;
    }
    this._save('accept_all');
    this.emitter.emit('consent:accept-all', this.categories);
    this.hideBanner();
  }

  /** Refuse toutes les catégories (sauf necessary) */
  rejectAll() {
    for (const id of CATEGORY_IDS) {
      this.categories[id] = CATEGORIES[id].required;
    }
    this._save('reject_all');
    this.emitter.emit('consent:reject-all', this.categories);
    this.hideBanner();
  }

  /** Accepte un sous-ensemble de catégories */
  acceptCategories(accepted) {
    for (const id of CATEGORY_IDS) {
      if (CATEGORIES[id].required) {
        this.categories[id] = true;
      } else {
        this.categories[id] = accepted.includes(id);
      }
    }
    this._save('accept_custom');
    this.hideBanner();
  }

  /** Vérifie si une catégorie est consentie */
  hasConsent(category) {
    return !!this.categories[category];
  }

  /**
   * Exécute un callback quand une catégorie est acceptée.
   * Si déjà acceptée, exécute immédiatement.
   * Sinon, exécute quand l'utilisateur accepte.
   */
  onConsent(category, callback) {
    if (this.hasConsent(category)) {
      callback();
    } else {
      this._pendingCallbacks.push({ category, callback });
    }
  }

  /** Affiche la bannière */
  showBanner() {
    if (this._ui) {
      this._ui.showBanner();
      this.emitter.emit('banner:show');
    }
  }

  /** Cache la bannière */
  hideBanner() {
    if (this._ui) {
      this._ui.hideBanner();
      this.emitter.emit('banner:hide');
    }
  }

  /** Affiche le modal de personnalisation */
  showModal() {
    if (this._ui) {
      this._ui.showModal(this.categories);
    }
  }

  /** Réinitialise tout le consentement (bannière réapparaît) */
  reset() {
    clearConsent();
    clearProofs();
    this.categories = getDefaultConsent();
    updateGoogleConsent(this.categories);
    this._pendingCallbacks = [];
    this.showBanner();
  }

  /** Retourne l'état actuel des catégories */
  getCategories() {
    return { ...this.categories };
  }

  /** Abonnement aux événements */
  on(event, fn) {
    this.emitter.on(event, fn);
  }

  off(event, fn) {
    this.emitter.off(event, fn);
  }

  /** Attache le module UI */
  _setUI(ui) {
    this._ui = ui;
  }

  /** Sauvegarde l'état, update Google Consent, enregistre la preuve */
  _save(action) {
    writeConsent(this.categories);
    updateGoogleConsent(this.categories);
    recordProof(action, this.categories);
    this.emitter.emit('consent:update', this.categories);
    this._flushPendingCallbacks();
  }

  /** Exécute les callbacks en attente dont la catégorie est maintenant consentie */
  _flushPendingCallbacks() {
    const remaining = [];
    for (const entry of this._pendingCallbacks) {
      if (this.hasConsent(entry.category)) {
        entry.callback();
      } else {
        remaining.push(entry);
      }
    }
    this._pendingCallbacks = remaining;
  }
}
