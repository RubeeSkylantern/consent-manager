/**
 * Google Consent Mode v2 bridge.
 *
 * Deux parties :
 * 1. getHeadSnippet() — snippet inline à injecter AVANT GTM dans <head>
 *    Lit localStorage pour poser le consent default de façon synchrone
 * 2. updateConsent() — appelé après interaction utilisateur pour gtag('consent', 'update', ...)
 *
 * Mapping catégories → signaux Google :
 *   analytics       → analytics_storage
 *   marketing       → ad_storage, ad_user_data, ad_personalization
 *   personalization → personalization_storage
 *   necessary       → functionality_storage, security_storage (toujours granted)
 */

/**
 * Retourne le snippet inline à injecter dans <head> avant GTM.
 * Ce snippet est autonome (~500 bytes) et ne dépend d'aucun module.
 */
export function getHeadSnippet() {
  return `(function(){var d={ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',personalization_storage:'denied',functionality_storage:'granted',security_storage:'granted'};try{var c=JSON.parse(localStorage.getItem('__cm_consent'));if(c&&c.c){if(c.c.analytics)d.analytics_storage='granted';if(c.c.marketing){d.ad_storage='granted';d.ad_user_data='granted';d.ad_personalization='granted'}if(c.c.personalization)d.personalization_storage='granted'}}catch(e){}window.dataLayer=window.dataLayer||[];function g(){window.dataLayer.push(arguments)}window.gtag=g;g('consent','default',d);g('set','url_passthrough',true);g('set','ads_data_redaction',d.ad_storage==='denied')})();`;
}

/** Convertit l'état des catégories en signaux Google Consent Mode */
function categoriesToGoogleSignals(categories) {
  return {
    analytics_storage: categories.analytics ? 'granted' : 'denied',
    ad_storage: categories.marketing ? 'granted' : 'denied',
    ad_user_data: categories.marketing ? 'granted' : 'denied',
    ad_personalization: categories.marketing ? 'granted' : 'denied',
    personalization_storage: categories.personalization ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  };
}

/** Envoie gtag('consent', 'update', ...) après interaction utilisateur */
export function updateGoogleConsent(categories) {
  if (typeof window === 'undefined') return;

  const signals = categoriesToGoogleSignals(categories);

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  window.gtag('consent', 'update', signals);
  window.gtag('set', 'ads_data_redaction', signals.ad_storage === 'denied');
}
