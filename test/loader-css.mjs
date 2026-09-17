/**
 * Hook de chargement : rend les `import ... from './x.css'` inoffensifs sous Node nu.
 *
 * Le build esbuild transforme le CSS en chaîne de caractères ; Node ne sait pas le faire.
 * Plutôt que d'altérer le code source pour les tests, on neutralise l'extension ici.
 */
export async function load (url, context, next) {
  if (url.endsWith('.css')) {
    return { format: 'module', shortCircuit: true, source: 'export default "";' };
  }
  return next(url, context);
}
