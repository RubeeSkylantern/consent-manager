/**
 * Configuration par défaut.
 * Chaque site override uniquement ce qui change.
 */

export const defaultConfig = {
  /** Afficher le bouton reopener (true par défaut) */
  reopener: true,

  /** Thème visuel (variables CSS) */
  theme: {
    primaryColor: '#2563eb',
    primaryHoverColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    textSecondaryColor: '#6b7280',
    borderColor: '#e5e7eb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    borderRadius: '12px',
  },

  /** Textes de l'interface */
  texts: {
    bannerText: 'Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu. Vous pouvez choisir les cookies que vous acceptez.',
    bannerAriaLabel: 'Gestion des cookies',
    acceptAll: 'Tout accepter',
    rejectAll: 'Tout refuser',
    customize: 'Personnaliser',
    modalTitle: 'Paramètres des cookies',
    modalDesc: 'Choisissez les catégories de cookies que vous souhaitez autoriser. Les cookies nécessaires sont indispensables au fonctionnement du site.',
    confirm: 'Confirmer mes choix',
    moreInfo: 'En savoir plus',
    privacyLink: '',
    privacyLinkText: 'Politique de confidentialité',
    reopenerAriaLabel: 'Modifier mes préférences cookies',
    reopenerTitle: 'Cookies',

    /** Textes par catégorie */
    categories: {
      necessary: {
        label: 'Nécessaires',
        description: 'Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.',
        cookies: [],
      },
      analytics: {
        label: 'Analytiques',
        description: 'Ces cookies nous permettent de mesurer le trafic et d\'analyser votre utilisation du site pour en améliorer les performances.',
        cookies: [
          { name: 'Google Analytics', description: 'Mesure d\'audience et statistiques de navigation', duration: '13 mois' },
        ],
      },
      marketing: {
        label: 'Marketing',
        description: 'Ces cookies sont utilisés pour le suivi publicitaire et le remarketing.',
        cookies: [
          { name: 'Google Ads', description: 'Suivi des conversions et remarketing', duration: '13 mois' },
        ],
      },
      personalization: {
        label: 'Personnalisation',
        description: 'Ces cookies permettent de personnaliser votre expérience sur le site.',
        cookies: [],
      },
    },
  },
};

/** Fusionne une config partielle avec les defaults */
export function mergeConfig(overrides = {}) {
  return {
    reopener: overrides.reopener ?? defaultConfig.reopener,
    theme: { ...defaultConfig.theme, ...overrides.theme },
    texts: {
      ...defaultConfig.texts,
      ...overrides.texts,
      categories: mergeCategoryTexts(
        defaultConfig.texts.categories,
        overrides.texts?.categories
      ),
    },
  };
}

function mergeCategoryTexts(defaults, overrides) {
  if (!overrides) return { ...defaults };
  const result = { ...defaults };
  for (const [key, val] of Object.entries(overrides)) {
    result[key] = { ...defaults[key], ...val };
  }
  return result;
}
