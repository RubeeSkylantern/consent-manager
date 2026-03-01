/**
 * Adapter Nuxt 2 — pour SkyLantern.
 *
 * Usage dans nuxt.config.js :
 *   plugins: [{ src: '~/plugins/consent-manager.client.js', mode: 'client' }]
 *
 * Dans le plugin :
 *   import { createConsentPlugin } from 'consent-manager/adapters/nuxt2-plugin';
 *   export default createConsentPlugin({ ...config });
 */

import { ConsentManager } from '../core/consent-manager.js';
import { initUI } from '../ui/ui-manager.js';
import { mergeConfig } from '../config/defaults.js';

/**
 * Crée un plugin Nuxt 2 qui injecte le ConsentManager dans le contexte.
 * Accessible via `this.$consent` dans les composants et `ctx.$consent` dans asyncData.
 *
 * @param {object} overrides - Config spécifique au site
 * @returns {function} Plugin Nuxt 2
 */
export function createConsentPlugin(overrides = {}) {
  return function consentPlugin(ctx, inject) {
    const config = mergeConfig(overrides);
    const cm = new ConsentManager(config);
    initUI(cm, config);
    inject('consent', cm);
    cm.init();
  };
}
