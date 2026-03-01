/**
 * Catégories de consentement.
 * "necessary" est toujours actif et ne peut pas être désactivé.
 */
export const CATEGORIES = {
  necessary: {
    id: 'necessary',
    required: true,
    defaultValue: true,
  },
  analytics: {
    id: 'analytics',
    required: false,
    defaultValue: false,
  },
  marketing: {
    id: 'marketing',
    required: false,
    defaultValue: false,
  },
  personalization: {
    id: 'personalization',
    required: false,
    defaultValue: false,
  },
};

export const CATEGORY_IDS = Object.keys(CATEGORIES);

/** Retourne l'état par défaut (tout refusé sauf necessary) */
export function getDefaultConsent() {
  const consent = {};
  for (const [id, cat] of Object.entries(CATEGORIES)) {
    consent[id] = cat.defaultValue;
  }
  return consent;
}
