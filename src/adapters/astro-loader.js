/**
 * Adapter Astro 5 — pour Brumeaux.
 *
 * Usage dans un layout Astro :
 *   <script>
 *     import { initConsent } from 'consent-manager/adapters/astro-loader';
 *     initConsent({ ...config });
 *   </script>
 *
 * Astro rend les composants côté serveur par défaut.
 * Ce loader est prévu pour être utilisé dans un <script> client-side.
 */

import { ConsentManager } from '../core/consent-manager.js';
import { initUI } from '../ui/ui-manager.js';
import { mergeConfig } from '../config/defaults.js';

/**
 * Initialise le Consent Manager dans un contexte Astro.
 * @param {object} overrides - Config spécifique au site
 * @returns {ConsentManager}
 */
export function initConsent(overrides = {}) {
  const config = mergeConfig(overrides);
  const cm = new ConsentManager(config);
  initUI(cm, config);
  cm.init();
  return cm;
}
