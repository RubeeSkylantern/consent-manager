/**
 * Entry point IIFE — pour PrestaShop (Pokeo).
 * Expose ConsentManager.init() en global.
 */

export { init } from './adapters/vanilla-loader.js';
export { getHeadSnippet } from './core/consent-mode-bridge.js';
