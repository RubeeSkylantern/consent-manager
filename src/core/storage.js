/**
 * Double stockage synchrone : cookie first-party + localStorage.
 *
 * Cookie : `__cm_consent`, Secure, SameSite=Lax, Max-Age=390j (13 mois CNIL)
 * localStorage : `__cm_consent`, même contenu, lecture synchrone pour le head snippet
 *
 * Format : { v: 1, t: timestamp, c: { necessary: true, analytics: false, ... } }
 */

const STORAGE_KEY = '__cm_consent';
const COOKIE_MAX_AGE = 390 * 24 * 60 * 60; // 13 mois en secondes
const FORMAT_VERSION = 1;

/** Lit le consentement depuis localStorage (synchrone, rapide) */
export function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data && data.v === FORMAT_VERSION && data.c) {
      return data;
    }
  } catch (e) { /* ignore */ }
  return null;
}

/** Écrit le consentement dans cookie + localStorage */
export function writeConsent(categories) {
  const data = {
    v: FORMAT_VERSION,
    t: Date.now(),
    c: { ...categories },
  };
  const json = JSON.stringify(data);

  // localStorage
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch (e) { /* ignore */ }

  // Cookie first-party
  try {
    const parts = [
      `${STORAGE_KEY}=${encodeURIComponent(json)}`,
      `max-age=${COOKIE_MAX_AGE}`,
      'path=/',
      'SameSite=Lax',
    ];
    // Secure uniquement en HTTPS
    if (location.protocol === 'https:') {
      parts.push('Secure');
    }
    document.cookie = parts.join('; ');
  } catch (e) { /* ignore */ }

  return data;
}

/** Supprime le consentement (cookie + localStorage) */
export function clearConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) { /* ignore */ }

  try {
    document.cookie = `${STORAGE_KEY}=; max-age=0; path=/; SameSite=Lax`;
  } catch (e) { /* ignore */ }
}

/** Vérifie si le consentement a expiré (>13 mois) */
export function isExpired(data) {
  if (!data || !data.t) return true;
  const maxAge = COOKIE_MAX_AGE * 1000; // en ms
  return (Date.now() - data.t) > maxAge;
}
