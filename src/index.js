/**
 * Entry point ESM — pour Nuxt 2 et Astro 5.
 * Exporte tout ce qui est nécessaire pour l'intégration.
 */

export { ConsentManager } from './core/consent-manager.js';
export { initUI } from './ui/ui-manager.js';
export { mergeConfig, defaultConfig } from './config/defaults.js';
export { getHeadSnippet, updateGoogleConsent } from './core/consent-mode-bridge.js';
export { readConsent, writeConsent, clearConsent } from './core/storage.js';
export { CATEGORIES, CATEGORY_IDS, getDefaultConsent } from './core/categories.js';

// Re-export des adapters
export { initConsent } from './adapters/astro-loader.js';
export { createConsentPlugin } from './adapters/nuxt2-plugin.js';
