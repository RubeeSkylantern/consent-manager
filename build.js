import esbuild from 'esbuild';
import { readFileSync } from 'fs';

const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const shared = {
  bundle: true,
  minify: true,
  target: ['es2020'],
  loader: { '.css': 'text' },
};

// ESM build (for Nuxt, Astro — tree-shakeable)
const esmBuild = esbuild.build({
  ...shared,
  entryPoints: ['src/index.js'],
  outfile: 'dist/consent-manager.esm.js',
  format: 'esm',
});

// IIFE build (for PrestaShop — standalone)
const iifeBuild = esbuild.build({
  ...shared,
  entryPoints: ['src/index-iife.js'],
  outfile: 'dist/consent-manager.iife.js',
  format: 'iife',
  globalName: 'ConsentManager',
});

if (watch) {
  const ctx1 = await esbuild.context({ ...shared, entryPoints: ['src/index.js'], outfile: 'dist/consent-manager.esm.js', format: 'esm' });
  const ctx2 = await esbuild.context({ ...shared, entryPoints: ['src/index-iife.js'], outfile: 'dist/consent-manager.iife.js', format: 'iife', globalName: 'ConsentManager' });
  await ctx1.watch();
  await ctx2.watch();
  console.log('Watching for changes...');
} else {
  await Promise.all([esmBuild, iifeBuild]);

  // Report sizes
  const esm = readFileSync('dist/consent-manager.esm.js');
  const iife = readFileSync('dist/consent-manager.iife.js');
  console.log(`ESM:  ${(esm.length / 1024).toFixed(1)}KB raw`);
  console.log(`IIFE: ${(iife.length / 1024).toFixed(1)}KB raw`);
}
