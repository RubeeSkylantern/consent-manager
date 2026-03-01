/**
 * Adapter vanilla JS — pour Pokeo (PrestaShop).
 *
 * Usage en IIFE (le build consent-manager.iife.js expose ConsentManager.init) :
 *   <script src="/themes/axome/js/consent-manager.iife.js"></script>
 *   <script>
 *     ConsentManager.init({ ...config });
 *   </script>
 */

import { ConsentManager } from '../core/consent-manager.js';
import { initUI } from '../ui/ui-manager.js';
import { mergeConfig } from '../config/defaults.js';

/**
 * Initialise le Consent Manager en mode vanilla.
 * @param {object} overrides - Config spécifique au site
 * @returns {ConsentManager}
 */
export function init(overrides = {}) {
  const config = mergeConfig(overrides);
  const cm = new ConsentManager(config);
  initUI(cm, config);
  cm.init();
  return cm;
}
