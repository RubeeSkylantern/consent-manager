# consent-manager

Package JavaScript custom de gestion du consentement cookies, conforme RGPD, avec Google Consent Mode v2.

**6.3KB gzip** | Vanilla JS | ESM + IIFE | Theming CSS | i18n

## Installation

```bash
npm install github:RubeeSkylantern/consent-manager
```

Pour PrestaShop (sans bundler), copier `dist/consent-manager.iife.js` dans le theme.

## Quickstart

### Astro (Brumeaux)

Dans le `<head>` du layout, **avant GTM** :

```html
<!-- Consent Mode v2 inline snippet (AVANT GTM) -->
<script is:inline>
(function(){var d={ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',
ad_personalization:'denied',personalization_storage:'denied',functionality_storage:'granted',
security_storage:'granted'};try{var c=JSON.parse(localStorage.getItem('__cm_consent'));
if(c&&c.c){if(c.c.analytics)d.analytics_storage='granted';if(c.c.marketing){d.ad_storage='granted';
d.ad_user_data='granted';d.ad_personalization='granted'}if(c.c.personalization)
d.personalization_storage='granted'}}catch(e){}window.dataLayer=window.dataLayer||[];
function g(){window.dataLayer.push(arguments)}window.gtag=g;g('consent','default',d);
g('set','url_passthrough',true);g('set','ads_data_redaction',d.ad_storage==='denied')})();
</script>

<!-- GTM -->
<script is:inline>
(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXX');
</script>
```

Puis dans le body :

```html
<script>
  import { initConsent } from "consent-manager";

  initConsent({
    theme: {
      primaryColor: "#2D5016",
      backgroundColor: "#F5F0EB",
    },
    texts: {
      privacyLink: "/confidentialite",
    },
  });
</script>
```

### Nuxt 2 (SkyLantern)

`plugins/consent-manager.client.js` :

```js
import { createConsentPlugin } from "consent-manager/adapters/nuxt2-plugin";

export default createConsentPlugin({
  theme: {
    primaryColor: "#0097A7",
    backgroundColor: "#06132F",
    textColor: "#FFFFFF",
  },
});
```

`nuxt.config.js` :

```js
plugins: [
  { src: "~/plugins/consent-manager.client.js", mode: "client" },
],
```

### PrestaShop / Vanilla (Pokeo)

```html
<script src="/themes/axome/js/consent-manager.iife.js"></script>
<script>
  ConsentManager.init({
    theme: {
      primaryColor: "#C41E3A",
    },
    texts: {
      privacyLink: "/content/2-mentions-legales",
    },
  });
</script>
```

## Configuration

```js
{
  // Bouton reopener (cookie flottant bas-gauche)
  reopener: true,

  // Theme visuel (variables CSS)
  theme: {
    primaryColor: '#2563eb',      // Boutons principaux
    primaryHoverColor: '#1d4ed8', // Hover boutons
    backgroundColor: '#ffffff',    // Fond banniere + modal
    textColor: '#1f2937',          // Texte principal
    textSecondaryColor: '#6b7280', // Texte secondaire
    borderColor: '#e5e7eb',        // Bordures
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: '12px',
  },

  // Textes de l'interface (pour i18n, passer l'objet complet)
  texts: {
    bannerText: 'Nous utilisons des cookies...',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    customize: 'Personnaliser',
    modalTitle: 'Parametres des cookies',
    modalDesc: 'Choisissez les categories...',
    confirm: 'Confirmer mes choix',
    moreInfo: 'En savoir plus',
    privacyLink: '/confidentialite',
    privacyLinkText: 'Politique de confidentialite',

    // Textes par categorie
    categories: {
      necessary: {
        label: 'Necessaires',
        description: 'Indispensables au fonctionnement du site.',
        cookies: [],
      },
      analytics: {
        label: 'Analytiques',
        description: 'Mesure d\'audience et statistiques.',
        cookies: [
          { name: 'Google Analytics', description: 'Mesure d\'audience', duration: '13 mois' },
        ],
      },
      marketing: {
        label: 'Marketing',
        description: 'Suivi publicitaire et remarketing.',
        cookies: [
          { name: 'Google Ads', description: 'Conversions et remarketing', duration: '13 mois' },
        ],
      },
      personalization: {
        label: 'Personnalisation',
        description: 'Personnalisation de votre experience.',
        cookies: [],
      },
    },
  },
}
```

Seuls les champs que vous surchargez sont necessaires. Les autres conservent leur valeur par defaut.

## API

### ConsentManager

| Methode | Description |
|---------|-------------|
| `init()` | Lit le stockage, affiche la banniere si pas de consentement |
| `acceptAll()` | Accepte toutes les categories |
| `rejectAll()` | Refuse tout (sauf necessary) |
| `acceptCategories(ids[])` | Accepte un sous-ensemble de categories |
| `hasConsent(category)` | `true` si la categorie est consentie |
| `onConsent(category, fn)` | Execute `fn` quand la categorie est acceptee (immediatement si deja consentie) |
| `showBanner()` | Affiche la banniere |
| `showModal()` | Ouvre le modal de personnalisation |
| `reset()` | Reinitialise tout (banniere reapparait) |
| `getCategories()` | Retourne `{ necessary, analytics, marketing, personalization }` |
| `on(event, fn)` | Ecoute un evenement |
| `off(event, fn)` | Retire un listener |

### Evenements

| Evenement | Payload | Quand |
|-----------|---------|-------|
| `consent:update` | `{ necessary, analytics, ... }` | Apres toute action utilisateur |
| `consent:accept-all` | `{ necessary, analytics, ... }` | "Tout accepter" clique |
| `consent:reject-all` | `{ necessary, analytics, ... }` | "Tout refuser" clique |
| `banner:show` | — | Banniere affichee |
| `banner:hide` | — | Banniere masquee |

### Exemple : conditionner un script au consentement

```js
const cm = initConsent({ ... });

// Execute immediatement si analytics deja consenti,
// sinon attend l'acceptation
cm.onConsent('analytics', () => {
  // Charger un script tiers
});

cm.onConsent('marketing', () => {
  // Activer Facebook Pixel
  fbq('init', 'XXXXX');
});
```

## Google Consent Mode v2

### Fonctionnement

1. **Snippet inline dans `<head>`** (AVANT GTM) — pose `gtag('consent', 'default', {...})` avec tous les signaux a `denied`. Lit `localStorage` pour restaurer le consentement existant.

2. **GTM charge** — bufferise les tags en attente de consentement.

3. **L'utilisateur interagit** avec la banniere/modal.

4. **`gtag('consent', 'update', {...})`** — debloque les tags GTM concernes.

### Mapping categories → signaux Google

| Categorie | Signaux Google |
|-----------|----------------|
| `necessary` | `functionality_storage: granted`, `security_storage: granted` (toujours) |
| `analytics` | `analytics_storage` |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| `personalization` | `personalization_storage` |

### Snippet head (version lisible)

Le snippet minifie (~500 bytes) dans `getHeadSnippet()` fait ceci :

```js
(function () {
  // Signaux par defaut : tout denied sauf functionality + security
  var defaults = {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    personalization_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  };

  // Restaure le consentement precedent depuis localStorage
  try {
    var stored = JSON.parse(localStorage.getItem('__cm_consent'));
    if (stored && stored.c) {
      if (stored.c.analytics) defaults.analytics_storage = 'granted';
      if (stored.c.marketing) {
        defaults.ad_storage = 'granted';
        defaults.ad_user_data = 'granted';
        defaults.ad_personalization = 'granted';
      }
      if (stored.c.personalization) defaults.personalization_storage = 'granted';
    }
  } catch (e) {}

  // Pose le consent default dans le dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', defaults);
  gtag('set', 'url_passthrough', true);
  gtag('set', 'ads_data_redaction', defaults.ad_storage === 'denied');
})();
```

## Stockage

### Cookie + localStorage

| Cle | Type | Duree | Contenu |
|-----|------|-------|---------|
| `__cm_consent` | Cookie first-party + localStorage | 13 mois (390j) | `{ v, t, c: { necessary, analytics, marketing, personalization } }` |
| `__cm_proof` | localStorage | Permanent (max 5 entrees) | Preuves de consentement avec hash SHA-256 |

Le cookie utilise `Secure`, `SameSite=Lax`, `path=/`.

### Format consentement

```json
{
  "v": 1,
  "t": 1772436713899,
  "c": {
    "necessary": true,
    "analytics": true,
    "marketing": false,
    "personalization": false
  }
}
```

### Format preuve

```json
{
  "proofs": [{
    "id": "a1b2c3d4",
    "timestamp": "2026-03-02T07:31:53.901Z",
    "version": 1,
    "action": "accept_custom",
    "categories": { "necessary": true, "analytics": true, "marketing": false, "personalization": false },
    "hash": "sha256-d73b09e40a27..."
  }]
}
```

Actions possibles : `accept_all`, `reject_all`, `accept_custom`.

## Architecture

```
src/
  core/
    consent-manager.js      # Classe principale, orchestre tout
    storage.js               # Cookie first-party + localStorage (13 mois)
    categories.js            # 4 categories RGPD
    consent-mode-bridge.js   # Snippet head + gtag consent update
    proof.js                 # Preuves SHA-256 (max 5, rotation auto)
    events.js                # Mini event emitter (~500 bytes)
  ui/
    banner.js                # Banniere bas de page, 3 boutons
    modal.js                 # Modal personnalisation, 4 toggles
    reopener.js              # Bouton flottant cookie (bas-gauche)
    styles.css               # Variables CSS pour theming
    a11y.js                  # Focus trap WCAG 2.1 AA
    ui-manager.js            # Assemblage UI + injection CSS + theming
  adapters/
    astro-loader.js          # initConsent() pour Astro
    nuxt2-plugin.js          # createConsentPlugin() pour Nuxt 2
    vanilla-loader.js        # init() pour IIFE/PrestaShop
  config/
    defaults.js              # Config par defaut + mergeConfig()
  index.js                   # Entry ESM
  index-iife.js              # Entry IIFE (expose window.ConsentManager)
```

## Build

```bash
npm run build          # ESM + IIFE dans dist/
npm run build:watch    # Mode watch
```

Produit :
- `dist/consent-manager.esm.js` — pour Astro/Nuxt (import via bundler)
- `dist/consent-manager.iife.js` — pour PrestaShop (script tag)

## Sites integres

| Site | Stack | Adapter | Statut |
|------|-------|---------|--------|
| brumeaux.fr | Astro 5 SSR | `initConsent()` | Deploye |
| skylantern.fr | Nuxt 2 | `createConsentPlugin()` | En attente |
| pokeo.fr | PrestaShop 1.5 | IIFE `ConsentManager.init()` | En attente |
