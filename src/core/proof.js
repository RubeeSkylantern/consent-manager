/**
 * Preuves de consentement.
 *
 * Stocke les 5 dernières interactions dans localStorage `__cm_proof`.
 * Chaque preuve contient un ID unique, timestamp, action, catégories choisies,
 * et un hash SHA-256 d'intégrité via crypto.subtle (natif navigateur).
 *
 * Actions possibles : accept_all, reject_all, accept_custom, update
 */

const PROOF_KEY = '__cm_proof';
const MAX_PROOFS = 5;

/** Génère un ID court aléatoire */
function generateId() {
  const arr = new Uint8Array(4);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
}

/** Calcule un hash SHA-256 de la payload (natif navigateur) */
async function computeHash(payload) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256-' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return null;
  }
}

/** Lit les preuves depuis localStorage */
function readProofs() {
  try {
    const raw = localStorage.getItem(PROOF_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data.proofs) ? data.proofs : [];
  } catch (e) {
    return [];
  }
}

/** Écrit les preuves dans localStorage */
function writeProofs(proofs) {
  try {
    localStorage.setItem(PROOF_KEY, JSON.stringify({ proofs }));
  } catch (e) { /* ignore */ }
}

/**
 * Enregistre une preuve de consentement.
 * @param {string} action - accept_all | reject_all | accept_custom | update
 * @param {object} categories - { necessary: true, analytics: false, ... }
 */
export async function recordProof(action, categories) {
  const proof = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    version: 1,
    action,
    categories: { ...categories },
  };

  // Hash d'intégrité sur les données significatives
  const hashPayload = JSON.stringify({
    id: proof.id,
    timestamp: proof.timestamp,
    action: proof.action,
    categories: proof.categories,
  });
  proof.hash = await computeHash(hashPayload);

  const proofs = readProofs();
  proofs.push(proof);

  // Garder uniquement les 5 dernières
  while (proofs.length > MAX_PROOFS) {
    proofs.shift();
  }

  writeProofs(proofs);
  return proof;
}

/** Retourne toutes les preuves stockées */
export function getProofs() {
  return readProofs();
}

/** Supprime toutes les preuves */
export function clearProofs() {
  try {
    localStorage.removeItem(PROOF_KEY);
  } catch (e) { /* ignore */ }
}
